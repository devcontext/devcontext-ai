"use client";

import { useState, useEffect } from "react";
import { Copy, Check, AlertTriangle, CheckCircle2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/features/shared/ui/dialog";
import { Button } from "@/features/shared/ui/button";
import { Input } from "@/features/shared/ui/input";
import { FormWrapper } from "@/features/shared/components/form/form-wrapper/form-wrapper";
import { FormField } from "@/features/shared/components/form/form-field/form-field";
import { applyActionErrors } from "@/features/shared/components/form/utils/apply-action-errors";
import { useToast } from "@/features/shared/hooks/use-toast";
import { generateTokenSchema, type GenerateTokenValues } from "../schemas";
import type { ApiResponse } from "@/features/shared/types/api-response";

interface GenerateTokenDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (
    values: GenerateTokenValues,
  ) => Promise<ApiResponse<{ token: string }>>;
  initialName?: string;
}

export function GenerateTokenDialog({
  isOpen,
  onClose,
  onGenerate,
  initialName = "",
}: GenerateTokenDialogProps) {
  const { toast } = useToast();
  const [generatedToken, setGeneratedToken] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [globalError, setGlobalError] = useState<string | null>(null);

  const methods = useForm<GenerateTokenValues>({
    resolver: zodResolver(generateTokenSchema),
    defaultValues: {
      name: initialName,
    },
    mode: "onTouched",
  });

  const {
    reset,
    setError,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    if (isOpen && !generatedToken) {
      reset({ name: initialName });
    }
  }, [isOpen, initialName, reset, generatedToken]);

  const onSubmit = async (values: GenerateTokenValues) => {
    setGlobalError(null);
    const result = await onGenerate(values);

    if (result.success && result.data?.token) {
      setGeneratedToken(result.data.token);
    } else {
      if (result.fieldErrors) {
        applyActionErrors({ setError, fieldErrors: result.fieldErrors });
      }
      const errorMsg = result.error || "Failed to generate access token";
      setGlobalError(errorMsg);
      toast({
        title: "Error",
        description: errorMsg,
        variant: "destructive",
      });
    }
  };

  const handleCopy = async () => {
    if (generatedToken) {
      await navigator.clipboard.writeText(generatedToken);
      setCopied(true);
      toast({
        title: "Token copied",
        description: "Access token copied to clipboard.",
        variant: "success",
      });
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleClose = () => {
    reset();
    setGeneratedToken(null);
    setGlobalError(null);
    setCopied(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {generatedToken ? "" : "Generate New Access Token"}
          </DialogTitle>
          {!generatedToken && (
            <DialogDescription>
              Create a token to authenticate MCP requests
            </DialogDescription>
          )}
        </DialogHeader>

        {!generatedToken ? (
          <FormWrapper
            methods={methods}
            onSubmit={onSubmit}
            globalError={globalError}
            className="space-y-4"
          >
            <FormField
              name="name"
              label="Token Name"
              placeholder="e.g., My Cursor Integration"
              disabled={isSubmitting}
            />

            <DialogFooter className="pt-4">
              <Button
                variant="outline"
                type="button"
                onClick={handleClose}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Generating..." : "Generate Token"}
              </Button>
            </DialogFooter>
          </FormWrapper>
        ) : (
          <div className="space-y-6 pt-2">
            <div className="flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center ring-1 ring-green-500/20">
                <CheckCircle2 className="w-10 h-10 text-green-500" />
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-bold text-foreground">
                  Token successfully generated!
                </h3>
                <p className="text-sm text-muted-foreground max-w-xs">
                  Copy your token now. You won&apos;t be able to see it again.
                </p>
              </div>
            </div>

            <div className="p-4 bg-amber-500/5 border border-amber-500/10 rounded-xl flex gap-3">
              <AlertTriangle
                className="text-amber-500 shrink-0 mt-0.5"
                size={18}
              />
              <div className="space-y-1">
                <p className="text-sm font-semibold text-amber-600 dark:text-amber-400">
                  Security Warning
                </p>
                <p className="text-xs text-amber-600/80 dark:text-amber-400/70 leading-relaxed">
                  Treat this token as carefully as your password. Store it
                  securely in a password manager.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-medium text-foreground px-1">
                Your Access Token
              </label>
              <div className="flex gap-2 p-1.5 bg-muted/30 border border-border rounded-xl focus-within:ring-1 focus-within:ring-primary transition-all">
                <Input
                  type="text"
                  value={generatedToken}
                  readOnly
                  className="flex-1 font-mono text-sm bg-transparent border-none focus-visible:ring-0 h-9"
                />
                <Button
                  variant={copied ? "default" : "secondary"}
                  size="sm"
                  type="button"
                  onClick={handleCopy}
                  className="shrink-0 h-9 gap-2 transition-all"
                >
                  {copied ? (
                    <>
                      <Check size={14} />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy size={14} />
                      Copy
                    </>
                  )}
                </Button>
              </div>
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                className="w-full sm:w-auto"
                onClick={handleClose}
              >
                I&apos;ve saved it, let&apos;s go!
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
