"use client";
import React from "react";
import { useAuth } from "./context";
import { Card } from "@mui/material";
import { useState } from "react";
import { registerUser } from "./services";
const Register = () => {
  const { setUser } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { user } = useAuth();
  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await registerUser(email, password);
    if (response.user) {
      setUser(response.user);
    } else {
      console.error(response.message);
    }
  };
  return (
    <Card
      sx={{
        maxWidth: 400,
        margin: "auto",
        marginTop: 10,
        padding: 3,
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        borderRadius: 2,
        backgroundColor: "#fff",
      }}
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="border-[1px] border-gray-500 rounded px-3 py-2"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="border-[1px] border-gray-500 rounded px-3 py-2"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white rounded px-4 py-2"
        >
          Register
        </button>
      </form>
    </Card>
  );
};

export default Register;
