import { createContext, useState, useEffect, ReactNode } from "react";
import { useAuthContext } from "../hooks/useAuthContext";

export interface ICartItem {
  product: string;
  productName: string;
  quantity: number;
  priceTotal: number;
  stock: number;
}

export interface ICart {
  _id: string;
  items: ICartItem[];
  cartPriceTotal: number;
}

interface CartContextProps {
  cart: ICart | null;
  isLoading: boolean;
  error: string;
  fetchCart: () => Promise<void>;
  clearCart: () => Promise<void>;
  updateCartItem: (productID: string, quantity: number) => Promise<void>;
  removeCartItem: (productID: string) => Promise<void>;
}

export const CartContext = createContext<CartContextProps | undefined>(
  undefined
);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuthContext();
  const [cart, setCart] = useState<ICart | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  // Fetch the cart
  const fetchCart = async () => {
    if (!user) return;
    try {
      setIsLoading(true);
      const response = await fetch("http://localhost:8000/order/cart", {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      const json = await response.json();
      if (response.ok) {
        setCart(json);
      } else {
        setError(json.error || "Failed to fetch cart");
      }
    } catch (err) {
      setError("Failed to fetch cart");
    } finally {
      setIsLoading(false);
    }
  };

  // Clear the cart
  const clearCart = async () => {
    if (!user) return;
    try {
      setIsLoading(true);
      const response = await fetch("http://localhost:8000/order/cart/clear", {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      const json = await response.json();
      if (response.ok) {
        setCart(json);
      } else {
        setError(json.error || "Failed to clear cart");
      }
    } catch (err) {
      setError("Failed to clear cart");
    } finally {
      setIsLoading(false);
    }
  };

  // Update a cart item
  const updateCartItem = async (productID: string, quantity: number) => {
    if (!user) return;
    try {
      setIsLoading(true);
      const response = await fetch(
        "http://localhost:8000/order/cart/item/update",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify({ productID, quantity }),
        }
      );
      const json = await response.json();
      if (response.ok) {
        setCart(json);
      } else {
        setError(json.error || "Failed to update cart item");
      }
    } catch (err) {
      setError("Failed to update cart item");
    } finally {
      setIsLoading(false);
    }
  };

  // Remove a cart item
  const removeCartItem = async (productID: string) => {
    if (!user) return;
    try {
      setIsLoading(true);
      const response = await fetch(
        "http://localhost:8000/order/cart/item/remove",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify({ productID }),
        }
      );
      const json = await response.json();
      if (response.ok) {
        setCart(json);
      } else {
        setError(json.error || "Failed to remove cart item");
      }
    } catch (err) {
      setError("Failed to remove cart item");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchCart();
    }
  }, [user]);

  return (
    <CartContext.Provider
      value={{
        cart,
        isLoading,
        error,
        fetchCart,
        clearCart,
        updateCartItem,
        removeCartItem,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
