
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import SelfReviewForm from "@/components/reviews/SelfReviewForm";

export default function Reviews() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold tracking-tight mb-6">Reviews</h1>
      <SelfReviewForm />
    </div>
  );
}
