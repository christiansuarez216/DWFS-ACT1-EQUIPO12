import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getCart, saveCart, saveTotals } from "../../utils/cartUtils";

import Head from "../../components/utils/HeadLanding";
import CartHeader from "../../components/cart/CartHeader";
import CartList from "../../components/cart/CartList";
import CheckoutPanel from "../../components/cart/CheckoutPanel";
import HelpPanel from "../../components/cart/HelpPanel";
import { APP_ORIGIN } from "../../constants/env";

import "../../assets/css/styles-cart-books.css";

export default function CartPage() {
  const { lang } = useParams();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation("cart");

  const [items, setItems] = useState(() => getCart());
  const [loading, setLoading] = useState(true);

  const [coupon, setCoupon] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  useEffect(() => {
    i18n.changeLanguage(lang || "es");
  }, [lang, i18n]);

  /*useEffect(() => {
    let alive = true;

    (async () => {
      try {
        setLoading(true);
        const res = await fetch("/data/cart-items.json");
        const data = await res.json();
        if (alive) setItems(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error("Error cargando cart-items.json:", e);
        if (alive) setItems([]);
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, []);*/

  useEffect(() => {
    setItems(getCart());
    setLoading(false);
  }, []);


  const updateQty = (id, nextQty) => {
    const updated = items.map((it) => it.id === id ? { ...it,
      qty: clampInt(nextQty, 1, 99) } : it );
    setItems(updated); saveCart(updated);
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const removeItem = (id) => {
    const updated = items.filter((it) => it.id !== id);
    setItems(updated);
    saveCart(updated);
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const subtotal = useMemo(() => {
    return items.reduce( (acc, it) => acc + Number(it.price || 0) * Number(it.qty || 1), 0 );
    },
      [items]);

  const discount = useMemo(() => {
    if (!appliedCoupon)
      return 0;
    return subtotal * appliedCoupon.rate;
  },
      [subtotal, appliedCoupon]);

  const total = useMemo(() => Math.max(0, subtotal - discount),
      [subtotal, discount]);

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    const code = coupon.trim().toUpperCase();
    if (code === "PROMO10")
    { setAppliedCoupon(
        { code, rate: 0.1 });
    } else if (code === "SAVE20") {
      setAppliedCoupon({ code, rate: 0.2 });
    } else {
      setAppliedCoupon(null);
    }
    const shipping = 2.5;
    const taxes = subtotal * 0.12;
    const finalDiscount = code === "PROMO10" ? subtotal * 0.1 : discount;
    const finalTotal = subtotal - finalDiscount + shipping + taxes;
    saveTotals({
      subtotal, discount: finalDiscount, shipping, taxes, total: finalTotal
    });
  };
  const clearCoupon = () => {
    setAppliedCoupon(null);
    setCoupon("");
  };

  const canonical = `${APP_ORIGIN}/${lang}/cart`;
  return (
      <div className="cartPage cart--full bg-white">
        <Head lang={lang} title={t("seo.title")}
              description={t("seo.description")}
              keywords={t("seo.keywords")}
              canonical={canonical}
              ogImage="/assets/img/og-cart.jpg"
              siteName="Librería dígital"
              locale={lang === "es" ? "es_EC" : "en_US"} />

        <CartHeader lang={lang} onGoLang={(next) =>
            navigate(`/${next}/cart`)} />

        <main className="cart__content">
          <div className="container-fluid px-0 px-lg-3"> {loading ? (
              <div className="panel panel--elevated">
                <div className="panel__body">
                  {lang === "en" ? "Loading…" : "Cargando…"}
                </div> </div> ) : items.length === 0 ? (
                    <div className="panel panel--elevated">
                      <div className="panel__body">
                        <h2 className="mb-1">
                          {t("empty.title")}
                        </h2>
                        <p className="mb-3">{
                          t("empty.subtitle")}
                        </p>
                        <button className="btn help__btn help__btn--primary" type="button" onClick={() =>
                            navigate(`/${lang}/catalog`)} >
                          <i className="fa-solid fa-book" aria-hidden="true"></i>
                          {t("help.continue")}
                        </button>
                      </div>
                    </div> ) :
              ( <div className="row g-3 align-items-start">
                <section className="col-12 col-lg-8" aria-label={t(
                    "list.title")}>
                  <CartList lang={lang} items={items}
                            onQty={updateQty}
                            onRemove={removeItem} />
                </section> <aside className="col-12 col-lg-4">
                <CheckoutPanel
                    lang={lang}
                    coupon={coupon}
                    setCoupon={setCoupon}
                    appliedCoupon={appliedCoupon}
                    onApplyCoupon={handleApplyCoupon}
                    onClearCoupon={clearCoupon}
                    subtotal={subtotal}
                    discount={discount}
                    total={total} />
                <div className="mt-3" />
                <HelpPanel lang={lang} />
              </aside>
              </div> )}
          </div>
        </main>
      </div> );
}

function clampInt(v, min, max) {
  const n = Number.parseInt(v, 10);
  if (Number.isNaN(n))
    return min;
  return Math.min(max, Math.max(min, n));
}