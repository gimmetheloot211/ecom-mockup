import { useEffect, useState } from "react";
import { useAuthContext } from "../../hooks/useAuthContext";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

const ProductManagement = () => {
  const { user } = useAuthContext();
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("http://localhost:8000/product/all", {
          headers: { Authorization: `Bearer ${user?.token}` },
        });

        const json = await response.json();
        if (response.ok) {
          setProducts(json);
        } else {
          setError(json.error);
        }
      } catch (error) {
        setError("Failed to fetch product data");
      } finally {
        setIsLoading(false);
      }
    };
    if (user) {
      fetchProducts();
    }
  }, [user]);
  return (
    <div>
      <div className="products-admin">
        <ul>
          {products?.map((product) => (
            <Link to={`/admin/product/${product._id}`}>
              <li key={product._id}>
                <img src={product.imageUrls?.[0]} alt={`${product.name}`} />
                <div className="details">
                  <p className="name">{product.name}</p>
                  <p className="price">${product.price}</p>
                </div>
              </li>
            </Link>
          ))}
          <div></div>
        </ul>
        <div className="product-add">
          <Link to="/admin/product/create">
          <FontAwesomeIcon icon={faPlus}></FontAwesomeIcon>
          </Link>
        </div>
      </div>
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default ProductManagement;
