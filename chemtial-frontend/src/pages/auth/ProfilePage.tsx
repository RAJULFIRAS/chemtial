import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { RootState, AppDispatch } from "../../store";
import { logout } from "../../store/slices/authSlice";
import { User, Mail, Package, LogOut, ArrowLeft, Ticket } from "lucide-react";
import Button from "../../components/common/Button";

const ProfilePage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user, isAuthenticated } = useSelector(
    (state: RootState) => state.auth,
  );

  if (!isAuthenticated) {
    navigate("/login");
    return null;
  }

  const handleLogout = (): void => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <div className="container-custom py-8">
      <button
        onClick={() => navigate("/")}
        className="flex items-center gap-2 text-secondary hover:text-primary transition-colors mb-6"
      >
        <ArrowLeft size={20} /> <span>{t("profile.back_to_home")}</span>
      </button>

      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <User size={32} className="text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-primary">{user?.name}</h1>
              <p className="text-secondary">{user?.email}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-3 mb-3">
              <Mail size={24} className="text-primary" />
              <h2 className="font-semibold text-secondary">
                {t("profile.account_info")}
              </h2>
            </div>
            <div className="space-y-2 text-sm">
              <p>
                <span className="text-secondary/60">{t("profile.name")}:</span>{" "}
                {user?.name}
              </p>
              <p>
                <span className="text-secondary/60">{t("profile.email")}:</span>{" "}
                {user?.email}
              </p>
              <p>
                <span className="text-secondary/60">{t("profile.role")}:</span>{" "}
                {user?.role || "user"}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-3 mb-3">
              <Package size={24} className="text-primary" />
              <h2 className="font-semibold text-secondary">
                {t("profile.activity")}
              </h2>
            </div>
            <Button
              variant="outline"
              size="sm"
              icon={Ticket}
              onClick={() => navigate("/vouchers")}
              className="w-full mb-2"
            >
              {t("profile.my_vouchers")}
            </Button>
            <Button
              variant="outline"
              size="sm"
              icon={Package}
              onClick={() => navigate("/orders")}
              className="w-full mb-2"
            >
              {t("profile.view_orders")}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              icon={LogOut}
              onClick={handleLogout}
              className="w-full text-red-600"
            >
              {t("profile.logout")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
