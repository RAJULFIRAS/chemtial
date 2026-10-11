import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowLeft } from "lucide-react";

const TermsPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const sections = [
    { titleKey: "pages.terms.section1", descKey: "pages.terms.section1_desc" },
    { titleKey: "pages.terms.section2", descKey: "pages.terms.section2_desc" },
    { titleKey: "pages.terms.section3", descKey: "pages.terms.section3_desc" },
    { titleKey: "pages.terms.section4", descKey: "pages.terms.section4_desc" },
    { titleKey: "pages.terms.section5", descKey: "pages.terms.section5_desc" },
    { titleKey: "pages.terms.section6", descKey: "pages.terms.section6_desc" },
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
          {t("pages.terms.title")}
        </h1>
      </div>
      <div className="max-w-3xl space-y-6 text-gray-600">
        {sections.map((section, index) => (
          <div key={index}>
            <h3 className="font-semibold text-secondary text-lg mb-2">
              {t(section.titleKey)}
            </h3>
            <p className="text-sm">{t(section.descKey)}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TermsPage;
