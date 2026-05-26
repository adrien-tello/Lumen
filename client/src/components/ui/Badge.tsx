import { HTMLAttributes } from 'react';
import { cn } from '../../utils/cn';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: 'accent' | 'danger' | 'success' | 'neutral';
}

const tones = {
  accent: 'bg-accent text-ink',
  danger: 'bg-danger text-white',
  success: 'bg-success text-white',
  neutral: 'bg-border text-ink',
};

export const Badge = ({ tone = 'accent', className, ...props }: BadgeProps) => (
  <span
    className={cn(
      'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold',
      tones[tone],
      className,
    )}
    {...props}
  />
);
