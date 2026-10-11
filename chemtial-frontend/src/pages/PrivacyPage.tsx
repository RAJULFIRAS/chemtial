import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowLeft, Shield, Lock, Eye, Trash2 } from "lucide-react";

const PrivacyPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const items = [
    {
      icon: <Shield size={20} />,
      titleKey: "pages.privacy.data_security",
      descKey: "pages.privacy.data_security_desc",
    },
    {
      icon: <Lock size={20} />,
      titleKey: "pages.privacy.confidentiality",
      descKey: "pages.privacy.confidentiality_desc",
    },
    {
      icon: <Eye size={20} />,
      titleKey: "pages.privacy.transparency",
      descKey: "pages.privacy.transparency_desc",
    },
    {
      icon: <Trash2 size={20} />,
      titleKey: "pages.privacy.delete_data",
      descKey: "pages.privacy.delete_data_desc",
    },
  ];

  return (
    <div className="container-custom py-8">
      <button
        onClick={() => navigate("/")}
        className="flex items-center gap-2 text-secondary hover:text-primary transition-colors mb-6"
      >
        <ArrowLeft size={20} /> <span>{t("common.back_to_home")}</span>
      </button>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary">
          {t("pages.privacy.title")}
        </h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
        {items.map((item, index) => (
          <div
            key={index}
            className="p-5 bg-gray-50 rounded-xl border border-gray-100"
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-primary">{item.icon}</span>
              <h3 className="font-semibold text-secondary">
                {t(item.titleKey)}
              </h3>
            </div>
            <p className="text-sm text-gray-500">{t(item.descKey)}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PrivacyPage;
