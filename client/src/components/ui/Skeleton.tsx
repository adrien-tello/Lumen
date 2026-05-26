import { cn } from '../../utils/cn';

/** Shimmer placeholder used while data loads. */
export const Skeleton = ({ className }: { className?: string }) => (
  <div className={cn('skeleton rounded-lg', className)} />
);
