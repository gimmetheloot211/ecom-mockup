import { useAuthContext } from "../hooks/useAuthContext";
import { useState, useEffect } from "react";
import { format } from "date-fns";

type OrderStatus =
  | "pending"
  | "shipped"
  | "confirmed"
  | "delivered"
  | "canceled";

interface IOrder {
  _id: string; // Mongoose ID
  user: string; // Mongoose ID
  items: {
    product: string; // Mongoose ID
    productName: string;
    quantity: number;
    priceTotal: number;
  }[];
  totalAmount: number;
  status: OrderStatus;
  createdAt: Date;
  updatedAt: Date;
}

const UserOrders = () => {
  const { user } = useAuthContext();
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setIsLoading(true);
        setError("");
        
        const response = await fetch("http://localhost:8000/order/", {
          headers: { Authorization: `Bearer ${user?.token}` },
        });

        const json = await response.json();
        if (response.ok) {
          setOrders(json);
        } else {
          setError(json.error);
        }
      } catch (error) {
        setError("Failed to fetch orders");
      } finally {
        setIsLoading(false);
      }
    };
    if (user) {
      fetchOrders();
    }
  }, [user]);

  if (isLoading) return <p className="loading">Loading...</p>;

  if (!orders || orders.length === 0)
    return <p className="no-orders">No orders found</p>;

  return (
    <div className="user-orders">
      {error && <p className="error">{error}</p>}
      <ul className="orders-list">
        {orders.map((order) => (
          <li key={order._id} className="order-item">
            <h2 className="order-id">Order ID: {order._id}</h2>
            <p className="order-total">
              Total: ${order.totalAmount.toFixed(2)}
            </p>
            <p className="order-status">Status: {order.status}</p>
            <p className="order-date">
              Ordered At: {format(order.createdAt, "yyyy/MM/dd - HH:mm")}
            </p>
            <ul className="order-items">
              {order.items.map((item) => (
                <li key={item.product} className="order-item-detail">
                  <p className="item-name">{item.productName}</p>
                  <p className="item-quantity">Quantity: {item.quantity}</p>
                  <p className="item-price">${item.priceTotal.toFixed(2)}</p>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserOrders;
