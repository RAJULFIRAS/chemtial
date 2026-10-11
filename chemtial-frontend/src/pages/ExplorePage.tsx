import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  ArrowLeft,
  Package,
  Tag,
  Truck,
  Award,
  Shield,
  Clock,
} from "lucide-react";

const ExplorePage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const exploreItems = [
    {
      icon: <Package size={32} />,
      titleKey: "pages.explore.featured_products",
      descKey: "pages.explore.featured_products_desc",
      link: "/",
    },
    {
      icon: <Tag size={32} />,
      titleKey: "pages.explore.special_promo",
      descKey: "pages.explore.special_promo_desc",
      link: "#",
    },
    {
      icon: <Truck size={32} />,
      titleKey: "pages.explore.fast_delivery",
      descKey: "pages.explore.fast_delivery_desc",
      link: "#",
    },
    {
      icon: <Award size={32} />,
      titleKey: "pages.explore.original_guarantee",
      descKey: "pages.explore.original_guarantee_desc",
      link: "#",
    },
    {
      icon: <Shield size={32} />,
      titleKey: "pages.explore.secure_transaction",
      descKey: "pages.explore.secure_transaction_desc",
      link: "#",
    },
    {
      icon: <Clock size={32} />,
      titleKey: "pages.explore.customer_service",
      descKey: "pages.explore.customer_service_desc",
      link: "/help",
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
          {t("pages.explore.title")}
        </h1>
        <p className="text-secondary/60 mt-2">{t("pages.explore.subtitle")}</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {exploreItems.map((item, index) => (
          <div
            key={index}
            className="p-6 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="text-primary mb-3">{item.icon}</div>
            <h3 className="font-semibold text-secondary">{t(item.titleKey)}</h3>
            <p className="text-gray-500 text-sm mt-2">{t(item.descKey)}</p>
            <button
              onClick={() => navigate(item.link)}
              className="mt-3 text-primary text-sm font-medium hover:underline"
            >
              Lihat →
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExplorePage;
