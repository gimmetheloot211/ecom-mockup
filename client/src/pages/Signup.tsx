import { useState } from "react";
import { useSignup } from "../hooks/useSignup";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { signup, error, isLoading } = useSignup();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    await signup(username, password);
  };

  return (
    <div className="signup-page">
      <form className="signup-form" onSubmit={handleSubmit}>
        <h3 className="signup-title">Sign up</h3>

        <label className="signup-label">Username:</label>
        <input
          className="signup-input"
          type="text"
          placeholder="Enter your username"
          onChange={(e) => setUsername(e.target.value)}
          value={username}
        />
        <label className="signup-label">Password:</label>
        <input
          className="signup-input"
          type="password"
          placeholder="Enter your password"
          onChange={(e) => setPassword(e.target.value)}
          value={password}
        />

        <button className="signup-button" disabled={isLoading}>
          Sign up
        </button>
        {error && <div className="signup-error">{error}</div>}
        {isLoading && (
          <div className="userInitialization">
            Initializing user, this might take a few moments...
          </div>
        )}
      </form>
    </div>
  );
};

export default Signup;
