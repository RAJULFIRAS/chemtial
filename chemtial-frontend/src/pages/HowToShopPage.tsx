import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  ArrowLeft,
  Search,
  ShoppingBag,
  ShoppingCart,
  CreditCard,
  Package,
  Truck,
} from "lucide-react";

const HowToShopPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const steps = [
    {
      icon: <Search size={24} />,
      titleKey: "pages.how_to_shop.step1_title",
      descKey: "pages.how_to_shop.step1_desc",
    },
    {
      icon: <ShoppingBag size={24} />,
      titleKey: "pages.how_to_shop.step2_title",
      descKey: "pages.how_to_shop.step2_desc",
    },
    {
      icon: <ShoppingCart size={24} />,
      titleKey: "pages.how_to_shop.step3_title",
      descKey: "pages.how_to_shop.step3_desc",
    },
    {
      icon: <CreditCard size={24} />,
      titleKey: "pages.how_to_shop.step4_title",
      descKey: "pages.how_to_shop.step4_desc",
    },
    {
      icon: <Package size={24} />,
      titleKey: "pages.how_to_shop.step5_title",
      descKey: "pages.how_to_shop.step5_desc",
    },
    {
      icon: <Truck size={24} />,
      titleKey: "pages.how_to_shop.step6_title",
      descKey: "pages.how_to_shop.step6_desc",
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
          {t("pages.how_to_shop.title")}
        </h1>
        <p className="text-secondary/60 mt-2">
          {t("pages.how_to_shop.subtitle")}
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {steps.map((step, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                {step.icon}
              </div>
              <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                {t("pages.how_to_shop.step")} {index + 1}
              </span>
            </div>
            <h3 className="font-semibold text-secondary text-lg mb-2">
              {t(step.titleKey)}
            </h3>
            <p className="text-gray-500 text-sm">{t(step.descKey)}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HowToShopPage;
