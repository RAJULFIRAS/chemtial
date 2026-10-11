import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "./store";
import { RootState } from "./store";
import { closePromo, closeVoucher, closeBrand } from "./store/slices/uiSlice";
import { fetchCart } from "./store/slices/cartSlice";
import { fetchProducts } from "./store/slices/productSlice";

import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import ScrollToTop from "./components/ScrollToTop";

import ImageSlider from "./components/home/ImageSlider";
import PromoSection from "./components/home/PromoSection";
import BrandSection from "./components/home/BrandSection";
import CategorySection from "./components/home/CategorySection";
import NewProductsSection from "./components/home/NewProductsSection";
import ProductGrid from "./components/home/ProductGrid";

import PromoPage from "./pages/PromoPage";
import VoucherPage from "./pages/VoucherPage";
import MyVouchersPage from "./pages/MyVouchersPage";
import BrandPage from "./pages/BrandPage";
import FAQPage from "./pages/FAQPage";
import HowToShopPage from "./pages/HowToShopPage";
import B2BPage from "./pages/B2BPage";
import FreeShippingPage from "./pages/FreeShippingPage";
import HelpPage from "./pages/HelpPage";
import ExplorePage from "./pages/ExplorePage";
import TermsPage from "./pages/TermsPage";
import PrivacyPage from "./pages/PrivacyPage";
import CareerPage from "./pages/CareerPage";
import BlogPage from "./pages/BlogPage";
import AllProductsPage from "./pages/AllProductsPage";
import ProductDetailPage from "./pages/ProductDetailPage";

import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import ProfilePage from "./pages/auth/ProfilePage";
import UserOrdersPage from "./pages/auth/OrdersPage";
import CheckoutPage from "./pages/auth/CheckoutPage";
import OrderConfirmationPage from "./pages/auth/OrderConfirmationPage";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "./pages/auth/ResetPasswordPage";

import AdminLayout from "./pages/admin/AdminLayout";
import DashboardPage from "./pages/admin/DashboardPage";
import CategoriesPage from "./pages/admin/CategoriesPage";
import BrandsPage from "./pages/admin/BrandsPage";
import VouchersPage from "./pages/admin/VouchersPage";
import Bannerpage from "./pages/admin/Bannerpage";
import ProductsPage from "./pages/admin/ProductsPage";
import Userpage from "./pages/admin/UserPage";
import OrderPage from "./pages/admin/OrderPage";
import OrderHistoryPage from "./pages/admin/OrderHistoryPage";
import AccountingPage from "./pages/admin/AccountingPage";
import AppTrackerPage from "./pages/admin/AppTrackerPage";
import CodPage from "./pages/admin/CodPage";

const PageLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { isPromoOpen, isVoucherOpen, isBrandOpen } = useSelector(
    (state: RootState) => state.ui,
  );

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 pt-14">{children}</main>
      <Footer />
      <PromoPage isOpen={isPromoOpen} onClose={() => dispatch(closePromo())} />
      <VoucherPage
        isOpen={isVoucherOpen}
        onClose={() => dispatch(closeVoucher())}
      />
      <BrandPage isOpen={isBrandOpen} onClose={() => dispatch(closeBrand())} />
    </div>
  );
};

function HomePage() {
  const dispatch = useDispatch<AppDispatch>();
  const { products, filteredProducts, isLoading } = useSelector(
    (state: RootState) => state.product,
  );
  const { isPromoOpen, isVoucherOpen, isBrandOpen } = useSelector(
    (state: RootState) => state.ui,
  );
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    dispatch(fetchProducts({ page: 1, limit: 8 }));

    if (isAuthenticated) {
      dispatch(fetchCart());
    }
  }, [dispatch, isAuthenticated]);

  const isSearching =
    filteredProducts.length > 0 && filteredProducts.length !== products.length;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-primary text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 pt-14">
        <div className="container-custom py-8">
          <ImageSlider />
          <PromoSection />
          <BrandSection />
          <CategorySection />
          {isSearching ? (
            <ProductGrid
              products={filteredProducts}
              title="home.search_results"
            />
          ) : (
            <NewProductsSection />
          )}
        </div>
      </main>
      <Footer />
      <PromoPage isOpen={isPromoOpen} onClose={() => dispatch(closePromo())} />
      <VoucherPage
        isOpen={isVoucherOpen}
        onClose={() => dispatch(closeVoucher())}
      />
      <BrandPage isOpen={isBrandOpen} onClose={() => dispatch(closeBrand())} />
    </div>
  );
}

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/orders" element={<UserOrdersPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/orders/:id" element={<OrderConfirmationPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />

        <Route
          path="/vouchers"
          element={
            <PageLayout>
              <MyVouchersPage />
            </PageLayout>
          }
        />
        <Route
          path="/products"
          element={
            <PageLayout>
              <AllProductsPage />
            </PageLayout>
          }
        />
        <Route
          path="/product/:id"
          element={
            <PageLayout>
              <ProductDetailPage />
            </PageLayout>
          }
        />
        <Route
          path="/faq"
          element={
            <PageLayout>
              <FAQPage />
            </PageLayout>
          }
        />
        <Route
          path="/how-to-shop"
          element={
            <PageLayout>
              <HowToShopPage />
            </PageLayout>
          }
        />
        <Route
          path="/b2b"
          element={
            <PageLayout>
              <B2BPage />
            </PageLayout>
          }
        />
        <Route
          path="/free-shipping"
          element={
            <PageLayout>
              <FreeShippingPage />
            </PageLayout>
          }
        />
        <Route
          path="/help"
          element={
            <PageLayout>
              <HelpPage />
            </PageLayout>
          }
        />
        <Route
          path="/explore"
          element={
            <PageLayout>
              <ExplorePage />
            </PageLayout>
          }
        />
        <Route
          path="/terms"
          element={
            <PageLayout>
              <TermsPage />
            </PageLayout>
          }
        />
        <Route
          path="/privacy"
          element={
            <PageLayout>
              <PrivacyPage />
            </PageLayout>
          }
        />
        <Route
          path="/career"
          element={
            <PageLayout>
              <CareerPage />
            </PageLayout>
          }
        />
        <Route
          path="/blog"
          element={
            <PageLayout>
              <BlogPage />
            </PageLayout>
          }
        />

        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="categories" element={<CategoriesPage />} />
          <Route path="brands" element={<BrandsPage />} />
          <Route path="vouchers" element={<VouchersPage />} />
          <Route path="banners" element={<Bannerpage />} />
          <Route path="products" element={<ProductsPage />} />
          <Route path="users" element={<Userpage />} />
          <Route path="orders" element={<OrderPage />} />
          <Route path="cod" element={<CodPage />} />
          <Route path="order-history" element={<OrderHistoryPage />} />
          <Route path="accounting" element={<AccountingPage />} />
          <Route path="app-tracker" element={<AppTrackerPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
