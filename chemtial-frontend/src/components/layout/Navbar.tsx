import React, { useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useDebouncedCallback } from "../../hooks/useDebouncedCallback";
import { useNavigate } from "react-router-dom";
import {
  ShoppingCart,
  User,
  LogIn,
  UserPlus,
  LogOut,
  Package,
  ChevronDown,
  Search,
  Grid3x3,
  Tag,
  Sparkles,
  Ticket,
  Menu,
  X,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { RootState } from "../../store";
import { logout } from "../../store/slices/authSlice";
import { openPromo, openVoucher, openBrand } from "../../store/slices/uiSlice";
import Button from "../common/Button";
import Input from "../common/Input";
import CartDropdown from "../cart/CartDropdown";
import CategoryDropdown from "./CategoryDropdown";
import LanguageSwitcher from "./LanguageSwitcher";
import logo from "../../asset/image/logo.png";

interface NavbarProps {
  className?: string;
}

const Navbar: React.FC<NavbarProps> = ({ className = "" }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { isAuthenticated, user } = useSelector(
    (state: RootState) => state.auth,
  );
  const { totalQuantity } = useSelector((state: RootState) => state.cart);

  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState<boolean>(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [searchValue, setSearchValue] = useState<string>("");

  const navigateTo = useCallback(
    (path: string): void => {
      void navigate(path);
    },
    [navigate],
  );

  const handleLogoClick = useCallback((): void => {
    navigateTo("/");
  }, [navigateTo]);

  const handleLogout = useCallback((): void => {
    dispatch(logout());
    setIsUserMenuOpen(false);
    setIsMobileMenuOpen(false);
    navigateTo("/");
  }, [dispatch, navigateTo]);

  const debouncedSearch = useDebouncedCallback((value: string) => {
    const trimmed = value.trim();
    if (trimmed.length > 0) {
      navigateTo(`/products?search=${encodeURIComponent(trimmed)}`);
    } else {
      navigateTo("/products");
    }
  }, 500);

  const handleSearch = useCallback(
    (value: string): void => {
      setSearchValue(value);
      debouncedSearch(value);
    },
    [debouncedSearch],
  );

  const handleCategorySelect = useCallback(
    (categoryId: string): void => {
      setIsCategoryOpen(false);
      navigateTo(`/products?category=${encodeURIComponent(categoryId)}`);
    },
    [navigateTo],
  );

  const handlePromoClick = useCallback((): void => {
    dispatch(openPromo());
    setIsMobileMenuOpen(false);
  }, [dispatch]);

  const handleVoucherClick = useCallback((): void => {
    dispatch(openVoucher());
    setIsMobileMenuOpen(false);
  }, [dispatch]);

  const handleBrandClick = useCallback((): void => {
    dispatch(openBrand());
    setIsMobileMenuOpen(false);
  }, [dispatch]);

  const toggleCart = useCallback((): void => {
    setIsCartOpen((prev) => !prev);
  }, []);

  const toggleUserMenu = useCallback((): void => {
    setIsUserMenuOpen((prev) => !prev);
  }, []);

  const toggleCategory = useCallback((): void => {
    setIsCategoryOpen((prev) => !prev);
  }, []);

  const toggleMobileMenu = useCallback((): void => {
    setIsMobileMenuOpen((prev) => !prev);
  }, []);

  const handleMobileNav = useCallback((action: () => void): void => {
    setIsMobileMenuOpen(false);
    action();
  }, []);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 bg-background/95 backdrop-blur-md shadow-sm z-50 ${className}`}
      >
        <div className="container-custom">
          <div className="flex items-center justify-between h-14 gap-2">
            <div className="flex items-center gap-2">
              <button
                onClick={toggleMobileMenu}
                className="lg:hidden p-2 -ml-2 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Toggle menu"
                aria-expanded={isMobileMenuOpen}
              >
                {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>

              <button
                onClick={handleLogoClick}
                className="flex items-center gap-2 hover:opacity-80 transition-opacity flex-shrink-0"
                aria-label={t("navbar.home")}
              >
                <img
                  src={logo}
                  alt="Chemtial Logo"
                  className="h-7 w-auto object-contain"
                />
                <span className="text-lg font-bold text-primary hidden sm:inline">
                  Chemtial
                </span>
              </button>
            </div>

            <div className="hidden lg:flex items-center gap-0.5 relative">
              <button
                onClick={toggleCategory}
                className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 text-sm ${
                  isCategoryOpen
                    ? "bg-primary/10 text-primary"
                    : "text-secondary hover:text-primary hover:bg-gray-50"
                }`}
                aria-expanded={isCategoryOpen}
              >
                <Grid3x3 size={15} /> {t("navbar.categories")}{" "}
                <ChevronDown
                  size={12}
                  className={`transition-transform ${isCategoryOpen ? "rotate-180" : ""}`}
                />
              </button>

              <CategoryDropdown
                isOpen={isCategoryOpen}
                onClose={(): void => setIsCategoryOpen(false)}
                onCategorySelect={handleCategorySelect}
              />

              <button
                onClick={handleBrandClick}
                className="px-3 py-1.5 text-secondary hover:text-primary hover:bg-gray-50 rounded-lg transition-colors flex items-center gap-1 text-sm"
              >
                <Tag size={15} /> {t("navbar.brand")}
              </button>

              <button
                onClick={handlePromoClick}
                className="px-3 py-1.5 text-secondary hover:text-primary hover:bg-gray-50 rounded-lg transition-colors flex items-center gap-1 text-sm"
              >
                <Sparkles size={15} /> {t("navbar.promo")}
              </button>

              <button
                onClick={handleVoucherClick}
                className="px-3 py-1.5 text-secondary hover:text-primary hover:bg-gray-50 rounded-lg transition-colors flex items-center gap-1 text-sm"
              >
                <Ticket size={15} /> {t("navbar.voucher")}
              </button>
            </div>

            <div className="hidden md:block flex-1 max-w-sm mx-3">
              <Input
                type="search"
                placeholder={t("navbar.search")}
                value={searchValue}
                onChange={handleSearch}
                icon={<Search size={16} className="text-secondary" />}
                onClear={(): void => {
                  setSearchValue("");
                  navigateTo("/products");
                }}
              />
            </div>

            <div className="flex items-center gap-1 flex-shrink-0">
              <LanguageSwitcher />

              <div className="relative">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleCart}
                  icon={ShoppingCart}
                  ariaLabel={t("navbar.cart")}
                >
                  <span className="hidden sm:inline text-sm">
                    {t("navbar.cart")}
                  </span>
                </Button>
                {totalQuantity > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-primary text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                    {totalQuantity}
                  </span>
                )}
              </div>

              {isAuthenticated ? (
                <div className="relative">
                  <button
                    onClick={toggleUserMenu}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                    aria-expanded={isUserMenuOpen}
                  >
                    <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center">
                      <User size={15} className="text-primary" />
                    </div>
                    <span className="hidden md:inline text-secondary text-sm">
                      {user?.name ?? "User"}
                    </span>
                    <ChevronDown
                      size={12}
                      className="text-secondary hidden md:inline"
                    />
                  </button>

                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-44 bg-white rounded-xl shadow-lg border border-gray-100 py-1 animate-fade-in">
                      <button
                        onClick={(): void => navigateTo("/profile")}
                        className="w-full px-3 py-1.5 text-left text-secondary hover:bg-gray-50 transition-colors flex items-center gap-2 text-sm"
                      >
                        <User size={14} /> {t("navbar.profile")}
                      </button>
                      <button
                        onClick={(): void => navigateTo("/vouchers")}
                        className="w-full px-3 py-1.5 text-left text-secondary hover:bg-gray-50 transition-colors flex items-center gap-2 text-sm"
                      >
                        <Ticket size={14} /> {t("my_vouchers.title")}
                      </button>
                      <button
                        onClick={(): void => navigateTo("/orders")}
                        className="w-full px-3 py-1.5 text-left text-secondary hover:bg-gray-50 transition-colors flex items-center gap-2 text-sm"
                      >
                        <Package size={14} /> {t("navbar.orders")}
                      </button>
                      <hr className="my-1" />
                      <button
                        onClick={handleLogout}
                        className="w-full px-3 py-1.5 text-left text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2 text-sm"
                      >
                        <LogOut size={14} /> {t("navbar.logout")}
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="hidden sm:flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={LogIn}
                    onClick={() => navigate("/login")}
                  >
                    {t("navbar.login")}
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    icon={UserPlus}
                    onClick={() => navigate("/register")}
                  >
                    {t("navbar.register")}
                  </Button>
                </div>
              )}
            </div>
          </div>

          <div className="md:hidden pb-3">
            <Input
              type="search"
              placeholder={t("navbar.search")}
              value={searchValue}
              onChange={handleSearch}
              icon={<Search size={16} className="text-secondary" />}
              onClear={(): void => {
                setSearchValue("");
                navigateTo("/products");
              }}
            />
          </div>
        </div>
      </nav>

      {isMobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden animate-fade-in"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="fixed top-14 left-0 right-0 bg-white shadow-lg z-40 lg:hidden animate-slide-up">
            <div className="p-4 space-y-1">
              <button
                onClick={() => handleMobileNav(toggleCategory)}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors text-secondary"
              >
                <Grid3x3 size={18} />
                <span className="text-sm font-medium">
                  {t("navbar.categories")}
                </span>
                <ChevronDown
                  size={14}
                  className={`ml-auto transition-transform ${
                    isCategoryOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              <button
                onClick={() => handleMobileNav(handleBrandClick)}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors text-secondary"
              >
                <Tag size={18} />
                <span className="text-sm font-medium">{t("navbar.brand")}</span>
              </button>

              <button
                onClick={() => handleMobileNav(handlePromoClick)}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors text-secondary"
              >
                <Sparkles size={18} />
                <span className="text-sm font-medium">{t("navbar.promo")}</span>
              </button>

              <button
                onClick={() => handleMobileNav(handleVoucherClick)}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors text-secondary"
              >
                <Ticket size={18} />
                <span className="text-sm font-medium">
                  {t("navbar.voucher")}
                </span>
              </button>

              {!isAuthenticated && (
                <>
                  <hr className="my-2" />
                  <div className="flex gap-2 px-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      icon={LogIn}
                      onClick={() => handleMobileNav(() => navigate("/login"))}
                      className="flex-1"
                    >
                      {t("navbar.login")}
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      icon={UserPlus}
                      onClick={() =>
                        handleMobileNav(() => navigate("/register"))
                      }
                      className="flex-1"
                    >
                      {t("navbar.register")}
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>
        </>
      )}

      <CartDropdown
        isOpen={isCartOpen}
        onClose={(): void => setIsCartOpen(false)}
      />
    </>
  );
};

export default Navbar;
