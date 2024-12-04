import { useEffect, useState } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import { Link } from "react-router-dom";

interface IProduct {
  _id: string; // Mongoose ID
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  imageUrls?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const ProductManagement = () => {
  const { user } = useAuthContext();
  const [products, setProducts] = useState<IProduct[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        setError("");

        const response = await fetch("http://localhost:8000/product/all");

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

    fetchProducts();
  }, []);

  if (isLoading) return <p>Loading products...</p>;

  if (products.length === 0 && !isLoading) return <p>No products found.</p>;

  return (
    <div className="products">
      <ul>
        {products?.map((product) => (
          <li key={product._id}>
            <Link to={`/product/${product._id}`}>
              <img src={product.imageUrls?.[0]} alt={`${product.name}`} />
              <div className="details">
                <p className="name">{product.name}</p>
                <p className="price">${product.price}</p>
              </div>
            </Link>
          </li>
        ))}
      </ul>

      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default ProductManagement;
