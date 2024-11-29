import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuthContext } from "../../hooks/useAuthContext";

interface OrderItem {
  productName: string;
  quantity: number;
  priceTotal: number;
}

const OrderDetails = () => {
  const { user } = useAuthContext();
  const { orderID } = useParams<{ orderID: string }>();
  const [order, setOrder] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [customerDetails, setCustomerDetails] = useState<any>(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!orderID || !user) return;

      setIsLoading(true);

      try {
        const response = await fetch(
          `http://localhost:8000/order/admin/id/${orderID}`,
          {
            headers: { Authorization: `Bearer ${user.token}` },
          }
        );

        const json = await response.json();

        if (response.ok) {
          setOrder(json);
          console.log(order);
        } else {
          setIsLoading(false);
          setError(json.error);
        }
      } catch (error) {
        setIsLoading(false);
        setError("Failed to fetch order details");
      }
    };

    fetchOrderDetails();
  }, [orderID, user]);

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (!user || !order) return;

      try {
        const response = await fetch(
          `http://localhost:8000/auth/user/${order.user}`,
          {
            headers: { Authorization: `Bearer ${user.token}` },
          }
        );

        const json = await response.json();

        if (response.ok) {
          setCustomerDetails(json);
          console.log(customerDetails);
        } else {
          setError(json.error);
        }
      } catch (error) {
        setError("Failed to fetch customer details");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserDetails();
  }, [order, user]);
  if (isLoading) return <p>Loading order details...</p>;
  if (error) return <p className="error">{error}</p>;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); 

    if (!orderID || !user) return;

    const status = (e.target as HTMLFormElement).status.value;

    try {
      const response = await fetch(
        `http://localhost:8000/order/admin/id/${orderID}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify({ status }),
        }
      );

      const json = await response.json();

      if (response.ok) {
        setOrder({ ...order, status });
        alert("Order status updated successfully!");
      } else {
        setError(json.error);
      }
    } catch (error) {
      setError("Failed to update order status");
    }
  };

  return (
    <div className="order-details">
      {order && (
        <>
          <h3>Order #{order._id}</h3>
          <p>
            <strong>Status:</strong> {order.status}
          </p>
          <p>
            <strong>Total Price:</strong> ${order.totalAmount}
          </p>
          <h4>Items in Order:</h4>
          <ul>
            {order.items.map((item: OrderItem) => (
              <li key={item.productName}>
                {item.productName} - {item.quantity} - ${item.priceTotal}$
              </li>
            ))}
          </ul>
          <h4>User Information:</h4>
          <p>
            <strong>Username:</strong> {customerDetails.username}
          </p>
          <p>
            <strong>Address:</strong>
            <br />
            {customerDetails.address.street}
            <br />
            {customerDetails.address.city}, {customerDetails.address.province}
            <br />
            {customerDetails.address.zipCode}
          </p>

          <form onSubmit={handleSubmit}>
            <label>Set the order status:</label>
            <select name="status" id="status">
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="canceled">Canceled</option>
            </select>
            <br />
            <input type="submit" value="Submit" />
          </form>
        </>
      )}
    </div>
  );
};

export default OrderDetails;
