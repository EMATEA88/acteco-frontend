import { useEffect, useRef, useState } from "react";
import { App as CapacitorApp } from "@capacitor/app";
import {
  BiometricAuth,
  BiometryError,
  BiometryErrorType,
} from "@aparajita/capacitor-biometric-auth";
import {
  Fingerprint,
  LockKeyhole,
  Delete,
  Check,
} from "lucide-react";
import appLockService from "../services/app-lock.service";
import { Capacitor } from "@capacitor/core";

type LockMode = "LOADING" | "SETUP" | "UNLOCK" | "UNLOCKED";

export default function AppLockGate({
  children,
}: {
  children: React.ReactNode;
}) {
  const isNativeApp = Capacitor.isNativePlatform();

  const [mode, setMode] = useState<LockMode>(() =>
    isNativeApp ? "LOADING" : "UNLOCKED"
  );
  const [setupStep, setSetupStep] = useState<"CREATE" | "CONFIRM">("CREATE");
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [error, setError] = useState("");
  const [biometryAvailable, setBiometryAvailable] = useState(false);
  const [biometryBusy, setBiometryBusy] = useState(false);

  /*
   * Estas referências impedem que a biometria
   * seja chamada novamente enquanto uma autenticação
   * já está em andamento.
   */
  const mountedRef = useRef(true);
  const biometricAttemptRef = useRef(false);
  const unlockedRef = useRef(false);

  // Evita que o ciclo de vida do Android reabra a biometria
  // imediatamente depois de o utilizador escolher "Usar PIN EMATEA".
  const biometricSuppressedUntilRef = useRef(0);

  // =========================================================
  // DESBLOQUEAR
  // =========================================================

  const setUnlocked = () => {
    unlockedRef.current = true;

    setPin("");
    setConfirmPin("");
    setError("");
    setMode("UNLOCKED");
  };

  // =========================================================
  // BLOQUEAR
  // =========================================================

  // =========================================================
  // BIOMETRIA
  // =========================================================

  const authenticateWithBiometry = async () => {
    /*
     * Nunca iniciar uma segunda autenticação biométrica
     * enquanto a primeira ainda estiver aberta.
     */
    if (
      !mountedRef.current ||
      biometricAttemptRef.current ||
      unlockedRef.current
    ) {
      return;
    }

    biometricAttemptRef.current = true;
    setBiometryBusy(true);
    setError("");

    try {
      await BiometricAuth.authenticate({
        reason: "Desbloqueie o aplicativo EMATEA",
        cancelTitle: "Usar PIN EMATEA",

        // IMPORTANTE:
        // nunca permitir PIN/padrão/senha do telefone.
        allowDeviceCredential: false,

        androidTitle: "Desbloquear EMATEA",
        androidSubtitle: "Use a sua impressão digital",
        androidConfirmationRequired: false,
      });

      if (!mountedRef.current) {
        return;
      }

      /*
       * A biometria foi aceita.
       * O aplicativo entra diretamente.
       */
      setUnlocked();
    } catch (err) {
      if (!mountedRef.current) {
        return;
      }

      /*
       * Cancelar ou escolher "Usar PIN EMATEA"
       * não é considerado erro.
       *
       * Nesse caso simplesmente permanece na tela
       * de desbloqueio para permitir o PIN.
       */
      if (
        err instanceof BiometryError &&
        (
          err.code === BiometryErrorType.userCancel ||
          err.code === BiometryErrorType.userFallback
        )
      ) {
        // O utilizador escolheu sair da biometria e usar o PIN EMATEA.
        // Impede que o evento de retorno ao primeiro plano abra
        // novamente a janela biométrica.
        biometricSuppressedUntilRef.current = Date.now() + 3000;
        setPin("");
        setError("");
        setMode("UNLOCK");
        return;
      }

      if (err instanceof BiometryError) {
        setError("Não foi possível usar a impressão digital.");
      }
    } finally {
      biometricAttemptRef.current = false;

      if (mountedRef.current) {
        setBiometryBusy(false);
      }
    }
  };

  // =========================================================
  // PREPARAR DESBLOQUEIO
  // =========================================================

  const prepareUnlock = async (autoBiometry: boolean) => {
    if (!isNativeApp) {
      return;
    }

    try {
      const configured = await appLockService.isConfigured();

      if (!mountedRef.current) {
        return;
      }

      /*
       * Primeira utilização:
       * pedir configuração do PIN.
       */
      if (!configured) {
        unlockedRef.current = false;
        setMode("SETUP");
        return;
      }

      /*
       * PIN já configurado.
       */
      unlockedRef.current = false;
      setMode("UNLOCK");

      try {
        const result = await BiometricAuth.checkBiometry();

        if (!mountedRef.current) {
          return;
        }

        setBiometryAvailable(result.isAvailable);

        /*
         * Na abertura do aplicativo:
         * se houver biometria, abre automaticamente.
         */
        if (
          autoBiometry &&
          result.isAvailable &&
          Date.now() >= biometricSuppressedUntilRef.current
        ) {
          await authenticateWithBiometry();
        }
      } catch {
        if (mountedRef.current) {
          setBiometryAvailable(false);
        }
      }
    } catch (err) {
      console.error(
        "Erro ao carregar proteção do aplicativo:",
        err
      );

      if (mountedRef.current) {
        setError(
          "Não foi possível carregar a proteção do aplicativo."
        );

        setMode("UNLOCK");
      }
    }
  };

  // =========================================================
  // CICLO DE VIDA DO APLICATIVO
  // =========================================================

  useEffect(() => {
    mountedRef.current = true;

    if (!isNativeApp) {
      return () => {
        mountedRef.current = false;
      };
    }

    /*
     * Primeira abertura.
     */
    void prepareUnlock(true);

    const listenerPromise = CapacitorApp.addListener(
      "appStateChange",
      ({ isActive }) => {
        if (!mountedRef.current) {
          return;
        }

        /*
         * Aplicativo foi para segundo plano.
         *
         * Só bloqueamos se ele estava desbloqueado.
         */
        if (!isActive) {
          if (unlockedRef.current) {
            unlockedRef.current = false;

            setPin("");
            setConfirmPin("");
            setError("");
            setMode("UNLOCK");
          }

          return;
        }

        /*
         * Aplicativo voltou para primeiro plano.
         *
         * Se já está desbloqueado, não fazemos nada.
         *
         * Se uma biometria já está acontecendo, também
         * não iniciamos outra.
         */
        if (
          unlockedRef.current ||
          biometricAttemptRef.current
        ) {
          return;
        }

        // Se o utilizador acabou de escolher o PIN, não reabrir
        // a biometria por causa do mesmo ciclo de retorno ao app.
        if (Date.now() < biometricSuppressedUntilRef.current) {
          return;
        }

        void prepareUnlock(true);
      }
    );

    return () => {
      mountedRef.current = false;

      void listenerPromise.then((listener) => {
        listener.remove();
      });
    };
  }, []);

  // =========================================================
  // TECLADO NUMÉRICO
  // =========================================================

  const addDigit = (digit: string) => {
    setError("");

    if (mode === "SETUP") {
      /*
       * PRIMEIRO PIN
       */
      if (setupStep === "CREATE") {
        if (pin.length < 6) {
          setPin((value) => value + digit);
        }

        return;
      }

      /*
       * CONFIRMAÇÃO
       */
      if (confirmPin.length < 6) {
        setConfirmPin((value) => value + digit);
      }

      return;
    }

    /*
     * DESBLOQUEIO
     */
    if (pin.length < 6) {
      setPin((value) => value + digit);
    }
  };

  // =========================================================
  // APAGAR DÍGITO
  // =========================================================

  const removeDigit = () => {
    setError("");

    if (
      mode === "SETUP" &&
      setupStep === "CONFIRM"
    ) {
      setConfirmPin((value) =>
        value.slice(0, -1)
      );

      return;
    }

    setPin((value) =>
      value.slice(0, -1)
    );
  };

  // =========================================================
  // CONFIGURAR PIN
  // =========================================================

  const configurePin = async () => {
    if (pin.length !== 6) {
      setError(
        "O PIN deve ter exatamente 6 dígitos."
      );

      return;
    }

    /*
     * Primeiro passo:
     * avançar para confirmação.
     */
    if (setupStep === "CREATE") {
      setSetupStep("CONFIRM");
      setConfirmPin("");
      setError("");

      return;
    }

    /*
     * Confirmação incompleta.
     */
    if (confirmPin.length !== 6) {
      setError(
        "Confirme os 6 dígitos do PIN."
      );

      return;
    }

    /*
     * PINs diferentes.
     */
    if (pin !== confirmPin) {
      setError(
        "Os PINs não coincidem."
      );

      setConfirmPin("");

      return;
    }

    try {
      await appLockService.configurePin(pin);

      /*
       * PIN configurado com sucesso.
       */
      setUnlocked();
    } catch (err) {
      console.error(
        "Erro ao configurar PIN:",
        err
      );

      setError(
        "Não foi possível configurar o PIN."
      );
    }
  };

  // =========================================================
  // DESBLOQUEAR COM PIN
  // =========================================================

  const unlockWithPin = async () => {
    if (pin.length !== 6) {
      setError(
        "Introduza o PIN de 6 dígitos."
      );

      return;
    }

    try {
      const valid =
        await appLockService.verifyPin(pin);

      if (!valid) {
        setError("PIN incorreto.");
        setPin("");

        return;
      }

      /*
       * PIN correto.
       */
      setUnlocked();
    } catch (err) {
      console.error(
        "Erro ao verificar PIN:",
        err
      );

      setError(
        "Não foi possível verificar o PIN."
      );
    }
  };

  // =========================================================
  // APP DESBLOQUEADO
  // =========================================================

  if (
    mode === "LOADING" ||
    mode === "UNLOCKED"
  ) {
    return <>{children}</>;
  }

  const activePin =
    mode === "SETUP" &&
    setupStep === "CONFIRM"
      ? confirmPin
      : pin;

  // =========================================================
  // TELA DE BLOQUEIO
  // =========================================================

  return (
    <div className="fixed inset-0 z-[9999] flex min-h-screen items-center justify-center bg-[#071d28] px-5 text-white">
      <div className="w-full max-w-sm">

        {/* CABEÇALHO */}

        <div className="mb-8 text-center">

          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-cyan-800/60 bg-cyan-950/60">
            <LockKeyhole className="h-7 w-7 text-cyan-400" />
          </div>

          <h1 className="text-xl font-bold">
            {mode === "SETUP"
              ? setupStep === "CREATE"
                ? "Configure o PIN do EMATEA"
                : "Confirme o seu PIN"
              : "Desbloquear EMATEA"}
          </h1>

          <p className="mt-2 text-sm text-cyan-100/60">
            {mode === "SETUP"
              ? "Defina um PIN de 6 dígitos para proteger o aplicativo."
              : "Introduza o seu PIN de acesso ao aplicativo."}
          </p>

        </div>

        {/* INDICADORES DO PIN */}

        <div className="mb-6 flex justify-center gap-3">

          {Array.from({ length: 6 }).map(
            (_, index) => (
              <div
                key={index}
                className={`h-3 w-3 rounded-full border ${
                  index < activePin.length
                    ? "border-cyan-400 bg-cyan-400"
                    : "border-cyan-700 bg-transparent"
                }`}
              />
            )
          )}

        </div>

        {/* ERRO */}

        {error && (
          <p className="mb-4 text-center text-sm text-red-400">
            {error}
          </p>
        )}

        {/* TECLADO */}

        <div className="grid grid-cols-3 gap-3">

          {[
            "1",
            "2",
            "3",
            "4",
            "5",
            "6",
            "7",
            "8",
            "9",
          ].map((digit) => (
            <button
              key={digit}
              type="button"
              onClick={() =>
                addDigit(digit)
              }
              className="h-14 rounded-xl border border-cyan-900/70 bg-[#0c2d3d] text-lg font-semibold transition-colors hover:bg-cyan-900/50"
            >
              {digit}
            </button>
          ))}

          {/* APAGAR */}

          <button
            type="button"
            onClick={removeDigit}
            className="flex h-14 items-center justify-center rounded-xl border border-cyan-900/70 bg-[#0c2d3d]"
            aria-label="Apagar"
          >
            <Delete className="h-5 w-5" />
          </button>

          {/* ZERO */}

          <button
            type="button"
            onClick={() =>
              addDigit("0")
            }
            className="h-14 rounded-xl border border-cyan-900/70 bg-[#0c2d3d] text-lg font-semibold"
          >
            0
          </button>

          {/* CONFIRMAR */}

          <button
            type="button"
            onClick={() => {
              if (mode === "SETUP") {
                void configurePin();
              } else {
                void unlockWithPin();
              }
            }}
            className="flex h-14 items-center justify-center rounded-xl bg-cyan-500 text-[#06202b]"
            aria-label="Confirmar"
          >
            <Check className="h-5 w-5" />
          </button>

        </div>

        {/* BIOMETRIA */}

        {mode === "UNLOCK" &&
          biometryAvailable && (
            <button
              type="button"
              disabled={biometryBusy}
              onClick={() =>
                void authenticateWithBiometry()
              }
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-cyan-800/70 bg-cyan-950/40 py-3 text-sm font-semibold text-cyan-200 disabled:opacity-50"
            >
              <Fingerprint className="h-5 w-5" />

              {biometryBusy
                ? "A autenticar..."
                : "Usar impressão digital"}
            </button>
          )}

      </div>
    </div>
  );
}