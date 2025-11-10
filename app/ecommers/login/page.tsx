"use client";

import React, { Suspense } from "react";
import LoginForm from "../../../components/LoginForm";
import "../../styles/auth.css";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center auth-background">
      <Suspense fallback={<div>Loading...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}

