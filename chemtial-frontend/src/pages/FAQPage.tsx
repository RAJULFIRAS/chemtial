import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  ChevronDown,
  ChevronUp,
  Mail,
  Phone,
  MapPin,
  ArrowLeft,
} from "lucide-react";

const SUPPORT_PHONE = import.meta.env.VITE_SUPPORT_PHONE || "+62 852-7717-3823";
const SUPPORT_EMAIL =
  import.meta.env.VITE_SUPPORT_EMAIL || "inbox@chemtial.com";
const COMPANY_ADDRESS =
  import.meta.env.VITE_COMPANY_ADDRESS ||
  "D St, Boston, MA 02210, United States";

const faqData = [
  { id: 1, questionKey: "pages.faq.question1", answerKey: "pages.faq.answer1" },
  { id: 2, questionKey: "pages.faq.question2", answerKey: "pages.faq.answer2" },
  { id: 3, questionKey: "pages.faq.question3", answerKey: "pages.faq.answer3" },
  { id: 4, questionKey: "pages.faq.question4", answerKey: "pages.faq.answer4" },
  { id: 5, questionKey: "pages.faq.question5", answerKey: "pages.faq.answer5" },
  { id: 6, questionKey: "pages.faq.question6", answerKey: "pages.faq.answer6" },
  { id: 7, questionKey: "pages.faq.question7", answerKey: "pages.faq.answer7" },
  { id: 8, questionKey: "pages.faq.question8", answerKey: "pages.faq.answer8" },
];

const FAQPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [openFaqId, setOpenFaqId] = useState<number | null>(null);

  const toggleFaq = (id: number) => {
    setOpenFaqId(openFaqId === id ? null : id);
  };

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
          {t("pages.faq.title")}
        </h1>
        <p className="text-secondary/60 mt-2">{t("pages.faq.subtitle")}</p>
      </div>
      <div className="relative mb-8 max-w-md">
        <input
          type="text"
          placeholder={t("pages.faq.search_placeholder")}
          className="w-full px-4 py-3 pl-11 border border-gray-200 rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
        />
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>
      <div className="space-y-3 max-w-3xl">
        {faqData.map((faq) => (
          <div
            key={faq.id}
            className="border border-gray-200 rounded-xl overflow-hidden hover:border-gray-300 transition-colors"
          >
            <button
              className="w-full px-5 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
              onClick={() => toggleFaq(faq.id)}
            >
              <span className="font-medium text-secondary">
                {t(faq.questionKey)}
              </span>
              {openFaqId === faq.id ? (
                <ChevronUp
                  size={18}
                  className="text-primary flex-shrink-0 ml-4"
                />
              ) : (
                <ChevronDown
                  size={18}
                  className="text-gray-400 flex-shrink-0 ml-4"
                />
              )}
            </button>
            {openFaqId === faq.id && (
              <div className="px-5 pb-4 text-gray-500 border-t border-gray-100 pt-4">
                {t(faq.answerKey)}
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="mt-10 p-6 bg-gray-50 rounded-xl max-w-3xl border border-gray-100">
        <h3 className="font-semibold text-secondary text-lg mb-3">
          {t("pages.faq.still_need_help")}
        </h3>
        <p className="text-gray-500 text-sm mb-4">
          {t("pages.faq.contact_us")}
        </p>
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-3 text-gray-600">
            <Mail size={18} className="text-primary flex-shrink-0" />{" "}
            {SUPPORT_EMAIL}
          </div>
          <div className="flex items-center gap-3 text-gray-600">
            <Phone size={18} className="text-primary flex-shrink-0" />{" "}
            {SUPPORT_PHONE}
          </div>
          <div className="flex items-center gap-3 text-gray-600">
            <MapPin size={18} className="text-primary flex-shrink-0" />
            {COMPANY_ADDRESS}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQPage;
