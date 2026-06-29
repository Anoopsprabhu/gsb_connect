"use client";

import { ReactNode } from "react";
import Link from "next/link";

import { Loader2 } from "lucide-react";

interface ButtonProps {
  label?: string;
  children?: ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "outline" | "ghost" | "white" | "indigo";
  size?: "normal" | "large";
  className?: string;
  icon?: ReactNode;
  iconPosition?: "left" | "right";
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  loading?: boolean;
}

export default function Button({
  label,
  children,
  href,
  onClick,
  variant = "primary",
  size = "normal",
  className,
  icon,
  iconPosition = "left",
  type = "button",
  disabled = false,
  loading = false,
}: ButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center rounded-full font-medium transition-all active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none gap-2";

  const variants = {
    primary:
      "bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-500/25",
    indigo:
      "bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-500/25",
    secondary: "bg-slate-100 text-slate-900 hover:bg-slate-200",
    outline:
      "border border-slate-200 bg-transparent text-slate-700 hover:bg-slate-50",
    ghost: "bg-transparent text-slate-600 hover:bg-slate-100",
    white:
      "bg-white text-indigo-600 hover:bg-indigo-50 shadow-sm border border-slate-100",
  };

  const sizes = {
    normal: "px-6 py-2.5 text-sm",
    large: "px-5 py-4 text-base", // 20px side, 16px top/bottom
  };

  const content = (
    <>
      {loading && <Loader2 className="w-4 h-4 animate-spin" />}
      {!loading && icon && iconPosition === "left" && (
        <span className="flex-shrink-0">{icon}</span>
      )}
      {label || children}
      {!loading && icon && iconPosition === "right" && (
        <span className="flex-shrink-0">{icon}</span>
      )}
    </>
  );

  const combinedClassName = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className || ""}`;

  if (href) {
    return (
      <Link href={href} className={combinedClassName}>
        {content}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={combinedClassName}
    >
      {content}
    </button>
  );
}
