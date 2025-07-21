"use client";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function TryForFreePage() {
  const { user, updateUserPlan } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleTryForFree = async () => {
    if (!user) return;
    setLoading(true);
    try {
      // Set planType to 'monthly' and set subscription dates
      await updateUserPlan("monthly");
      toast.success("Your free month is now active! Enjoy all paid features.");
      router.push("/dashboard");
    } catch (error) {
      toast.error("An error occurred while activating your free trial.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full text-center">
        <h1 className="text-2xl font-bold mb-4 text-blue-700">Try all paid features FREE for 1 month!</h1>
        <p className="mb-6 text-gray-700">
          Get <span className="font-semibold text-blue-600">1 month free</span> of all paid store features.<br/>
          No charges during your first month.
        </p>
        <Button 
          onClick={handleTryForFree} 
          disabled={loading} 
          className="w-full text-lg py-2 font-bold bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg hover:opacity-90 border-0"
        >
          {loading ? "...Activating" : "Start your free month now"}
        </Button>
      </div>
    </div>
  );
} 