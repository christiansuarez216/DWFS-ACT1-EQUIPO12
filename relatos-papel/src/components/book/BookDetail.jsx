import { useTranslation } from "react-i18next";
import { useQty } from "../../hooks/useQty";
import { useNavigate } from "react-router-dom";
import { addToCart } from "../../utils/cartUtils";

export default function BookDetail({ lang, book }) {
  const { t } = useTranslation("book");
  const qty = useQty(1);
  const navigate = useNavigate();

  const statusText =
    book.statusI18n?.[lang] ??
    (book.inStock ? t("detail.status.available") : t("detail.status.soldOut"));

  const genreText = book.genreI18n?.[lang] ?? book.genre;

  const summary =
    lang === "en" ? book.summaryEn || book.desc : book.summaryEs || book.desc;


    const handleAddToCart = () => {
        for (let i = 0; i < qty.value; i++) {
            addToCart(book);
        }
        navigate(`/${lang}/cart`);
    };


  return (
    <div className="panel panel--elevated bookDetail">
      <div className="panel__head bookDetail__head">
        <div className="bookDetail__headLeft">
          <span className="bookDetail__icon" aria-hidden="true">
            <i className="fa-solid fa-book-open-reader"></i>
          </span>
          <div>
            <span className="bookDetail__headTitle">{t("detail.headTitle")}</span>
          </div>
        </div>

        <span className="bookDetail__stock badge bg-success-subtle text-success-emphasis border border-success-subtle">
          {statusText}
        </span>
      </div>

      <div className="panel__body bookDetail__body">
        <div className="row g-3 g-lg-4 align-items-start">
          <div className="col-12 col-md-5 col-lg-4">
            <div className="bookDetail__coverWrap">
              <img
                className="bookDetail__cover"
                src={book.cover}
                width="520"
                height="760"
                alt={book.coverAlt || `${t("detail.coverFallback")} ${book.title}`}
                loading="lazy"
                decoding="async"
              />
              <div className="bookDetail__coverGlow" aria-hidden="true"></div>
            </div>

            <div className="bookDetail__quickMeta mt-3">
              <div className="bookDetail__chip">
                <i className="fa-solid fa-tags" aria-hidden="true"></i>
                <span>{genreText}</span>
              </div>
              <div className="bookDetail__chip">
                <i className="fa-solid fa-star" aria-hidden="true"></i>
                <span>{book.rating}</span>
              </div>
              <div className="bookDetail__chip bookDetail__chip--price">
                <i className="fa-solid fa-dollar-sign" aria-hidden="true"></i>
                <span>{formatCurrency(book.price, lang)}</span>
              </div>
            </div>
          </div>

          <div className="col-12 col-md-7 col-lg-8">
            <h2 className="bookDetail__title">{book.title}</h2>

            <p className="bookDetail__author mb-2">
              <i className="fa-regular fa-user" aria-hidden="true"></i>
              <span>{book.author}</span>
            </p>

            <div className="bookDetail__stats">
              <div className="bookDetail__stat">
                <span className="bookDetail__statLabel">{t("detail.labels.genre")}</span>
                <span className="bookDetail__statValue">{genreText}</span>
              </div>

              <div className="bookDetail__stat">
                <span className="bookDetail__statLabel">{t("detail.labels.year")}</span>
                <span className="bookDetail__statValue">{book.year}</span>
              </div>

              <div className="bookDetail__stat">
                <span className="bookDetail__statLabel">{t("detail.labels.rating")}</span>
                <span className="bookDetail__statValue">
                  <i className="fa-solid fa-star" aria-hidden="true"></i> {book.rating}
                </span>
              </div>

              <div className="bookDetail__stat">
                <span className="bookDetail__statLabel">{t("detail.labels.status")}</span>
                <span className="bookDetail__statValue">
                  <span className="badge bg-success-subtle text-success-emphasis border border-success-subtle">
                    {statusText}
                  </span>
                </span>
              </div>
            </div>

            <hr className="bookDetail__divider" />

            <h3 className="bookDetail__sectionTitle">{t("detail.summaryTitle")}</h3>
            <p className="bookDetail__summary">{summary}</p>

            <div className="bookDetail__buyBox mt-3" aria-label={t("detail.buyBoxAria")}>
              <div className="bookDetail__buyLeft">
                <div className="bookDetail__price">{formatCurrency(book.price, lang)}</div>
                <div className="bookDetail__priceHint">{t("detail.priceHint")}</div>
              </div>

              <div className="bookDetail__buyRight">
                <div className="qty" role="group" aria-label={t("detail.qty.groupAria")}>
                    <button
                    className="qty__btn"
                    type="button"
                    onClick={qty.minus}
                    aria-label={t("detail.qty.decrease")}
                  >
                    <i className="fa-solid fa-minus" aria-hidden="true"></i>
                  </button>

                  <input
                    className="qty__input"
                    id="qty"
                    name="qty"
                    type="text"
                    inputMode="numeric"
                    value={qty.value}
                    onChange={qty.onChange}
                    onBlur={qty.onBlur}
                    aria-label={t("detail.qty.inputAria")}
                    autoComplete="off"
                  />

                  <button
                    className="qty__btn"
                    type="button"
                    onClick={qty.plus}
                    aria-label={t("detail.qty.increase")}
                  >
                    <i className="fa-solid fa-plus" aria-hidden="true"></i>
                  </button>
                </div>

                  <button
                  className="btn bookDetail__addBtn"
                  type="button"
                  aria-label={t("detail.addToCart")}
                  onClick={handleAddToCart}
                  disabled={!book.inStock || book.statusI18n?.es === "Agotado"}
                >
                  <i className="fa-solid fa-cart-plus" aria-hidden="true"></i>
                  {t("detail.addToCart")}
                </button>

              </div>
            </div>

            <div className="bookDetail__note mt-3" role="note">
              <i className="fa-solid fa-circle-info" aria-hidden="true"></i>
              <span>{t("detail.note")}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function formatCurrency(value, lang) {
  return new Intl.NumberFormat(lang === "en" ? "en-US" : "es-EC", {
    style: "currency",
    currency: "USD"
  }).format(Number(value) || 0);
}