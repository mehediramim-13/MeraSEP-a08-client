"use client";

import { forwardRef, useState } from "react";
import { Eye, EyeOff } from "lucide-react";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export interface PasswordFieldProps
  extends Omit<React.ComponentProps<typeof Input>, "type"> {
  label: string;
  error?: string;
  id: string;
}

export const PasswordField = forwardRef<HTMLInputElement, PasswordFieldProps>(
  function PasswordField({ label, error, id, className, ...props }, ref) {
    const [show, setShow] = useState(false);

    return (
      <div className="space-y-1.5">
        <label htmlFor={id} className="text-sm font-medium text-foreground">
          {label}
        </label>
        <div className="relative">
          <Input
            ref={ref}
            id={id}
            type={show ? "text" : "password"}
            aria-invalid={!!error}
            className={cn("pr-11", className)}
            {...props}
          />
          <button
            type="button"
            onClick={() => setShow((current) => !current)}
            aria-label={show ? "Hide password" : "Show password"}
            className="absolute right-1.5 top-1/2 inline-flex size-8 -translate-y-1/2 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {show ? (
              <EyeOff className="size-4" aria-hidden="true" />
            ) : (
              <Eye className="size-4" aria-hidden="true" />
            )}
          </button>
        </div>
        {error ? (
          <p role="alert" className="text-xs font-medium text-destructive">
            {error}
          </p>
        ) : null}
      </div>
    );
  },
);
