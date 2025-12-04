import React from "react";
import Image from "next/image";
import Login from "@/features/auth/Login";
export default async function Home() {
  // Redirect to login page
  return (
    <div className="bg-blue-100 min-h-screen flex items-center justify-center login-page">
      <Login />
    </div>
  );
}
