
import { useEffect, useRef, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import {
  Eye,
  EyeOff,
  LockKeyhole,
  UserRound,
} from "lucide-react";

import Toast from "../components/ui/Toast";
import { loginUser } from "../services/api";
import { useAuth } from "../contexts/AuthContext";

type ToastType = "success" | "error";

interface ToastState {
  visible: boolean;
  message: string;
  type: ToastType;
}

export default function Landing() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const redirectTimer = useRef<number | null>(null);
  const loginInFlight = useRef(false);

  const [identity, setIdentity] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [redirecting, setRedirecting] = useState(false);

  const [toast, setToast] = useState<ToastState>({
    visible: false,
    message: "",
    type: "success",
  });

  const isBusy = loading || redirecting;

  // =====================================================
  // TOAST PROFISSIONAL
  // =====================================================

  useEffect(() => {
    if (!toast.visible) return;

    const timer = window.setTimeout(() => {
      setToast((previous) => ({
        ...previous,
        visible: false,
      }));
    }, 3500);

    return () => window.clearTimeout(timer);
  }, [toast.visible, toast.message]);

  // Limpeza do redirecionamento ao desmontar o componente.
  useEffect(() => {
    return () => {
      if (redirectTimer.current !== null) {
        window.clearTimeout(redirectTimer.current);
      }
    };
  }, []);

  function notify(
    message: string,
    type: ToastType = "error"
  ) {
    setToast({
      visible: true,
      message,
      type,
    });
  }

  // =====================================================
  // AUTENTICAÇÃO
  // =====================================================

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (loginInFlight.current || isBusy) return;

    const normalizedIdentity = identity.trim();

    if (!normalizedIdentity || !password) {
      notify("Introduza o seu email ou telefone e a palavra-passe.");
      return;
    }

    try {
      loginInFlight.current = true;
      setLoading(true);

      const response = await loginUser(
        normalizedIdentity,
        password
      );

      login(response.token, response.user);

      setRedirecting(true);

      notify("Acesso autorizado. A preparar a sua sessão.", "success");

      // Pequeno intervalo para permitir visualizar o Toast.
      redirectTimer.current = window.setTimeout(() => {
        if (response.user.role === "AGENT") {
          switch (response.user.agent?.status) {
            case "PENDING":
              navigate("/agent/pending", { replace: true });
              return;

            case "REJECTED":
              navigate("/agent/rejected", { replace: true });
              return;

            case "SUSPENDED":
              navigate("/agent/suspended", { replace: true });
              return;
          }
        }

        if (response.user.role === "ADMIN") {
          navigate("/admin", { replace: true });
          return;
        }

        if (response.user.role === "SUB_AGENT") {
          navigate("/sub-agent", { replace: true });
          return;
        }

        navigate("/home", { replace: true });
      }, 900);

    } catch (error: any) {
      console.error("Erro de autenticação:", error);

      notify(
        error?.response?.data?.message ??
          "Não foi possível iniciar sessão. Verifique as suas credenciais."
      );

      loginInFlight.current = false;
    } finally {
      setLoading(false);
    }
  }

  // =====================================================
  // INTERFACE
  // =====================================================

  return (
    <main className="relative flex min-h-screen min-h-[100dvh] flex-col items-center justify-start bg-[#092633] px-3 py-4 text-white antialiased sm:justify-center sm:px-6 sm:py-8">

      {/* BACKGROUND */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-[280px] w-[280px] rounded-full bg-cyan-500/[0.07] blur-[100px] sm:h-[420px] sm:w-[420px] sm:blur-[120px]" />

        <div className="absolute -bottom-40 -right-40 h-[300px] w-[300px] rounded-full bg-cyan-400/[0.06] blur-[110px] sm:-bottom-48 sm:h-[480px] sm:w-[480px] sm:blur-[130px]" />

        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "radial-gradient(circle, #ffffff 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
      </div>

      {/* TOAST GLOBAL */}

      <Toast
        visible={toast.visible}
        message={toast.message}
        type={toast.type}
        onClose={() =>
          setToast((previous) => ({
            ...previous,
            visible: false,
          }))
        }
      />

      {/* LOGIN CONTENT */}

      <section className="relative z-10 flex w-full max-w-[420px] flex-col items-center">

        {/* BRAND */}

        <div className="mb-5 flex flex-col items-center text-center sm:mb-8">
          <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-full border border-cyan-300/20 bg-white shadow-[0_8px_30px_rgba(0,0,0,0.2)] sm:h-[68px] sm:w-[68px]">
            <img
              src="/logo.png"
              alt="EMATEA"
              className="h-full w-full object-cover"
            />
          </div>

          <h1 className="mt-2 text-[21px] font-bold tracking-[0.08em] text-white sm:mt-3 sm:text-[23px]">
            EMATEA
          </h1>

        </div>

        {/* LOGIN CARD */}

        <div className="w-full rounded-[22px] border border-cyan-300/15 bg-[#10394B]/95 p-5 shadow-[0_18px_50px_rgba(0,0,0,0.22)] backdrop-blur-xl sm:rounded-[24px] sm:p-9 sm:shadow-[0_24px_70px_rgba(0,0,0,0.25)]">

          {/* HEADER */}

          <div className="mb-5 sm:mb-8">
            <h2 className="text-[22px] font-bold tracking-tight text-white sm:text-[25px]">
              Bem-vindo de volta
            </h2>

            <p className="mt-2 text-sm leading-relaxed text-slate-300">
              Entre na sua conta para continuar.
            </p>
          </div>

          {/* FORM */}

          <form onSubmit={handleLogin} className="space-y-4 sm:space-y-5">

            {/* IDENTIFICAÇÃO */}

            <div className="space-y-2">
              <label
                htmlFor="login-identity"
                className="block text-xs font-semibold text-slate-200"
              >
                Telemóvel ou email
              </label>

              <div className="relative">
                <UserRound
                  size={18}
                  strokeWidth={1.7}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  id="login-identity"
                  type="text"
                  value={identity}
                  onChange={(event) => setIdentity(event.target.value)}
                  placeholder="Introduza o seu telemóvel ou email"
                  autoComplete="username"
                  required
                  disabled={isBusy}
                  className="h-12 w-full rounded-xl border border-cyan-100/15 bg-[#092B3A] pl-12 pr-4 sm:h-[54px] text-sm text-white outline-none transition-all duration-200 placeholder:text-slate-500 hover:border-cyan-300/30 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/10 disabled:cursor-not-allowed disabled:opacity-60"
                />
              </div>
            </div>

            {/* PALAVRA-PASSE */}

            <div className="space-y-2">
              <label
                htmlFor="login-password"
                className="block text-xs font-semibold text-slate-200"
              >
                Palavra-passe
              </label>

              <div className="relative">
                <LockKeyhole
                  size={18}
                  strokeWidth={1.7}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Introduza a sua palavra-passe"
                  autoComplete="current-password"
                  required
                  disabled={isBusy}
                  className="h-12 w-full rounded-xl border border-cyan-100/15 bg-[#092B3A] pl-12 pr-12 sm:h-[54px] text-sm text-white outline-none transition-all duration-200 placeholder:text-slate-500 hover:border-cyan-300/30 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/10 disabled:cursor-not-allowed disabled:opacity-60"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((current) => !current)}
                  disabled={isBusy}
                  aria-label={
                    showPassword
                      ? "Ocultar palavra-passe"
                      : "Mostrar palavra-passe"
                  }
                  aria-pressed={showPassword}
                  className="absolute right-4 top-1/2 -translate-y-1/2 rounded-md text-slate-400 transition-colors hover:text-cyan-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 disabled:opacity-50"
                >
                  {showPassword ? (
                    <EyeOff size={19} />
                  ) : (
                    <Eye size={19} />
                  )}
                </button>
              </div>
            </div>

            {/* RECUPERAÇÃO DE PALAVRA-PASSE */}

            <div className="flex justify-end pt-0.5">
              <button
                type="button"
                onClick={() => navigate("/reset-password")}
                disabled={isBusy}
                className="text-xs font-medium text-cyan-400 transition-colors hover:text-cyan-300 focus-visible:outline-none focus-visible:underline disabled:opacity-50"
              >
                Esqueceu a palavra-passe?
              </button>
            </div>

            {/* BOTÃO PRINCIPAL */}

<button
  type="submit"
  disabled={
    isBusy ||
    !identity.trim() ||
    !password
  }
  className="w-full h-12 sm:h-14 rounded-xl bg-[#079CB3] hover:bg-[#0BACC2] disabled:bg-[#315365] disabled:text-[#91A9B4] disabled:cursor-not-allowed text-white text-[15px] font-semibold tracking-wide transition-colors flex items-center justify-center"
>
  {loading ? (
    <>
      <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
      A autenticar...
    </>
  ) : redirecting ? (
    <>
      <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
      A preparar a sua sessão...
    </>
  ) : (
    "Continuar"
  )}
</button>
          </form>

          {/* REGISTO */}

          <div className="mt-5 border-t border-white/[0.08] pt-5 text-center sm:mt-7 sm:pt-6">
            <p className="text-sm text-slate-300">
              Ainda não tem uma conta?
            </p>

            <button
              type="button"
              onClick={() => navigate("/register")}
              disabled={isBusy}
              className="mt-2 text-sm font-semibold text-cyan-400 transition-colors hover:text-cyan-300 focus-visible:outline-none focus-visible:underline disabled:opacity-50"
            >
              Criar conta
            </button>
          </div>
        </div>

        {/* FOOTER */}

        <p className="mt-4 text-center text-[10px] tracking-wide text-slate-500 sm:mt-7 sm:text-[11px]">
          © {new Date().getFullYear()} EMATEA. Todos os direitos reservados.
        </p>
      </section>
    </main>
  );
}
