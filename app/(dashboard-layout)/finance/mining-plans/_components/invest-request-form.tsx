"use client";

import { useState, useMemo } from "react";
import { CardContent } from "@/ui/primitives/card";
import { Button } from "@/ui/primitives/button";
import { Input } from "@/ui/primitives/input";
import { Label } from "@/ui/primitives/label";

import ErrorMessage from "@/ui/components/default/error-message";

// ---------------------- STEP CONFIG ----------------------
type InvestStep = "selectPackage" | "accountDetails" | "paymentProof" | "review";

interface StepDetails {
  key: InvestStep;
  title: string;
  description: string;
}

const investSteps: StepDetails[] = [
  {
    key: "selectPackage",
    title: "Choose Investment Package",
    description: "Select a GPU-based mining package to start your investment.",
  },
  {
    key: "accountDetails",
    title: "Provide Account Details",
    description: "Enter your account info for crypto transfer verification.",
  },
  {
    key: "paymentProof",
    title: "Submit Payment Proof",
    description: "Enter transaction ID, USD amount, and upload your slip.",
  },
  {
    key: "review",
    title: "Review & Confirm",
    description: "Check all details before submitting your investment request.",
  },
];

// ---------------------- MAIN COMPONENT ----------------------
export default function InvestRequestFormMultiStep() {
  const [step, setStep] = useState<InvestStep>("selectPackage");
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [selectedPackage, setSelectedPackage] = useState<string>("");
  const [accountName, setAccountName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [amount, setAmount] = useState("");
  const [slip, setSlip] = useState<File | null>(null);

  const currentStep = useMemo(
    () => investSteps.find((s) => s.key === step),
    [step]
  );

  if (!currentStep) return null;

  const handleNext = () => {
    if (step === "selectPackage" && !selectedPackage) {
      setError("Please select a package to continue.");
      return;
    }
    if (step === "accountDetails" && (!accountName || !accountNumber)) {
      setError("Please fill in all account details.");
      return;
    }
    if (step === "paymentProof" && (!transactionId || !amount)) {
      setError("Please provide transaction details.");
      return;
    }

    setError(null);
    if (step === "selectPackage") setStep("accountDetails");
    else if (step === "accountDetails") setStep("paymentProof");
    else if (step === "paymentProof") setStep("review");
  };

  const handleBack = () => {
    if (step === "accountDetails") setStep("selectPackage");
    else if (step === "paymentProof") setStep("accountDetails");
    else if (step === "review") setStep("paymentProof");
  };

  const handleSubmit = () => {
    // Submit logic here
    console.log({
      selectedPackage,
      accountName,
      accountNumber,
      transactionId,
      amount,
      slip,
    });
    alert("Investment request submitted successfully!");
  };

  return (
    <div className="max-w-xl mx-auto">
      <div className="mb-6 text-center">
        <h2 className="text-xl font-bold">{currentStep.title}</h2>
        <p className="text-gray-600 dark:text-gray-300">
          {currentStep.description}
        </p>
      </div>

      <CardContent className="space-y-4">
        {/* Step 1: Package Selection */}
        {step === "selectPackage" && (
          <div className="grid gap-3">
            {["Starter Pack - $100", "Pro Pack - $500", "Elite Pack - $1000"].map(
              (pkg) => (
                <button
                  key={pkg}
                  className={`p-4 border rounded-lg text-left ${
                    selectedPackage === pkg
                      ? "border-blue-600 bg-blue-50 dark:bg-blue-900"
                      : "border-gray-300 dark:border-gray-600"
                  }`}
                  onClick={() => setSelectedPackage(pkg)}
                >
                  {pkg}
                </button>
              )
            )}
          </div>
        )}

        {/* Step 2: Account Details */}
        {step === "accountDetails" && (
          <div className="space-y-4">
            <div>
              <Label>Account Name</Label>
              <Input
                type="text"
                value={accountName}
                onChange={(e) => setAccountName(e.target.value)}
                placeholder="Enter account holder name"
              />
            </div>
            <div>
              <Label>Account Number</Label>
              <Input
                type="text"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                placeholder="Enter account number"
              />
            </div>
          </div>
        )}

        {/* Step 3: Payment Proof */}
        {step === "paymentProof" && (
          <div className="space-y-4">
            <div>
              <Label>Transaction ID</Label>
              <Input
                type="text"
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
                placeholder="Enter blockchain transaction ID"
              />
            </div>
            <div>
              <Label>Amount (USD)</Label>
              <Input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount in USD"
              />
            </div>
            <div>
              <Label>Upload Transaction Slip</Label>
              <Input
                type="file"
                accept="image/*,.pdf"
                onChange={(e) => setSlip(e.target.files?.[0] || null)}
              />
              {slip && (
                <p className="text-sm mt-1 text-green-600">
                  Uploaded: {slip.name}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Step 4: Review */}
        {step === "review" && (
          <div className="space-y-2">
            <p>
              <strong>Package:</strong> {selectedPackage}
            </p>
            <p>
              <strong>Account Name:</strong> {accountName}
            </p>
            <p>
              <strong>Account Number:</strong> {accountNumber}
            </p>
            <p>
              <strong>Transaction ID:</strong> {transactionId}
            </p>
            <p>
              <strong>Amount (USD):</strong> ${amount}
            </p>
            {slip && (
              <p>
                <strong>Slip:</strong> {slip.name}
              </p>
            )}
          </div>
        )}

        {/* Error message */}
        {error && <ErrorMessage error={error} />}

        {/* Navigation buttons */}
        <div className="flex justify-between mt-6">
          {step !== "selectPackage" && (
            <Button variant="outline" onClick={handleBack}>
              Back
            </Button>
          )}
          {step !== "review" ? (
            <Button onClick={handleNext}>Next</Button>
          ) : (
            <Button onClick={handleSubmit}>Submit</Button>
          )}
        </div>
      </CardContent>
    </div>
  );
}
