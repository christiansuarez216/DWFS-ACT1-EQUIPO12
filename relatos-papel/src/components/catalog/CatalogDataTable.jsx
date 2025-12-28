import { useEffect, useRef } from "react";
import $ from "jquery";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { addToCart } from "../../utils/cartUtils";

import "datatables.net";
import "datatables.net-bs5";

export default function CatalogDataTable({ lang, rows, onReady }) {
    const { t } = useTranslation("catalog");

    const tableRef = useRef(null);
    const dtRef = useRef(null);
    const prevLangRef = useRef(lang);
    const navigate = useNavigate();
    const clickBoundRef = useRef(false);

    const dtLangUrl =
        lang === "en"
            ? "https://cdn.datatables.net/plug-ins/1.13.8/i18n/en-GB.json"
            : "https://cdn.datatables.net/plug-ins/1.13.8/i18n/es-ES.json";

    useEffect(() => {
        if (!tableRef.current) return;

        const langChanged = prevLangRef.current !== lang;

        if (dtRef.current && langChanged) {
            dtRef.current.destroy(false);
            dtRef.current = null;
        }

        if (dtRef.current && !langChanged) {
            dtRef.current.clear();
            dtRef.current.rows.add(rows);
            dtRef.current.draw();
            return;
        }

        const columns = [
            {
                data: "cover",
                orderable: false,
                searchable: false,
                render: {
                    display: (cover, type, row) => `
        <img class="bookCover"
             src="${cover}"
             width="96" height="136"
             alt="${t("table.coverAltPrefix")} ${row.title}"
             loading="lazy" decoding="async" />
      `
                }
            },
            {
                data: null,
                render: {
                    display: (_, __, row) => `
        <strong class="booksTable__title">${row.title}</strong>
        <div class="booksTable__desc">${row.desc || ""}</div>
      `,
                    filter: (_, __, row) =>
                        `${row.title} ${row.desc || ""}`.toLowerCase(),
                    sort: (_, __, row) => row.title
                }
            },
            {
                data: "author",
                className: "booksTable__muted"
            },
            {
                data: "genreI18n",
                render: {
                    display: (g) =>
                        `<span class="booksTable__pill">${g[lang]}</span>`,

                    filter: (g) => g[lang],

                    sort: (g) => g[lang]
                }
            },
            {
                data: "rating",
                className: "booksTable__rating",
                render: {
                    display: (r) =>
                        `<i class="fa-solid fa-star" aria-hidden="true"></i> ${r}`,
                    filter: (r) => r
                }
            },
            {
                data: "price",
                className: "booksTable__price",
                render: {
                    display: (p) => formatCurrency(p, lang),
                    filter: (p) => p
                }
            },
            {
                data: "statusI18n",
                render: {
                    display: (s) =>
                        `<span class="badge bg-success-subtle text-success-emphasis border border-success-subtle">
                        ${s[lang]}
                    </span>`,

                    filter: (s) => s[lang],

                    sort: (s) => s[lang]
                }
            },
            {
                data: null,
                orderable: false,
                searchable: false,
                className: "text-end",
                render: {
                    display: (_, __, row) => `
                    <button class="iconBtn" data-action="view" data-href="${row.href}"
                        aria-label="${t("table.actions.details")}">
                        <i class="fa-regular fa-eye"></i>
                    </button>
                    <button class="iconBtn iconBtn--primary" data-action="add" data-id="${row.id}"
                        aria-label="${t("table.actions.add")}">
                        <i class="fa-solid fa-cart-plus"></i>
                    </button>
      `
                }
            }
        ];

        const dt = $(tableRef.current).DataTable({
            data: rows,
            columns,
            pageLength: 6,
            lengthChange: false,
            pagingType: "simple_numbers",
            autoWidth: false,
            language: { url: dtLangUrl },
            dom: "rt<'d-flex justify-content-between align-items-center mt-3'p>"
        });

        dtRef.current = dt;
        prevLangRef.current = lang;

        if (onReady) onReady(dt);
    }, [rows, lang, dtLangUrl, t, onReady]);

    useEffect(() => {
        if (!tableRef.current || clickBoundRef.current)
            return;
        const tableEl = tableRef.current;
        const handleClick = (e) => {
            const viewBtn = e.target.closest("button[data-action='view']");
            const addBtn = e.target.closest("button[data-action='add']");
            if (viewBtn) {
                const slug = viewBtn.getAttribute("data-href");
                if (slug) { navigate(`/${lang}/catalog/book/${slug}`); } return;
            }
            if (addBtn) {
                const id = addBtn.getAttribute("data-id");
                const book = rows.find((b) => b.id === id);
                if (book) {
                    addToCart(book);
                    navigate(`/${lang}/cart`);
                } return;
            }
        };
        tableEl.addEventListener("click", handleClick);
        clickBoundRef.current = true;
        return () => {
            tableEl.removeEventListener("click", handleClick);
            clickBoundRef.current = false;
            };
        }, [lang, navigate, rows]);

    return (
        <table
            ref={tableRef}
            id="booksTable"
            className="table table-borderless align-middle w-100 booksTable"
            aria-label={t("table.aria")}
        >
            <thead className="booksTable__head">
                <tr>
                    <th className="booksTable__th">{t("table.th.cover")}</th>
                    <th className="booksTable__th">{t("table.th.title")}</th>
                    <th className="booksTable__th">{t("table.th.author")}</th>
                    <th className="booksTable__th">{t("table.th.genre")}</th>
                    <th className="booksTable__th">{t("table.th.rating")}</th>
                    <th className="booksTable__th">{t("table.th.price")}</th>
                    <th className="booksTable__th">{t("table.th.status")}</th>
                    <th className="booksTable__th text-end">{t("table.th.actions")}</th>
                </tr>
            </thead>
            <tbody />
        </table>
    );
}

function formatCurrency(value, lang) {
    return new Intl.NumberFormat(lang === "en" ? "en-US" : "es-EC", {
        style: "currency",
        currency: "USD"
    }).format(Number(value) || 0);
}