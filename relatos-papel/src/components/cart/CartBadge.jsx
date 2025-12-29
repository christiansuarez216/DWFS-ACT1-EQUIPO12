import { useEffect, useState } from "react";
import { getCart } from "../../utils/cartUtils.js";

export default function CartBadge() {
    const [count, setCount] = useState(0);

    useEffect(() => {
        const update = () => {
            const cart = getCart();
            const totalQty = cart.reduce((sum, it) => sum + it.qty, 0);
            setCount(totalQty);
        };

        update();
        window.addEventListener("cartUpdated", update);
        return () => window.removeEventListener("cartUpdated", update);
    }, []);

    return (
        <span className="cartBadge">
      <i className="fa-solid fa-cart-shopping"></i>
            {count > 0 && <span className="cartBadge__count">{count}</span>}
    </span>
    );
}
