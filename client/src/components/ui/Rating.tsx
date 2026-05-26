import { Star } from 'lucide-react';
import { cn } from '../../utils/cn';

interface RatingProps {
  value: number;
  count?: number;
  size?: number;
  className?: string;
}

/** Star rating display with optional review count. */
export const Rating = ({ value, count, size = 14, className }: RatingProps) => (
  <div className={cn('flex items-center gap-1', className)}>
    <div className="flex">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={size}
          className={cn(
            i <= Math.round(value) ? 'fill-accent text-accent' : 'fill-border text-border',
          )}
        />
      ))}
    </div>
    {count !== undefined && <span className="text-xs text-muted">({count})</span>}
  </div>
);
