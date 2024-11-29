import { useState } from "react";
import { useLogin } from "../hooks/useLogin";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login, error, isLoading } = useLogin();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await login(username, password);
  };

  return (
    <div className="login-page">
      <form className="login-form" onSubmit={handleSubmit}>
        <h3 className="login-title">Login</h3>

        <label className="login-label">Username:</label>
        <input
          type="text"
          className="login-input"
          placeholder="Enter your username"
          onChange={(e) => setUsername(e.target.value)}
          value={username}
        />
        <label className="login-label">Password:</label>
        <input
          type="password"
          className="login-input"
          placeholder="Enter your password"
          onChange={(e) => setPassword(e.target.value)}
          value={password}
        />

        <button className="login-button" disabled={isLoading}>
          {isLoading ? "Logging in..." : "Log in"}
        </button>
        {error && <div className="login-error">{error}</div>}
      </form>
    </div>
  );
};

export default Login;
