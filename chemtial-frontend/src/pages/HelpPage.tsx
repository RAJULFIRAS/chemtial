import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  ArrowLeft,
  HelpCircle,
  Mail,
  Phone,
  MapPin,
  MessageCircle,
} from "lucide-react";

const SUPPORT_PHONE = import.meta.env.VITE_SUPPORT_PHONE || "+62 852-7717-3823";
const SUPPORT_EMAIL =
  import.meta.env.VITE_SUPPORT_EMAIL || "inbox@chemtial.com";
const COMPANY_ADDRESS =
  import.meta.env.VITE_COMPANY_ADDRESS ||
  "D St, Boston, MA 02210, United States";

const HelpPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const cleanPhone = SUPPORT_PHONE.replace(/[^\d+]/g, "");

  const helpOptions = [
    {
      icon: <HelpCircle size={32} />,
      titleKey: "pages.help.faq",
      descKey: "pages.help.faq_desc",
      link: "/faq",
      btnText: "Lihat FAQ →",
    },
    {
      icon: <MessageCircle size={32} />,
      titleKey: "pages.help.live_chat",
      descKey: "pages.help.live_chat_desc",
      link: "#",
      btnText: "Mulai Chat →",
    },
    {
      icon: <Mail size={32} />,
      titleKey: "pages.help.email",
      descKey: "pages.help.email_desc",
      link: `mailto:${SUPPORT_EMAIL}`,
      btnText: "Kirim Email →",
    },
    {
      icon: <Phone size={32} />,
      titleKey: "pages.help.phone",
      descKey: "pages.help.phone_desc",
      link: `tel:${cleanPhone}`,
      btnText: "Hubungi →",
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
          {t("pages.help.title")}
        </h1>
        <p className="text-secondary/60 mt-2">{t("pages.help.subtitle")}</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {helpOptions.map((option, index) => (
          <div
            key={index}
            className="p-6 bg-gray-50 rounded-xl border border-gray-100"
          >
            <div className="text-primary mb-3">{option.icon}</div>
            <h3 className="font-semibold text-secondary">
              {t(option.titleKey)}
            </h3>
            <p className="text-gray-500 text-sm mt-2">{t(option.descKey)}</p>
            {option.link.startsWith("http") ||
            option.link.startsWith("mailto") ||
            option.link.startsWith("tel") ? (
              <a
                href={option.link}
                className="mt-3 text-primary text-sm font-medium hover:underline inline-block"
              >
                {option.btnText}
              </a>
            ) : (
              <button
                onClick={() => navigate(option.link)}
                className="mt-3 text-primary text-sm font-medium hover:underline"
              >
                {option.btnText}
              </button>
            )}
          </div>
        ))}
      </div>
      <div className="mt-10 p-6 bg-primary/5 rounded-xl border border-primary/10 max-w-4xl mx-auto">
        <div className="flex items-center gap-2 justify-center mb-3">
          <MapPin size={18} className="text-primary" />
          <span className="font-semibold text-secondary">
            {t("pages.help.visit_us")}
          </span>
        </div>
        <p className="text-center text-gray-600 text-sm">{COMPANY_ADDRESS}</p>
      </div>
    </div>
  );
};

export default HelpPage;
