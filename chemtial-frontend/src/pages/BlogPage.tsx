import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowLeft, Calendar, User, Tag } from "lucide-react";

const BlogPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const blogPosts = [
    {
      id: 1,
      titleKey: "pages.blog.post1_title",
      dateKey: "pages.blog.post1_date",
      categoryKey: "pages.blog.category_panduan",
      excerptKey: "pages.blog.post1_excerpt",
    },
    {
      id: 2,
      titleKey: "pages.blog.post2_title",
      dateKey: "pages.blog.post2_date",
      categoryKey: "pages.blog.category_keamanan",
      excerptKey: "pages.blog.post2_excerpt",
    },
    {
      id: 3,
      titleKey: "pages.blog.post3_title",
      dateKey: "pages.blog.post3_date",
      categoryKey: "pages.blog.category_industri",
      excerptKey: "pages.blog.post3_excerpt",
    },
    {
      id: 4,
      titleKey: "pages.blog.post4_title",
      dateKey: "pages.blog.post4_date",
      categoryKey: "pages.blog.category_peralatan",
      excerptKey: "pages.blog.post4_excerpt",
    },
    {
      id: 5,
      titleKey: "pages.blog.post5_title",
      dateKey: "pages.blog.post5_date",
      categoryKey: "pages.blog.category_tips",
      excerptKey: "pages.blog.post5_excerpt",
    },
    {
      id: 6,
      titleKey: "pages.blog.post6_title",
      dateKey: "pages.blog.post6_date",
      categoryKey: "pages.blog.category_produk",
      excerptKey: "pages.blog.post6_excerpt",
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
          {t("pages.blog.title")}
        </h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogPosts.map((post) => (
          <div
            key={post.id}
            className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="p-5">
              <div className="flex items-center gap-2 mb-2">
                <Tag size={14} className="text-primary" />
                <span className="text-xs text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                  {t(post.categoryKey)}
                </span>
              </div>
              <h3 className="font-semibold text-secondary text-lg mb-2">
                {t(post.titleKey)}
              </h3>
              <p className="text-gray-500 text-sm mb-3">{t(post.excerptKey)}</p>
              <div className="flex items-center justify-between text-xs text-gray-400">
                <span className="flex items-center gap-1">
                  <Calendar size={12} />
                  {t(post.dateKey)}
                </span>
                <span className="flex items-center gap-1">
                  <User size={12} />
                  Admin
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlogPage;
