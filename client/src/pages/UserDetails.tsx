import { useAuthContext } from "../hooks/useAuthContext";
import { useEffect, useState } from "react";
import { Link } from 'react-router-dom';

const UserDetails = () => {
  const { user } = useAuthContext();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [userDetails, setUserDetails] = useState<any>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [updatedDetails, setUpdatedDetails] = useState<any>(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("http://localhost:8000/auth/user", {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        });

        const json = await response.json();
        if (response.ok) {
          setUserDetails(json);
          setUpdatedDetails(json);
          console.log(json);
        } else {
          setError(json.error);
        }
      } catch {
        setError("Failed to fetch user details");
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchUserDetails();
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUpdatedDetails((prevDetails: any) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleSaveChanges = async () => {
    try {
      const response = await fetch("http://localhost:8000/auth/user", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
        body: JSON.stringify(updatedDetails),
      });

      const json = await response.json();
      if (response.ok) {
        setUserDetails(json);
        setIsEditing(false);
      } else {
        setError(json.error);
      }
    } catch {
      setError("Failed to update user details");
    }
  };

  if (isLoading) return <p>Loading...</p>;

  return (
    <div>
      <div>
        {userDetails ? (
          <div className="user-details">
            <h2>User Details</h2>
            <div className="user">
              <label>First Name:</label>
              {isEditing ? (
                <input
                  type="text"
                  name="firstName"
                  defaultValue={updatedDetails.firstName || ""}
                  onChange={handleInputChange}
                />
              ) : (
                <p>{userDetails.firstName}</p>
              )}

              <label>Last Name:</label>
              {isEditing ? (
                <input
                  type="text"
                  name="lastName"
                  defaultValue={updatedDetails.lastName || ""}
                  onChange={handleInputChange}
                />
              ) : (
                <p>{userDetails.lastName}</p>
              )}
            </div>

            <div className="address">
              <label>Street:</label>
              {isEditing ? (
                <input
                  type="text"
                  name="street"
                  defaultValue={updatedDetails.address?.street || ""}
                  onChange={handleInputChange}
                />
              ) : (
                <p>{userDetails.address?.street}</p>
              )}

              <label>City:</label>
              {isEditing ? (
                <input
                  type="text"
                  name="city"
                  defaultValue={updatedDetails.address?.city || ""}
                  onChange={handleInputChange}
                />
              ) : (
                <p>{userDetails.address?.city}</p>
              )}

              <label>Province:</label>
              {isEditing ? (
                <input
                  type="text"
                  name="province"
                  defaultValue={updatedDetails.address?.province || ""}
                  onChange={handleInputChange}
                />
              ) : (
                <p>{userDetails.address?.province}</p>
              )}

              <label>Zip Code:</label>
              {isEditing ? (
                <input
                  type="text"
                  name="zipCode"
                  defaultValue={updatedDetails.address?.zipCode || ""}
                  onChange={handleInputChange}
                />
              ) : (
                <p>{userDetails.address?.zipCode}</p>
              )}
            </div>

            {isEditing ? (
              <button onClick={handleSaveChanges}>Save Changes</button>
            ) : (
              <button onClick={() => setIsEditing(true)}>Edit Details</button>
            )}

            {error && <p className="error">{error}</p>}
          </div>
        ) : (
          <p>No user details found.</p>
        )}
      </div>
      <div className="order-history">
          <Link to="/user/orders">Order history</Link>
      </div>
    </div>
  );
};

export default UserDetails;
