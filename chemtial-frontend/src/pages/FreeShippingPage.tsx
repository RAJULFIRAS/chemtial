import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowLeft, Truck, CheckCircle, MapPin, Clock } from "lucide-react";

const FreeShippingPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const features = [
    {
      icon: <Truck size={40} />,
      titleKey: "pages.free_shipping.min_purchase",
      descKey: "pages.free_shipping.min_purchase_desc",
    },
    {
      icon: <MapPin size={40} />,
      titleKey: "pages.free_shipping.all_country",
      descKey: "pages.free_shipping.all_country_desc",
    },
    {
      icon: <Clock size={40} />,
      titleKey: "pages.free_shipping.limited_time",
      descKey: "pages.free_shipping.limited_time_desc",
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
          {t("pages.free_shipping.title")}
        </h1>
        <p className="text-secondary/60 mt-2">
          {t("pages.free_shipping.subtitle")}
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {features.map((feature, index) => (
          <div
            key={index}
            className="p-6 bg-gray-50 rounded-xl border border-gray-100 text-center"
          >
            <div className="text-primary mx-auto mb-3 flex justify-center">
              {feature.icon}
            </div>
            <h3 className="font-semibold text-secondary">
              {t(feature.titleKey)}
            </h3>
            <p className="text-gray-500 text-sm mt-2">{t(feature.descKey)}</p>
          </div>
        ))}
      </div>
      <div className="p-6 bg-primary/5 rounded-xl border border-primary/10 max-w-2xl mx-auto">
        <h3 className="font-semibold text-primary text-center mb-3">
          {t("pages.free_shipping.terms_title")}
        </h3>
        <ul className="space-y-2 text-sm text-gray-600">
          <li className="flex items-start gap-2">
            <CheckCircle
              size={16}
              className="text-primary flex-shrink-0 mt-0.5"
            />{" "}
            {t("pages.free_shipping.term1")}
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle
              size={16}
              className="text-primary flex-shrink-0 mt-0.5"
            />{" "}
            {t("pages.free_shipping.term2")}
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle
              size={16}
              className="text-primary flex-shrink-0 mt-0.5"
            />{" "}
            {t("pages.free_shipping.term3")}
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle
              size={16}
              className="text-primary flex-shrink-0 mt-0.5"
            />{" "}
            {t("pages.free_shipping.term4")}
          </li>
        </ul>
      </div>
    </div>
  );
};

export default FreeShippingPage;
