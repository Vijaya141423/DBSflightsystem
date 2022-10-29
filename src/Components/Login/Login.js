import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function validateForm() {
    return email.length > 0 && password.length > 0;
  }

  function handleSubmit(event) {
    event.preventDefault();
    console.log(email, password);
  }

  return (
    <div className="Login container mt-5 mb-5">
      <h1 className="text-center text-secondary">Log In</h1>
      <div className="row">
        <div className="col-md-6 mx-auto">
          <Form onSubmit={handleSubmit}>
            <Form.Group size="sm" controlId="email">
              <Form.Label>Email</Form.Label>

              <Form.Control
                autoFocus
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>

            <Form.Group size="sm" controlId="password">
              <Form.Label>Password</Form.Label>

              <Form.Control
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>
            <br></br>
            <Button
              type="submit"
              className="btn-success m-auto d-block"
              disabled={!validateForm()}
            >
              Login
            </Button>
          </Form>
        </div>
      </div>
    </div>
  );
}
