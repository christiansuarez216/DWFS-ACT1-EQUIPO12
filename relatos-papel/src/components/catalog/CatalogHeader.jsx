import { useTranslation } from "react-i18next";
import { useNavigate, useParams, Link } from "react-router-dom";
import CartBadge from "../../components/cart/CartBadge";

export default function CatalogHeader() {
  const { lang } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation("catalog");

  const go = (next) => {
    if (next === lang) return;
    navigate(`/${next}/catalog`);
  };

  return (
    <header className="catalog__header">
      <div className="container-fluid">
        <div
          className="catalog__langBar d-flex justify-content-end gap-3 mb-2"
          aria-label={t("header.langBarAria")}
        >
          <Link
            className="catalog__cartLink"
            to={`/${lang}/cart`}
            aria-label={t("header.cartAria")}
          >
            <CartBadge />
          </Link>

          <a
            className="catalog__langLink"
            href="#"
            lang="es"
            aria-label={t("header.switchToEsAria")}
            aria-pressed={lang === "es"}
            onClick={(e) => {
              e.preventDefault();
              go("es");
            }}
          >
            <img
              src="/assets/img/es.webp"
              alt={t("header.langEsAlt")}
              width="20"
              height="14"
              loading="lazy"
              decoding="async"
            />
            <span>{t("header.langEsShort")}</span>
          </a>

          <a
            className="catalog__langLink"
            href="#"
            lang="en"
            aria-label={t("header.switchToEnAria")}
            aria-pressed={lang === "en"}
            onClick={(e) => {
              e.preventDefault();
              go("en");
            }}
          >
            <img
              src="/assets/img/gb.webp"
              alt={t("header.langEnAlt")}
              width="20"
              height="14"
              loading="lazy"
              decoding="async"
            />
            <span>{t("header.langEnShort")}</span>
          </a>
        </div>

        <div className="catalog__titleWrap">
          <h1 className="catalog__title text-center">
            {t("header.titleA")}{" "}
            <span className="catalog__titleAccent">{t("header.titleB")}</span>
          </h1>

          <p className="catalog__subtitle">{t("header.subtitle")}</p>
        </div>
      </div>
    </header>
  );
}