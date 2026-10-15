import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { registerUser, clearError } from "../../store/slices/authSlice";
import { AppDispatch, RootState } from "../../store";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import { UserPlus } from "lucide-react";
import toast from "react-hot-toast";
import bgLogin from "../../asset/image/bg-login.jpg";

const RegisterPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { isLoading, error } = useSelector((state: RootState) => state.auth);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(clearError());

    if (password !== confirmPassword) {
      toast.error(t("auth.password_mismatch"));
      return;
    }

    const result = await dispatch(registerUser({ name, email, password }));
    if (registerUser.fulfilled.match(result)) {
      navigate("/");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center py-12 px-4 ..."
      style={{ backgroundImage: `url(${bgLogin})` }}
    >
      <div className="relative z-10 max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 sm:p-10 space-y-6">
        <div>
          <h2 className="text-center text-3xl font-extrabold text-primary">
            {t("auth.register_title")}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-500">
            {t("auth.register_subtitle")}
          </p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <Input
              id="name"
              label={t("auth.name")}
              type="text"
              value={name}
              onChange={setName}
              required
              placeholder={t("auth.name")}
            />
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
              label={t("auth.password_hint")}
              type="password"
              value={password}
              onChange={setPassword}
              required
              placeholder={t("auth.password")}
            />
            <Input
              id="confirmPassword"
              label={t("auth.confirm_password")}
              type="password"
              value={confirmPassword}
              onChange={setConfirmPassword}
              required
              placeholder={t("auth.confirm_password")}
            />
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
              icon={UserPlus}
              disabled={isLoading}
            >
              {isLoading ? t("auth.loading") : t("auth.register")}
            </Button>
          </div>

          <div className="text-sm text-center">
            {t("auth.have_account")}{" "}
            <Link
              to="/login"
              className="font-medium text-primary hover:text-primary-dark"
            >
              {t("auth.login")}
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
