import React, { useRef } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import {
  HelpCircle,
  Truck,
  Album,
  CreditCard,
  Mail,
  Phone,
  MessageCircle,
  Share2,
  MapPin,
} from "lucide-react";
import playstoreImg from "../../asset/image/playstore.png";
import appstoreImg from "../../asset/image/appstore.png";
import xImg from "../../asset/image/x.png";
import instagramImg from "../../asset/image/instagram.png";
import tiktokImg from "../../asset/image/tiktok.png";
import discordImg from "../../asset/image/discord.png";
import whatsappImg from "../../asset/image/whatsapp.png";
import facebookImg from "../../asset/image/facebook.png";
import youtubeImg from "../../asset/image/youtube.png";
import { downloadApi } from "../../services/adminApi";

const SUPPORT_PHONE = import.meta.env.VITE_SUPPORT_PHONE || "+62 852-7717-3823";
const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP || "+62 852-7717-3823";
const SUPPORT_EMAIL =
  import.meta.env.VITE_SUPPORT_EMAIL || "inbox@chemtial.com";
const COMPANY_ADDRESS =
  import.meta.env.VITE_COMPANY_ADDRESS ||
  "D St, Boston, MA 02210, United States";

const Footer: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const lastClickRef = useRef<Record<string, number>>({});

  const DEBOUNCE_MS = 2000;

  const trackAndOpen = async (
    platform: "playstore" | "appstore",
    url: string,
  ): Promise<void> => {
    const now = Date.now();
    const lastClick = lastClickRef.current[platform] || 0;
    if (now - lastClick < DEBOUNCE_MS) {
      return;
    }
    lastClickRef.current[platform] = now;

    window.open(url, "_blank", "noopener,noreferrer");

    try {
      await downloadApi.track(platform, document.referrer || undefined);
    } catch (error) {
      console.error("Failed to track download:", error);
    }
  };

  const handlePlayStoreClick = (): void => {
    void trackAndOpen(
      "playstore",
      "https://play.google.com/store/apps/details?id=com.chemtial.app",
    );
  };

  const handleAppStoreClick = (): void => {
    void trackAndOpen(
      "appstore",
      "https://apps.apple.com/us/app/chemtial/id123456789",
    );
  };

  const handleWhatsAppClick = (): void => {
    const cleanNumber = WHATSAPP_NUMBER.replace(/[^\d]/g, "");
    window.open(`https://wa.me/${cleanNumber}`, "_blank");
  };

  const navigateTo = (path: string): void => {
    void navigate(path);
  };

  const socialLinks = {
    x: "https://x.com/chemtial",
    instagram: "https://instagram.com/chemtial",
    tiktok: "https://tiktok.com/@chemtial",
    discord: "https://discord.gg/chemtial",
    facebook: "https://facebook.com/chemtial",
    youtube: "https://youtube.com/@chemtial",
  };

  return (
    <footer className="bg-primary text-white mt-16">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <HelpCircle size={20} />
              {t("footer.customer_service")}
            </h3>
            <ul className="space-y-3">
              <li>
                <button
                  onClick={(): void => navigateTo("/faq")}
                  className="text-white/70 hover:text-white transition-colors text-sm"
                >
                  {t("footer.faq")}
                </button>
              </li>
              <li>
                <button
                  onClick={(): void => navigateTo("/how-to-shop")}
                  className="text-white/70 hover:text-white transition-colors text-sm"
                >
                  {t("footer.how_to_shop")}
                </button>
              </li>
              <li>
                <button
                  onClick={(): void => navigateTo("/b2b")}
                  className="text-white/70 hover:text-white transition-colors text-sm"
                >
                  B2B
                </button>
              </li>
              <li>
                <button
                  onClick={(): void => navigateTo("/free-shipping")}
                  className="text-white/70 hover:text-white transition-colors text-sm"
                >
                  {t("footer.free_shipping")}
                </button>
              </li>
              <li>
                <button
                  onClick={(): void => navigateTo("/help")}
                  className="text-white/70 hover:text-white transition-colors text-sm"
                >
                  {t("footer.help")}
                </button>
              </li>
              <li>
                <button
                  onClick={(): void => navigateTo("/explore")}
                  className="text-white/70 hover:text-white transition-colors text-sm"
                >
                  {t("footer.explore")}
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Album size={20} />
              {t("footer.about")}
            </h3>
            <ul className="space-y-3">
              <li>
                <button
                  onClick={(): void => navigateTo("/terms")}
                  className="text-white/70 hover:text-white transition-colors text-sm"
                >
                  {t("footer.terms")}
                </button>
              </li>
              <li>
                <button
                  onClick={(): void => navigateTo("/privacy")}
                  className="text-white/70 hover:text-white transition-colors text-sm"
                >
                  {t("footer.privacy")}
                </button>
              </li>
              <li>
                <button
                  onClick={(): void => navigateTo("/career")}
                  className="text-white/70 hover:text-white transition-colors text-sm"
                >
                  {t("footer.career")}
                </button>
              </li>
              <li>
                <button
                  onClick={(): void => navigateTo("/blog")}
                  className="text-white/70 hover:text-white transition-colors text-sm"
                >
                  {t("footer.blog")}
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <CreditCard size={20} />
              {t("footer.payment")}
            </h3>
            <ul className="space-y-3">
              <li className="text-white/70 text-sm">{t("footer.cod")}</li>
              <li className="text-white/70 text-sm">
                {t("footer.bank_transfer")}
              </li>
              <li className="text-white/70 text-sm">{t("footer.e_wallet")}</li>
            </ul>
          </div>

          <div>
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Truck size={20} />
                {t("footer.delivery")}
              </h3>
              <ul className="space-y-3">
                <li className="text-white/70 text-sm">
                  {t("footer.uber_connect")}
                </li>
                <li className="text-white/70 text-sm">
                  {t("footer.chemtial_logistics")}
                </li>
                <li className="text-white/70 text-sm">{t("footer.fedex")}</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Share2 size={20} />
                {t("footer.follow_us")}
              </h3>
              <div className="flex flex-wrap gap-3">
                <a
                  href={socialLinks.x}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
                  aria-label="X"
                >
                  <img src={xImg} alt="X" className="w-5 h-5 object-contain" />
                </a>
                <a
                  href={socialLinks.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
                  aria-label="Instagram"
                >
                  <img
                    src={instagramImg}
                    alt="Instagram"
                    className="w-5 h-5 object-contain"
                  />
                </a>
                <a
                  href={socialLinks.tiktok}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
                  aria-label="TikTok"
                >
                  <img
                    src={tiktokImg}
                    alt="TikTok"
                    className="w-5 h-5 object-contain"
                  />
                </a>
                <a
                  href={socialLinks.discord}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
                  aria-label="Discord"
                >
                  <img
                    src={discordImg}
                    alt="Discord"
                    className="w-5 h-5 object-contain"
                  />
                </a>
                <a
                  href={socialLinks.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
                  aria-label="Facebook"
                >
                  <img
                    src={facebookImg}
                    alt="Facebook"
                    className="w-5 h-5 object-contain"
                  />
                </a>
                <a
                  href={socialLinks.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
                  aria-label="YouTube"
                >
                  <img
                    src={youtubeImg}
                    alt="YouTube"
                    className="w-5 h-5 object-contain"
                  />
                </a>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <MessageCircle size={20} />
              {t("footer.contact_us")}
            </h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-white/70 text-sm">
                <Mail size={16} /> {SUPPORT_EMAIL}
              </li>
              <li className="flex items-center gap-2 text-white/70 text-sm">
                <Phone size={16} /> {SUPPORT_PHONE}
              </li>
              <li className="flex items-center gap-2 text-white/70 text-sm">
                <MapPin size={16} /> {COMPANY_ADDRESS}
              </li>
              <li>
                <button
                  onClick={handleWhatsAppClick}
                  className="flex items-center gap-2 text-white/70 hover:text-white transition-colors text-sm"
                >
                  <img
                    src={whatsappImg}
                    alt="WhatsApp"
                    className="w-4 h-4 object-contain"
                  />
                  WhatsApp
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/20 my-8"></div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex gap-4 items-center">
            <button
              onClick={handlePlayStoreClick}
              className="transition-transform hover:scale-105 active:scale-95"
              aria-label="Download on Google Play"
            >
              <img
                src={playstoreImg}
                alt="Get it on Google Play"
                style={{
                  width: "170px",
                  height: "60px",
                  objectFit: "contain",
                }}
              />
            </button>

            <button
              onClick={handleAppStoreClick}
              className="transition-transform hover:scale-105 active:scale-95"
              aria-label="Download on App Store"
            >
              <img
                src={appstoreImg}
                alt="Download on the App Store"
                style={{
                  width: "130px",
                  height: "40px",
                  objectFit: "contain",
                }}
              />
            </button>
          </div>

          <div className="text-white/60 text-sm text-center">
            © 2026 - {t("footer.copyright")}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
