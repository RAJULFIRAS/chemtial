import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { loginUser, clearError } from "../../store/slices/authSlice";
import { AppDispatch, RootState } from "../../store";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import { LogIn } from "lucide-react";

const LoginPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { isLoading, error } = useSelector((state: RootState) => state.auth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(clearError());

    const result = await dispatch(loginUser({ email, password }));

    if (loginUser.fulfilled.match(result)) {
      const userRole = result.payload.user?.role;

      if (
        userRole === "admin" ||
        userRole === "manager" ||
        userRole === "courier"
      ) {
        navigate("/admin", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-cover bg-center bg-no-repeat relative"
      style={{ backgroundImage: "url('src/asset/image/bg-login.jpg')" }}
    >
      <div className="relative z-10 max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 sm:p-10 space-y-6">
        <div>
          <h2 className="text-center text-3xl font-extrabold text-primary">
            {t("auth.login_title")}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-500">
            {t("auth.login_subtitle")}
          </p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <Input
              id="email"
              label={t("auth.email")}
              type="email"
              value={email}
              onChange={setEmail}
              required
              placeholder={t("auth.email")}
            />
            <Input
              id="password"
              label={t("auth.password")}
              type="password"
              value={password}
              onChange={setPassword}
              required
              placeholder={t("auth.password")}
            />
          </div>
          <div className="text-right">
            <Link
              to="/forgot-password"
              className="text-sm text-primary hover:text-primary-dark font-medium"
            >
              {t("auth.forgot_password")}
            </Link>
          </div>

          {error && (
            <div className="text-red-600 text-sm text-center bg-red-50 p-2 rounded">
              {error}
            </div>
          )}

          <div>
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              icon={LogIn}
              disabled={isLoading}
            >
              {isLoading ? t("auth.loading") : t("auth.login")}
            </Button>
          </div>

          <div className="text-sm text-center">
            {t("auth.no_account")}{" "}
            <Link
              to="/register"
              className="font-medium text-primary hover:text-primary-dark"
            >
              {t("auth.register")}
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
