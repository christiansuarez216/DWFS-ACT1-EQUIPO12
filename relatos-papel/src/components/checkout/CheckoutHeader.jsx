import { useTranslation } from "react-i18next";
import { useParams, Link, useNavigate } from "react-router-dom";
import CartBadge from "../../components/cart/CartBadge";

export default function CheckoutHeader() {
  const { lang } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation("checkout");

  const go = (next) => {
    if (next === lang) return;
    navigate(`/${next}/checkout`);
  };

  return (
    <header className="pay__header">
      <div className="container-fluid">
        <div className="d-flex justify-content-end gap-3 mb-2" aria-label="Acciones y selector de idioma">
          <Link className="catalog__langLink" to={`/${lang}/cart`} aria-label={lang === "en" ? "View cart" : "Ver carrito"}>
            <CartBadge />
          </Link>

          <a
            className="catalog__langLink"
            href="#"
            onClick={(e) => {
              e.preventDefault();
              go("es");
            }}
            aria-label="Cambiar idioma a Español"
          >
            <img src="/assets/img/es.webp" alt="Español" width="20" height="14" />
            <span>ESP</span>
          </a>

          <a
            className="catalog__langLink"
            href="#"
            onClick={(e) => {
              e.preventDefault();
              go("en");
            }}
            aria-label="Switch language to English"
          >
            <img src="/assets/img/gb.webp" alt="English" width="20" height="14" />
            <span>ENG</span>
          </a>
        </div>

        <div className="pay__titleWrap">
          <h1 className="pay__title">
            {t("header.title")} <span className="pay__titleAccent">{t("header.accent")}</span>
          </h1>
          <p className="pay__subtitle">{t("header.subtitle")}</p>
        </div>
      </div>
    </header>
  );
}