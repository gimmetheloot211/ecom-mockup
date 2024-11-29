import Home from "./pages/Home";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { useAuthContext } from "./hooks/useAuthContext";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import UserDetails from "./pages/UserDetails";

import AdminPanel from "./pages/admin/AdminPanel";
import OrderDetails from "./pages/admin/OrderDetails";
import ProductEdit from "./pages/admin/ProductEdit";
import UserOrders from "./pages/UserOrders";
import ProductAdd from "./pages/admin/ProductAdd";

function App() {
  const { user, isLoading } = useAuthContext();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="App">
      <Router>
        <Navbar />
        <div className="pages">
          <Routes>
            <Route path="/" element={<Home />}></Route>
            <Route path="/products" element={<Products />}></Route>
            <Route path="/product/:productID" element={<ProductDetails />} />

            <Route
              path="/user/details"
              element={user ? <UserDetails /> : <Navigate to="/login" />}
            ></Route>
            <Route
              path="/cart"
              element={user ? <Cart /> : <Navigate to="/login" />}
            ></Route>
            <Route
              path="/user/orders"
              element={user ? <UserOrders /> : <Navigate to="/login" />}
            ></Route>

            <Route
              path="/login"
              element={!user ? <Login /> : <Navigate to="/" />}
            ></Route>
            <Route
              path="/signup"
              element={!user ? <Signup /> : <Navigate to="/" />}
            ></Route>

            <Route
              path="/admin"
              element={
                !user || !user.admin ? <Navigate to="/" /> : <AdminPanel />
              }
            ></Route>
            <Route
              path="/admin/product/:productID"
              element={
                !user || !user.admin ? <Navigate to="/" /> : <ProductEdit />
              }
            ></Route>
            <Route
              path="/admin/product/create"
              element={
                !user || !user.admin ? <Navigate to="/" /> : <ProductAdd />
              }
            ></Route>
            <Route
              path="/admin/order/:orderID"
              element={
                !user || !user.admin ? <Navigate to="/" /> : <OrderDetails />
              }
            ></Route>
          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;
