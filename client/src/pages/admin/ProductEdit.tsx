import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuthContext } from "../../hooks/useAuthContext";

const ProductEdit = () => {
  const { productID } = useParams<{ productID: string }>();
  const { user } = useAuthContext();
  const [product, setProduct] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [stock, setStock] = useState<number>();
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [updatedDetails, setUpdatedDetails] = useState<any>(null);

  useEffect(() => {
    const fetchProductDetails = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `http://localhost:8000/product/id/${productID}`,
          {
            headers: {
              Authorization: `Bearer ${user?.token}`,
            },
          }
        );
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError("");
    const { name, value } = e.target;
    setUpdatedDetails((prevDetails: any) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleSaveChanges = async () => {
    if (!updatedDetails) {
      setIsEditing(false);
      return;
    }
    try {
      const response = await fetch(
        `http://localhost:8000/product/update/${product._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user?.token}`,
          },
          body: JSON.stringify(updatedDetails),
        }
      );

      const json = await response.json();
      if (response.ok) {
        setProduct(json);
        setIsEditing(false);
        setUpdatedDetails(null);
      } else {
        setError(json.error);
      }
    } catch {
      setError("Failed to update product details");
    }
  };

  if (isLoading) return <p>Loading...</p>;

  if (!product) return <p>No product details found.</p>;

  return (
    <div className="product-edit">
      <img src={product.imageUrls?.[0]} alt={product.name} />
      <div className="details">
        <label>Name: </label>
        {isEditing ? (
          <input
            type="text"
            name="name"
            defaultValue={product.name || ""}
            onChange={handleInputChange}
          />
        ) : (
          <p>{product.name}</p>
        )}
        <label>Category: </label>
        {isEditing ? (
          <input
            type="text"
            name="category"
            defaultValue={product.category || ""}
            onChange={handleInputChange}
          />
        ) : (
          <p>{product.category}</p>
        )}
        <label>Description: </label>
        {isEditing ? (
          <input
            type="text"
            name="description"
            defaultValue={product.description || ""}
            onChange={handleInputChange}
          />
        ) : (
          <p>{product.description}</p>
        )}
        <label>Stock: </label>
        {isEditing ? (
          <input
            type="number"
            name="stock"
            defaultValue={product.stock || ""}
            onChange={handleInputChange}
          />
        ) : (
          <p>{product.stock}</p>
        )}
        <label>Price: </label>
        {isEditing ? (
          <input
            type="number"
            name="price"
            defaultValue={product.price || ""}
            onChange={handleInputChange}
          />
        ) : (
          <p>${product.price}</p>
        )}
        <div className="edit-save-btns">
          {isEditing ? (
            <button onClick={handleSaveChanges} className="save-btn">
              Save Changes
            </button>
          ) : (
            <button onClick={() => setIsEditing(true)} className="edit-btn">
              Edit Details
            </button>
          )}
        </div>
      </div>
      <p className="error">{error}</p>
    </div>
  );
};

export default ProductEdit;
