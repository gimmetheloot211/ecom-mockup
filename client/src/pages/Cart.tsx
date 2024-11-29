import { useEffect, useState } from "react";
import { useCartContext } from "../hooks/useCartContext";
import { useAuthContext } from "../hooks/useAuthContext";
import { Link } from "react-router-dom";

const Cart = () => {
  const { cart, fetchCart, updateCartItem, removeCartItem, clearCart } =
    useCartContext();
  const [error, setError] = useState<string>("");
  const { user } = useAuthContext();

  useEffect(() => {
    fetchCart().catch((err) => setError("Failed to fetch cart data"));
    setError("");
  }, []);

  const handleUpdateQuantity = (productID: string, change: number) => {
    const cartItem = cart?.items.find((item) => item.product === productID);

    if (change > 0 && cartItem?.quantity! + change > cartItem?.stock!) {
      setError(
        `Only ${cartItem?.stock} of ${cartItem?.productName} are in stock`
      );
      return;
    }
    updateCartItem(productID, change).catch(() =>
      setError("Failed to update cart item")
    );
    setError("");
  };

  const handleRemoveItem = (productID: string) => {
    removeCartItem(productID).catch(() =>
      setError("Failed to remove cart item")
    );
    setError("");
  };

  const handleClearCart = () => {
    clearCart().catch(() => setError("Failed to clear cart"));
    setError("");
  };

  const handleCheckout = async () => {
    if (!user) return;
    if (!cart) return;
    const cartJSON = JSON.stringify({ cartID: cart._id });
    try {
      const response = await fetch("http://localhost:8000/order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: cartJSON,
      });
      const json = await response.json();

      if (!response.ok) {
        setError(json.error);
        return;
      }
      clearCart().catch(() => setError("Failed to clear cart"));
      alert("Order placed successfully!");
      setError("");
    } catch (error) {
      setError("Failed to create order");
    }
  };
  if (!cart || cart.items.length === 0) {
    return <p>Your cart is empty.</p>;
  }

  return (
    <div className="cart-page">
      <h1>Your Cart</h1>
      <ul>
        {cart.items.map((item) => (
          <li key={item.product}>
            <Link to={`/product/${item.product}`}>
              <p>{item.productName}</p>
            </Link>
            <p>Price: ${item.priceTotal.toFixed(2)}</p>
            <div className="cart-actions">
              <button onClick={() => handleUpdateQuantity(item.product, 1)}>
                +
              </button>
              <span>{item.quantity}</span>
              <button onClick={() => handleUpdateQuantity(item.product, -1)}>
                -
              </button>
              <button onClick={() => handleRemoveItem(item.product)}>
                Remove
              </button>
            </div>
          </li>
        ))}
      </ul>
      <p>Total amount: ${cart.cartPriceTotal}</p>
      {error && <p className="error">{error}</p>}
      <div className="cart-footer">
        <button className="checkout-btn" onClick={handleCheckout}>
          Checkout
        </button>
        <button className="clear-cart-btn" onClick={handleClearCart}>
          Clear Cart
        </button>
      </div>
    </div>
  );
};

export default Cart;
