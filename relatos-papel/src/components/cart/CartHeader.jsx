import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import CartBadge from "../../components/cart/CartBadge";

export default function CartHeader({ lang, onGoLang }) {
  const { t } = useTranslation("cart");

  return (
    <header className="cart__header">
      <div className="container-fluid">
        <div className="d-flex justify-content-end gap-3 mb-2" aria-label="Selector de idioma">
          <Link className="catalog__langLink" to={`/${lang}/catalog`} aria-label={t("header.backToCatalog")}>
            <i className="fa-solid fa-arrow-left" aria-hidden="true"></i>
            <span>{t("header.backToCatalog")}</span>
          </Link>

          <Link to={`/${lang}/cart`} aria-label={t("header.viewCart")} className="catalog__langLink">
            <CartBadge />
          </Link>

          <a
            className="catalog__langLink"
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onGoLang("es");
            }}
            aria-label={t("header.langEs")}
          >
            <img src="/assets/img/es.webp" alt="Español" width="20" height="14" loading="lazy" decoding="async" />
            <span>ESP</span>
          </a>

          <a
            className="catalog__langLink"
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onGoLang("en");
            }}
            aria-label={t("header.langEn")}
          >
            <img src="/assets/img/gb.webp" alt="English" width="20" height="14" loading="lazy" decoding="async" />
            <span>ENG</span>
          </a>
        </div>

        <div className="cart__titleWrap">
          <h1 className="cart__title">
            {t("header.title")} <span className="cart__titleAccent">{t("header.titleAccent")}</span>
          </h1>
          <p className="cart__subtitle">{t("header.subtitle")}</p>
        </div>
      </div>
    </header>
  );
}