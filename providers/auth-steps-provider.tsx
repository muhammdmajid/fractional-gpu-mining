"use client";

import * as React from "react";
import { useQueryState } from "nuqs";

const AuthStep = ["initial", "sendOtp", "verifyOtp","verifyLink", "completed"] as const;
export type AuthStep = typeof AuthStep[number];

interface AuthStepContextValue {
  query: { step: AuthStep; email: string; otpCode: string };
  setQuery: (query: Partial<{ step: AuthStep; email: string; otpCode: string }>) => void;
}

const AuthStepContext = React.createContext<AuthStepContextValue | null>(null);

export const useAuthStep = (): AuthStepContextValue => {
  const context = React.useContext(AuthStepContext);
  if (!context) throw new Error("useAuthStep must be used within AuthStepProvider");
  return context;
};

interface AuthStepProviderProps {
  children: React.ReactNode;
}

export const AuthStepProvider = ({ children }: AuthStepProviderProps) => {
  // Parse function for step
  const parseStep = (value: string | null): AuthStep | null =>
    value && AuthStep.includes(value as AuthStep) ? (value as AuthStep) : null;

  // Step query state
  const [step, setStep] = useQueryState<AuthStep | null>("step", {
    parse: parseStep,
    serialize: (value) => value ?? "",
    defaultValue: "initial",
    clearOnDefault: true,
    shallow: false,
    eq: (a, b) => (!a && !b) || a === b,
  });

  // Email query state
  const [email, setEmail] = useQueryState<string>("email", {
    parse: (value: string | null) => (value ?? "") || null,
    serialize: (value) => value ?? "",
    defaultValue: "",
    clearOnDefault: true,
    shallow: false,
    eq: (a, b) => a === b,
  });

  // OTP code query state
  const [otpCode, setOtpCode] = useQueryState<string>("otpCode", {
    parse: (value: string | null) => (value ?? "") || null,
    serialize: (value) => value ?? "",
    defaultValue: "",
    clearOnDefault: true,
    shallow: false,
    eq: (a, b) => a === b,
  });

  const query = { step: step ?? "initial", email: email ?? "", otpCode: otpCode ?? "" };

  const setQuery = (newQuery: Partial<{ step: AuthStep; email: string; otpCode: string }>) => {
    if (newQuery.step !== undefined) setStep(newQuery.step);
    if (newQuery.email !== undefined) setEmail(newQuery.email);
    if (newQuery.otpCode !== undefined) setOtpCode(newQuery.otpCode);
  };

  return (
    <AuthStepContext.Provider value={{ query, setQuery }}>
      {children}
    </AuthStepContext.Provider>
  );
};
