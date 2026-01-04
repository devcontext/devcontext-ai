"use client";

import { MessageSquare } from "lucide-react";
import { Button } from "@/features/shared/ui/button";

interface FeedbackButtonProps {
  onFeedback?: () => void;
}

export function FeedbackButton({ onFeedback }: FeedbackButtonProps) {
  const handleClick = () => {
    // Placeholder for feedback modal/form
    onFeedback?.();
    console.log("Feedback button clicked - implement feedback form");
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleClick}
      className="text-sm font-medium gap-2"
      aria-label="Send feedback"
    >
      Feedback
    </Button>
  );
}
