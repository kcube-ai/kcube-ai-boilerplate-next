import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";

interface AuthButtonProps {
  children: React.ReactNode;
  loading?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  type?: "button" | "submit";
}

export const AuthButton = ({
  children,
  loading,
  disabled,
  onClick,
  type = "submit",
}: AuthButtonProps) => {
  return (
    <Button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className="w-full"
    >
      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {children}
    </Button>
  );
};
