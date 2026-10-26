import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'warning';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  className,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled,
  leftIcon,
  rightIcon,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer';

  const variants = {
    primary: 'bg-[#13856B] hover:bg-[#0F6B56] text-white focus:ring-[#13856B] shadow-sm hover:shadow',
    secondary: 'bg-white hover:bg-slate-50 text-[#172B3A] border border-[#E2E8F0] focus:ring-slate-300 shadow-sm',
    outline: 'bg-transparent hover:bg-emerald-50 text-[#13856B] border border-[#13856B] focus:ring-[#13856B]',
    ghost: 'bg-transparent hover:bg-slate-100 text-[#172B3A] focus:ring-slate-200',
    danger: 'bg-[#DC2626] hover:bg-[#B91C1C] text-white focus:ring-[#DC2626] shadow-sm',
    warning: 'bg-[#D97706] hover:bg-[#B45309] text-white focus:ring-[#D97706] shadow-sm',
  };

  const sizes = {
    sm: 'text-xs px-3 py-1.5 gap-1.5',
    md: 'text-sm px-4 py-2 gap-2',
    lg: 'text-base px-6 py-3 gap-2.5',
  };

  return (
    <button
      className={twMerge(clsx(baseStyles, variants[variant], sizes[size], className))}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin text-current" />
      ) : (
        leftIcon
      )}
      <span>{children}</span>
      {!isLoading && rightIcon}
    </button>
  );
};
