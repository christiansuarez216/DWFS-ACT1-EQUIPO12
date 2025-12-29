import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export default function RecommendationsPanel({ lang }) {
  const { t } = useTranslation("catalog");
  const [items, setItems] = useState([]);

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        const res = await fetch("/data/recommendations.json");
        const data = await res.json();
        if (!alive) return;

        setItems(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error("Error cargando recommendations.json:", e);
        if (alive) setItems([]);
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  return (
    <div
      className="panel panel--elevated"
      aria-label={t("recommendations.aria")}
    >
      <div className="panel__head">
        <i className="fa-regular fa-sparkles" aria-hidden="true"></i>
        <div>
          <div className="fw-bold">{t("recommendations.title")}</div>
          <div className="rec__sub">{t("recommendations.subtitle")}</div>
        </div>
      </div>

      <div className="panel__body">
        <div className="d-grid gap-2">
          {items.map((b) => (
            <div className="recItem" key={b.id}>
              <img
                className="recItem__img"
                src={b.img}
                alt={b.imgAlt?.[lang] || `${t("recommendations.coverAltPrefix")} ${b.title?.[lang] || ""}`}
                width="56"
                height="56"
                loading="lazy"
                decoding="async"
              />

              <div className="recItem__body">
                <p className="recItem__title">{b.title?.[lang] || ""}</p>
                <p className="recItem__author">{b.author}</p>

                <div className="recItem__meta">
                  <span>
                    <i className="fa-solid fa-star" aria-hidden="true"></i>{" "}
                    {b.rating}
                  </span>
                  <span>{formatUSD(b.price)}</span>
                </div>

                <a
                  className="recItem__link"
                  href={b.href ? `/${lang}/catalog/book/${b.href}` : "#"}
                  aria-label={t("recommendations.detailsAria", {
                    title: b.title?.[lang] || ""
                  })}
                >
                  {t("recommendations.details")}{" "}
                  <i className="fa-solid fa-arrow-right" aria-hidden="true"></i>
                </a>
              </div>
            </div>
          ))}

          {items.length === 0 && (
            <p className="text-muted mb-0">
              {t("recommendations.empty")}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function formatUSD(value) {
  const n = Number(value);
  const safe = Number.isFinite(n) ? n : 0;
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(safe);
}