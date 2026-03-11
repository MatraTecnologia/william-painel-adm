"use client";

interface LoginPreviewProps {
  systemName: string;
  systemTitle: string;
  systemDescription?: string;
  logoUrl?: string;
  primaryColor: string;
  secondaryColor: string;
  gradientDirection: number;
  elements: { id: string; visible: boolean }[];
  loginBgColor?: string;
  loginBgImage?: string;
  loginTextColor?: string;
}

export function LoginPreview({
  systemName,
  systemTitle,
  logoUrl,
  primaryColor,
  secondaryColor,
  gradientDirection,
  elements,
  loginBgColor,
  loginBgImage,
  loginTextColor,
  systemDescription,
}: LoginPreviewProps) {
  const textColor = loginTextColor || "#0f172a"; // slate-900 default
  const subtextColor = loginTextColor
    ? `${loginTextColor}99`
    : "#64748b"; // slate-500 default
  // Build background: loginBgColor takes priority, then loginBgImage, then gradient
  const defaultGradient = `linear-gradient(${gradientDirection}deg, ${primaryColor}15 0%, transparent 50%, ${secondaryColor}15 100%)`;
  const bgStyle: React.CSSProperties = {};
  if (loginBgImage) {
    bgStyle.backgroundImage = `url(${loginBgImage})`;
    bgStyle.backgroundSize = "cover";
    bgStyle.backgroundPosition = "center";
  } else if (loginBgColor) {
    bgStyle.backgroundColor = loginBgColor;
  } else {
    bgStyle.background = defaultGradient;
  }

  function renderElement(id: string) {
    switch (id) {
      case "logo":
        return (
          <div className="flex justify-center mb-6">
            {logoUrl ? (
              <img
                src={logoUrl}
                alt={systemName}
                className="h-16 w-auto object-contain"
              />
            ) : (
              <div
                className="p-4 rounded-2xl shadow-lg"
                style={{
                  background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
                }}
              >
                <svg
                  className="h-10 w-10 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
            )}
          </div>
        );
      case "title":
        return (
          <h1
            className="text-3xl font-bold text-balance text-center mb-3"
            style={{ color: textColor }}
          >
            {systemName || "Nome do Sistema"}
          </h1>
        );
      case "subtitle":
        return (
          <p
            className="text-pretty text-lg text-center"
            style={{ color: subtextColor }}
          >
            {systemTitle || "Subtitulo do sistema"}
          </p>
        );
      case "description":
        return (
          <p
            className="text-pretty text-sm text-center mt-2"
            style={{ color: subtextColor }}
          >
            {systemDescription || "Descricao do sistema"}
          </p>
        );
      default:
        return null;
    }
  }

  const visibleElements = elements.filter((el) => el.visible);

  return (
    <div className="relative">
      {/* Browser chrome frame */}
      <div className="rounded-xl border bg-white shadow-2xl overflow-hidden">
        {/* Browser top bar */}
        <div className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 border-b">
          <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
          <div className="flex-1 mx-2">
            <div className="bg-white rounded text-[10px] text-slate-400 px-2 py-0.5 text-center">
              seusite.com/sign-in
            </div>
          </div>
        </div>

        {/* Scaled-down faithful replica of the actual sign-in page */}
        <div className="w-[420px] h-[580px] overflow-hidden">
          <div
            style={{
              transform: "scale(0.55)",
              transformOrigin: "top left",
              width: "763px", // 420 / 0.55
              height: "1054px", // 580 / 0.55
            }}
          >
            {/* === EXACT replica of sign-in page === */}
            <div
              className="flex items-center justify-center p-4"
              style={{
                ...bgStyle,
                minHeight: "1054px",
              }}
            >
              <div className="w-full" style={{ maxWidth: "28rem" }}>
                <div className="text-center mb-8">
                  {/* Render elements in configurable order */}
                  {visibleElements.map((el) => (
                    <div key={el.id}>{renderElement(el.id)}</div>
                  ))}
                </div>

                {/* Fake Clerk SignIn - identical styling to real component */}
                <div
                  className="rounded-2xl p-1 shadow-xl"
                  style={{
                    backgroundColor: "rgba(255,255,255,0.5)",
                    backdropFilter: "blur(12px)",
                    border: "1px solid rgba(226,232,240,0.5)",
                  }}
                >
                  <div
                    className="rounded-xl p-6"
                    style={{
                      backgroundColor: "rgba(255,255,255,0.8)",
                      backdropFilter: "blur(8px)",
                    }}
                  >
                    {/* Clerk header */}
                    <div className="mb-6">
                      <h2 className="text-xl font-bold text-slate-900 mb-1">
                        Entrar
                      </h2>
                      <p className="text-sm text-slate-500">
                        Bem-vindo de volta! Faca login para continuar.
                      </p>
                    </div>

                    {/* Social buttons */}
                    <div className="space-y-2 mb-4">
                      <button
                        className="w-full h-10 rounded-lg flex items-center justify-center gap-2 text-sm text-slate-700 transition-colors"
                        style={{
                          border: "1px solid rgba(226,232,240,0.5)",
                          backgroundColor: "white",
                        }}
                      >
                        <svg className="w-4 h-4" viewBox="0 0 24 24">
                          <path
                            fill="#4285F4"
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                          />
                          <path
                            fill="#34A853"
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                          />
                          <path
                            fill="#FBBC05"
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                          />
                          <path
                            fill="#EA4335"
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                          />
                        </svg>
                        Continuar com Google
                      </button>
                    </div>

                    {/* Divider */}
                    <div className="flex items-center gap-3 mb-4">
                      <div
                        className="flex-1 h-px"
                        style={{ backgroundColor: "rgba(226,232,240,0.3)" }}
                      />
                      <span className="text-xs text-slate-400/70">ou</span>
                      <div
                        className="flex-1 h-px"
                        style={{ backgroundColor: "rgba(226,232,240,0.3)" }}
                      />
                    </div>

                    {/* Email field */}
                    <div className="space-y-1.5 mb-4">
                      <label className="text-sm font-medium text-slate-900">
                        Endereco de e-mail
                      </label>
                      <input
                        type="text"
                        placeholder="usuario@email.com"
                        readOnly
                        className="w-full h-10 rounded-lg px-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all"
                        style={{
                          backgroundColor: "rgba(255,255,255,0.5)",
                          backdropFilter: "blur(12px)",
                          border: "1px solid rgba(226,232,240,0.5)",
                        }}
                      />
                    </div>

                    {/* Submit button with gradient */}
                    <button
                      className="w-full h-10 rounded-lg text-white text-sm font-medium shadow-lg"
                      style={{
                        background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
                      }}
                    >
                      Continuar
                    </button>

                    {/* Footer */}
                    <div className="mt-4 text-center">
                      <span className="text-sm text-slate-500">
                        Nao tem uma conta?{" "}
                      </span>
                      <span
                        className="text-sm font-medium"
                        style={{ color: primaryColor }}
                      >
                        Cadastre-se
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
