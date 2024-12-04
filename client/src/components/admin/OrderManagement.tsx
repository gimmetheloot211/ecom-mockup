import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { useAuthContext } from "../../hooks/useAuthContext";

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
  status: "pending" | "confirmed" | "shipped" | "delivered" | "canceled";
  createdAt: Date;
  updatedAt: Date;
}

const OrderManagement = () => {
  const { user } = useAuthContext();
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setIsLoading(true);
        setError("");

        const response = await fetch("http://localhost:8000/order/admin/all", {
          headers: { Authorization: `Bearer ${user?.token}` },
        });

        const json = await response.json();
        if (response.ok) {
          setOrders(json);
        } else {
          setError(json.error);
        }
      } catch (error) {
        setError("Failed to fetch order data");
      } finally {
        setIsLoading(false);
      }
    };
    if (user) {
      fetchOrders();
    }
  }, [user]);

  const handleDelete = async (orderID: string) => {
    if (!orderID) return;

    try {
      setError("");

      const response = await fetch(
        `http://localhost:8000/order/admin/id/${orderID}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );

      const json = await response.json();

      if (response.ok) {
        setOrders((prevOrders) =>
          prevOrders.filter((order) => order._id !== orderID)
        );
      } else {
        setError(json.error || "Failed to delete the order");
      }
    } catch (error) {
      setError("An error occurred while trying to delete the order");
    }
  };

  return (
    <div>
      <ul className="orders-admin">
        {orders?.map((order) => (
          <li key={order._id}>
            <Link to={`order/${order._id}`}>
              <div className="order">
                <p>
                  Order/{order._id} - ${order.totalAmount} - {order.status}
                </p>
                <p>{format(order.createdAt, "yyyy/MM/dd - HH:mm")}</p>
              </div>
            </Link>
            <button
              className="delete-button"
              onClick={() => handleDelete(order._id)}
              aria-label={`Delete Order ${order._id}`}
            >
              <FontAwesomeIcon icon={faTrashCan} />
            </button>
          </li>
        ))}
      </ul>

      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default OrderManagement;
