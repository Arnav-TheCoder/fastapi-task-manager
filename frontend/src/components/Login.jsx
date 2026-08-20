import { useState } from "react";
import Input from "./Input";
import Button from "./Button";
import Card from "./Card";

function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    setLoading(true);
    setError("");

    try {
      const formData = new URLSearchParams();

      formData.append("username", username);
      formData.append("password", password);

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/login`,
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/x-www-form-urlencoded",
          },
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || "Login failed"
        );
      }

      onLogin(data.access_token, username);

      setUsername("");
      setPassword("");
    } catch (error) {
      console.error(error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="auth-card">
      <h2>Login</h2>

      <form onSubmit={handleSubmit} className="auth-form">
        <Input
          label="Username"
          value={username}
          onChange={(event) =>
            setUsername(event.target.value)
          }
          placeholder="Enter username"
          required
        />

        <Input
          label="Password"
          type="password"
          value={password}
          onChange={(event) =>
            setPassword(event.target.value)
          }
          placeholder="Enter password"
          required
        />

        {error && (
          <p className="error-message">
            {error}
          </p>
        )}

        <Button
          type="submit"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </Button>
      </form>
    </Card>
  );
}

export default Login;