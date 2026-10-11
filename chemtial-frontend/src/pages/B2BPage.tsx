import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  ArrowLeft,
  Building2,
  Users,
  Briefcase,
  Shield,
  Phone,
  Mail,
} from "lucide-react";

const SUPPORT_PHONE = import.meta.env.VITE_SUPPORT_PHONE || "+62 852-7717-3823";
const B2B_EMAIL = import.meta.env.VITE_B2B_EMAIL || "b2b@chemtial.com";

const B2BPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const features = [
    {
      icon: <Building2 size={24} />,
      titleKey: "pages.b2b.for_companies",
      descKey: "pages.b2b.for_companies_desc",
    },
    {
      icon: <Users size={24} />,
      titleKey: "pages.b2b.special_team",
      descKey: "pages.b2b.special_team_desc",
    },
    {
      icon: <Briefcase size={24} />,
      titleKey: "pages.b2b.free_consultation",
      descKey: "pages.b2b.free_consultation_desc",
    },
    {
      icon: <Shield size={24} />,
      titleKey: "pages.b2b.satisfaction_guarantee",
      descKey: "pages.b2b.satisfaction_guarantee_desc",
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
          {t("pages.b2b.title")}
        </h1>
        <p className="text-secondary/60 mt-2">{t("pages.b2b.subtitle")}</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
        {features.map((feature, index) => (
          <div
            key={index}
            className="p-6 bg-gray-50 rounded-xl border border-gray-100"
          >
            <div className="flex items-center gap-3 mb-4">
              {feature.icon}
              <h3 className="font-semibold text-secondary text-lg">
                {t(feature.titleKey)}
              </h3>
            </div>
            <p className="text-gray-500 text-sm">{t(feature.descKey)}</p>
          </div>
        ))}
      </div>
      <div className="p-6 bg-primary/5 rounded-xl border border-primary/10">
        <h3 className="font-semibold text-primary text-lg mb-4 text-center">
          {t("pages.b2b.contact_team")}
        </h3>
        <div className="flex flex-col md:flex-row justify-center gap-6 text-center">
          <div>
            <Phone size={18} className="text-primary mx-auto mb-1" />
            <p className="text-sm text-gray-600">{SUPPORT_PHONE}</p>
          </div>
          <div>
            <Mail size={18} className="text-primary mx-auto mb-1" />
            <p className="text-sm text-gray-600">{B2B_EMAIL}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default B2BPage;
