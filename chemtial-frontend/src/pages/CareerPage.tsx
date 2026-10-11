import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowLeft, Briefcase, Mail } from "lucide-react";

const CAREER_EMAIL = import.meta.env.VITE_CAREER_EMAIL || "career@chemtial.com";

const CareerPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const jobs = [
    { titleKey: "pages.career.frontend" },
    { titleKey: "pages.career.backend" },
    { titleKey: "pages.career.uiux" },
    { titleKey: "pages.career.customer_service" },
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
          {t("pages.career.title")}
        </h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
        {jobs.map((job, index) => (
          <div
            key={index}
            className="p-5 bg-gray-50 rounded-xl border border-gray-100"
          >
            <Briefcase size={24} className="text-primary mb-2" />
            <h3 className="font-semibold text-secondary">{t(job.titleKey)}</h3>
            <p className="text-sm text-gray-500">
              {t("pages.career.location")}
            </p>
          </div>
        ))}
      </div>
      <div className="mt-8 p-6 bg-primary/5 rounded-xl border border-primary/10 max-w-2xl mx-auto">
        <h3 className="font-semibold text-primary text-center">
          {t("pages.career.send_application")}
        </h3>
        <p className="text-center text-sm text-gray-600 mt-2">
          {t("pages.career.send_application_desc")}
        </p>
        <div className="flex justify-center mt-3">
          <Mail size={20} className="text-primary" />
          <span className="ml-2 text-sm text-gray-600">{CAREER_EMAIL}</span>
        </div>
      </div>
    </div>
  );
};

export default CareerPage;
