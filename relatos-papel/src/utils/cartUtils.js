export function getCart() {
    return JSON.parse(localStorage.getItem("cart")) || [];
}

export function saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
}

export function addToCart(book) {
    const cart = getCart();
    const existing = cart.find((it) => it.id === book.id);

    if (existing) {
        existing.qty += 1;
    } else {
        cart.push({ ...book, qty: 1 });
    }

    saveCart(cart);
    window.dispatchEvent(new Event("cartUpdated"));
}

export function saveTotals({ subtotal, discount, shipping, taxes, total }) {
    localStorage.setItem("checkoutTotals", JSON.stringify({ subtotal, discount, shipping, taxes, total }));
}

export function getTotals() {
    return JSON.parse(localStorage.getItem("checkoutTotals")) || {};
}
