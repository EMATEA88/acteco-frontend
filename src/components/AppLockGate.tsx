import { useEffect, useState } from "react";
import { App as CapacitorApp } from "@capacitor/app";
import {
  BiometricAuth,
  BiometryError,
  BiometryErrorType,
} from "@aparajita/capacitor-biometric-auth";
import { Fingerprint, LockKeyhole, Delete, Check } from "lucide-react";
import appLockService from "../services/app-lock.service";

type LockMode = "LOADING" | "SETUP" | "UNLOCK" | "UNLOCKED";

export default function AppLockGate({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mode, setMode] = useState<LockMode>("LOADING");
  const [setupStep, setSetupStep] = useState<"CREATE" | "CONFIRM">("CREATE");
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [error, setError] = useState("");
  const [biometryAvailable, setBiometryAvailable] = useState(false);
  const [biometryBusy, setBiometryBusy] = useState(false);

  const lockApp = () => {
    setPin("");
    setConfirmPin("");
    setError("");
    setSetupStep("CREATE");
    setMode("UNLOCK");
  };

  const authenticateWithBiometry = async () => {
    if (biometryBusy) return;

    setBiometryBusy(true);
    setError("");

    try {
      await BiometricAuth.authenticate({
        reason: "Desbloqueie o aplicativo EMATEA",
        cancelTitle: "Usar PIN EMATEA",
        allowDeviceCredential: false,
        androidTitle: "Desbloquear EMATEA",
        androidSubtitle: "Use a sua impressão digital",
        androidConfirmationRequired: false,
      });

      setPin("");
      setError("");
      setMode("UNLOCKED");
    } catch (err) {
      if (
        err instanceof BiometryError &&
        err.code !== BiometryErrorType.userCancel &&
        err.code !== BiometryErrorType.userFallback
      ) {
        setError("Não foi possível usar a impressão digital.");
      }
    } finally {
      setBiometryBusy(false);
    }
  };

  const tryBiometry = async () => {
    try {
      const result = await BiometricAuth.checkBiometry();
      setBiometryAvailable(result.isAvailable);

      if (result.isAvailable) {
        await authenticateWithBiometry();
      }
    } catch {
      setBiometryAvailable(false);
    }
  };

  const initialize = async () => {
    try {
      const configured = await appLockService.isConfigured();

      if (!configured) {
        setMode("SETUP");
        return;
      }

      setMode("UNLOCK");
      await tryBiometry();
    } catch (err) {
      console.error("Erro ao carregar proteção do aplicativo:", err);
      setError("Não foi possível carregar a proteção do aplicativo.");
    }
  };

  useEffect(() => {
    void initialize();

    const listenerPromise = CapacitorApp.addListener(
      "appStateChange",
      ({ isActive }) => {
        if (!isActive) {
          setMode((currentMode) =>
            currentMode === "UNLOCKED" ? "UNLOCK" : currentMode
          );
          setPin("");
          setError("");
          return;
        }

        void (async () => {
          try {
            const configured = await appLockService.isConfigured();

            if (!configured) {
              setMode("SETUP");
              return;
            }

            lockApp();
            await tryBiometry();
          } catch (err) {
            console.error(
              "Erro ao proteger o aplicativo ao retomar:",
              err
            );
            setMode("UNLOCK");
          }
        })();
      }
    );

    return () => {
      void listenerPromise.then((listener) => listener.remove());
    };
  }, []);

  const addDigit = (digit: string) => {
    setError("");

    if (mode === "SETUP") {
      if (setupStep === "CREATE") {
        if (pin.length < 6) {
          setPin((value) => value + digit);
        }
        return;
      }

      if (confirmPin.length < 6) {
        setConfirmPin((value) => value + digit);
      }

      return;
    }

    if (pin.length < 6) {
      setPin((value) => value + digit);
    }
  };

  const removeDigit = () => {
    setError("");

    if (mode === "SETUP" && setupStep === "CONFIRM") {
      setConfirmPin((value) => value.slice(0, -1));
      return;
    }

    setPin((value) => value.slice(0, -1));
  };

  const configurePin = async () => {
    if (pin.length !== 6) {
      setError("O PIN deve ter exatamente 6 dígitos.");
      return;
    }

    if (setupStep === "CREATE") {
      setSetupStep("CONFIRM");
      setConfirmPin("");
      setError("");
      return;
    }

    if (confirmPin.length !== 6) {
      setError("Confirme os 6 dígitos do PIN.");
      return;
    }

    if (pin !== confirmPin) {
      setError("Os PINs não coincidem.");
      setConfirmPin("");
      return;
    }

    try {
      await appLockService.configurePin(pin);

      setPin("");
      setConfirmPin("");
      setError("");
      setMode("UNLOCKED");
    } catch (err) {
      console.error("Erro ao configurar PIN:", err);
      setError("Não foi possível configurar o PIN.");
    }
  };

  const unlockWithPin = async () => {
    if (pin.length !== 6) {
      setError("Introduza o PIN de 6 dígitos.");
      return;
    }

    try {
      const valid = await appLockService.verifyPin(pin);

      if (!valid) {
        setError("PIN incorreto.");
        setPin("");
        return;
      }

      setPin("");
      setError("");
      setMode("UNLOCKED");
    } catch (err) {
      console.error("Erro ao verificar PIN:", err);
      setError("Não foi possível verificar o PIN.");
    }
  };

  if (mode === "LOADING" || mode === "UNLOCKED") {
    return <>{children}</>;
  }

  const activePin =
    mode === "SETUP" && setupStep === "CONFIRM" ? confirmPin : pin;

  return (
    <div className="fixed inset-0 z-[9999] flex min-h-screen items-center justify-center bg-[#071d28] px-5 text-white">
      <div className="w-full max-w-sm">
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

        <div className="mb-6 flex justify-center gap-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className={`h-3 w-3 rounded-full border ${
                index < activePin.length
                  ? "border-cyan-400 bg-cyan-400"
                  : "border-cyan-700 bg-transparent"
              }`}
            />
          ))}
        </div>

        {error && (
          <p className="mb-4 text-center text-sm text-red-400">{error}</p>
        )}

        <div className="grid grid-cols-3 gap-3">
          {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((digit) => (
            <button
              key={digit}
              type="button"
              onClick={() => addDigit(digit)}
              className="h-14 rounded-xl border border-cyan-900/70 bg-[#0c2d3d] text-lg font-semibold transition-colors hover:bg-cyan-900/50"
            >
              {digit}
            </button>
          ))}

          <button
            type="button"
            onClick={removeDigit}
            className="flex h-14 items-center justify-center rounded-xl border border-cyan-900/70 bg-[#0c2d3d]"
            aria-label="Apagar"
          >
            <Delete className="h-5 w-5" />
          </button>

          <button
            type="button"
            onClick={() => addDigit("0")}
            className="h-14 rounded-xl border border-cyan-900/70 bg-[#0c2d3d] text-lg font-semibold"
          >
            0
          </button>

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

        {mode === "UNLOCK" && biometryAvailable && (
          <button
            type="button"
            disabled={biometryBusy}
            onClick={() => void authenticateWithBiometry()}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-cyan-800/70 bg-cyan-950/40 py-3 text-sm font-semibold text-cyan-200 disabled:opacity-50"
          >
            <Fingerprint className="h-5 w-5" />
            Usar impressão digital
          </button>
        )}
      </div>
    </div>
  );
}
