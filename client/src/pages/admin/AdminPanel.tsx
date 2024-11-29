import { useState } from "react";

import ProductManagement from "../../components/admin/ProductManagement";
import OrderManagement from "../../components/admin/OrderManagement";

const AdminPanel: React.FC = () => {
  const [view, setView] = useState<"products" | "orders" | "">("");

  return (
    <div className="admin-panel">
      <div className="admin-title">
        <button onClick={() => setView("")}>Admin Panel</button>
      </div>
      <hr />
      {view === "" && (
        <div className="management-buttons">
          <button onClick={() => setView("products")}>Manage Products</button>
          <button onClick={() => setView("orders")}>Manage Orders</button>
        </div>
      )}
      {view === "products" && <ProductManagement />}
      {view === "orders" && <OrderManagement />}
    </div>
  );
};

export default AdminPanel;
