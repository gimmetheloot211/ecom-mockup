import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCartShopping,
  faUserCircle,
} from "@fortawesome/free-solid-svg-icons";

import { useAuthContext } from "../hooks/useAuthContext";
import { useCartContext } from "../hooks/useCartContext";
import { useLogout } from "../hooks/useLogout";

const Navbar: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const { logout } = useLogout();
  const { user } = useAuthContext();
  const { cart } = useCartContext();

  const handleToggle = () => {
    setIsActive(!isActive);
  };

  return (
    <nav className={`navbar ${isActive ? "active" : ""}`}>
      {/* Top Section */}
      <div className="navbar-top">
        <Link to="/" className="navbar-brand">
          ZestyFruits
        </Link>
        <div className="navbar-icons">
          {user && (
            <div className="cart-user-wrapper">
              <div className="cart-price">
                <p>${cart?.cartPriceTotal || 0}</p>
              </div>
              <Link to="/cart" className="cart-icon">
                <FontAwesomeIcon icon={faCartShopping} />
              </Link>
              <Link to="/user/details" className="user-icon">
                <FontAwesomeIcon icon={faUserCircle} />
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Section */}
      <div className={`navbar-bottom ${isActive ? "show" : ""}`}>
        <Link to="/">Home</Link>
        <Link to="/products">Products</Link>
        <Link to="/about">About</Link>
        <Link to="/contact">Contact</Link>
        {user?.admin && <Link to="/admin">Admin</Link>}
        {!user && (
          <div className="auth-links">
            <Link to="/login">Login</Link>
            <Link to="/signup">Signup</Link>
          </div>
        )}
        {user && (
          <div className="logout">
            <button onClick={() => logout()}>Logout</button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
