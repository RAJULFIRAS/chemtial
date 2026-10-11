import React, { useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { authApi } from "../../services/adminApi";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import { KeyRound, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";

const ResetPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const tokenFromUrl = searchParams.get("token") || "";

  const [token, setToken] = useState(tokenFromUrl);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error(t("auth.password_mismatch"));
      return;
    }

    setIsLoading(true);
    try {
      await authApi.resetPassword(token, newPassword);
      toast.success(t("auth.reset_success"));
      setTimeout(() => navigate("/login"), 1500);
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : t("auth.reset_failed");
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

        <div>
          <h2 className="text-center text-3xl font-extrabold text-primary">
            {t("auth.reset_title")}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-500">
            {t("auth.reset_subtitle")}
          </p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          {!tokenFromUrl && (
            <Input
              id="token"
              label={t("auth.reset_token")}
              value={token}
              onChange={setToken}
              required
              placeholder={t("auth.reset_token_placeholder")}
              icon={<KeyRound size={16} />}
            />
          )}

          <Input
            id="newPassword"
            label={t("auth.new_password")}
            type="password"
            value={newPassword}
            onChange={setNewPassword}
            required
            placeholder={t("auth.new_password_placeholder")}
          />

          <Input
            id="confirmPassword"
            label={t("auth.confirm_new_password")}
            type="password"
            value={confirmPassword}
            onChange={setConfirmPassword}
            required
            placeholder={t("auth.confirm_new_password_placeholder")}
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? t("auth.processing") : t("auth.reset_password")}
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
      </div>
    </div>
  );
};

export default ResetPasswordPage;
