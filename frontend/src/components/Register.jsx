import { useState } from "react";
import Input from "./Input";
import Button from "./Button";
import Card from "./Card";

function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    setLoading(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/users",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username,
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || "Registration failed"
        );
      }

      setMessage("Registration successful. You can now log in.");

      setUsername("");
      setEmail("");
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
      <h2>Create Account</h2>

      <form
        onSubmit={handleSubmit}
        className="auth-form"
      >
        <Input
          label="Username"
          value={username}
          onChange={(event) =>
            setUsername(event.target.value)
          }
          placeholder="Choose a username"
          required
        />

        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(event) =>
            setEmail(event.target.value)
          }
          placeholder="Enter your email"
          required
        />

        <Input
          label="Password"
          type="password"
          value={password}
          onChange={(event) =>
            setPassword(event.target.value)
          }
          placeholder="Choose a password"
          required
        />

        {error && (
          <p className="error-message">
            {error}
          </p>
        )}

        {message && (
          <p className="success-message">
            {message}
          </p>
        )}

        <Button
          type="submit"
          disabled={loading}
        >
          {loading
            ? "Creating Account..."
            : "Register"}
        </Button>
      </form>
    </Card>
  );
}

export default Register;