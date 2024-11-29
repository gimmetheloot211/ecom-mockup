import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import { useCartContext } from "../hooks/useCartContext";

const ProductDetails = () => {
  const { productID } = useParams<{ productID: string }>();
  const { user } = useAuthContext();
  const { cart, updateCartItem } = useCartContext();
  const [product, setProduct] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(0);
  const [stock, setStock] = useState<number>();

  useEffect(() => {
    const fetchProductDetails = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`http://localhost:8000/product/id/${productID}`, {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        });
        const json = await response.json();
        if (response.ok) {
          setProduct(json);
          setStock(json.stock);
        } else {
          setError(json.error);
        }
      } catch (error) {
        setError("Failed to fetch product details");
      } finally {
        setIsLoading(false);
      }
    };

    if (productID) {
      fetchProductDetails();
    }
  }, [productID, user?.token]);

  const handleQuantityChange = (change: number) => {
    const cartItem = cart?.items.find((item) => item.product === product._id);
    const cartItemQuantity = cartItem?.quantity || 0;

    setQuantity((prevQuantity) => {
      const newQuantity = prevQuantity + change;
      if (newQuantity + cartItemQuantity > product.stock) return prevQuantity;
      if (prevQuantity <= 0 && change <= 0) return 0;

      if (newQuantity > product.stock) {
        return prevQuantity;
      } else if (newQuantity >= 0) {
        return newQuantity;
      } else {
        return 1;
      }
    });
  };

  const handleAddToCart = async () => {
    const cartItem = cart?.items.find((item) => item.product === product._id);
    const cartItemQuantity = cartItem?.quantity || 0;
    if (cartItemQuantity + quantity > product.stock) {
      setError("Item out of stock");
      return;
    }
    if (product && user) {
      try {
        await updateCartItem(product._id, quantity);
        setQuantity(0);
      } catch (err) {
        setError("Failed to add item to the cart");
      }
    } else {
      setError("You must be logged in to add items to the cart");
    }
    setError("");
  };

  if (isLoading) return <p>Loading...</p>;

  if (!product) return <p>No product details found.</p>;

  return (
    <div className="product-details">
      <img src={product.imageUrls?.[0]} alt={product.name} />
      <div className="details">
        <h1>{product.name}</h1>
        <p>{product.description}</p>
        <p>Stock: {stock}</p>
        <p>Price: ${product.price}</p>

        {user ? (
          <div>
            <div className="quantity-selector">
              <button
                onClick={() => handleQuantityChange(-1)}
                className="quantity-btn"
              >
                -
              </button>
              <span className="quantity-count">{quantity}</span>
              <button
                onClick={() => handleQuantityChange(1)}
                className="quantity-btn"
              >
                +
              </button>
            </div>
            <button
              disabled={quantity <= 0 || product.stock <= 0}
              onClick={handleAddToCart}
              className="add-to-cart-btn"
            >
              Add To Cart
            </button>
          </div>
        ) : (
          <p>You must be logged in to order</p>
        )}
      </div>
      <p className="error">{error}</p>
    </div>
  );
};

export default ProductDetails;
