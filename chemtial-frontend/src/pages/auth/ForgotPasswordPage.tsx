import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { authApi } from "../../services/adminApi";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import { Mail, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";

const ForgotPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [devToken, setDevToken] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const result = await authApi.forgotPassword(email);
      setSent(true);
      if (result.data?.resetToken) {
        setDevToken(result.data.resetToken);
      }
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : t("auth.forgot_failed");
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center py-12 px-4 bg-cover bg-center bg-no-repeat relative"
      style={{ backgroundImage: "url('src/asset/image/logo/bg-login.jpg')" }}
    >
      <div className="relative z-10 max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 space-y-6">
        <button
          onClick={() => navigate("/login")}
          className="flex items-center gap-2 text-secondary hover:text-primary transition-colors text-sm"
        >
          <ArrowLeft size={16} /> {t("auth.back_to_login")}
        </button>

        {!sent ? (
          <>
            <div>
              <h2 className="text-center text-3xl font-extrabold text-primary">
                {t("auth.forgot_title")}
              </h2>
              <p className="mt-2 text-center text-sm text-gray-500">
                {t("auth.forgot_subtitle")}
              </p>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit}>
              <Input
                id="email"
                label={t("auth.email")}
                type="email"
                value={email}
                onChange={setEmail}
                required
                placeholder={t("auth.email")}
                icon={<Mail size={16} />}
              />

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? t("auth.sending") : t("auth.send_reset_link")}
              </Button>

              <div className="text-sm text-center text-gray-500">
                {t("auth.remember_password")}{" "}
                <Link
                  to="/login"
                  className="font-medium text-primary hover:text-primary-dark"
                >
                  {t("auth.login_here")}
                </Link>
              </div>
            </form>
          </>
        ) : (
          <>
            <div>
              <h2 className="text-center text-2xl font-extrabold text-primary">
                {t("auth.check_email")}
              </h2>
              <p
                className="mt-2 text-center text-sm text-gray-500"
                dangerouslySetInnerHTML={{
                  __html: t("auth.check_email_desc", { email }),
                }}
              />
            </div>

            {devToken && (
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-xs text-yellow-700 font-medium mb-1">
                  {t("auth.dev_token")}
                </p>
                <p className="text-xs font-mono text-yellow-900 break-all">
                  {devToken}
                </p>
                <Link
                  to={`/reset-password?token=${devToken}`}
                  className="text-xs text-primary hover:underline mt-2 inline-block"
                >
                  {t("auth.click_to_reset")}
                </Link>
              </div>
            )}

            <Link
              to="/login"
              className="block text-center text-sm text-primary hover:text-primary-dark font-medium"
            >
              {t("auth.back_to_login")}
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
