'use client';

import { cn, getRatingColor } from '@/lib/utils';

interface RatingBadgeProps {
    rating: string;
}

export function RatingBadge({ rating }: RatingBadgeProps) {
    const colorClass = getRatingColor(rating);

    return (
        <div className="flex flex-col items-center">
            <div className={cn(
                "w-16 h-16 rounded-2xl flex items-center justify-center border-2 bg-white/5 backdrop-blur-sm shadow-xl",
                rating === 'A+' ? "border-emerald-500/50 shadow-emerald-500/20" :
                    ['A', 'B'].includes(rating) ? "border-green-500/50 shadow-green-500/20" :
                        ['C', 'D', 'E'].includes(rating) ? "border-yellow-500/50 shadow-yellow-500/20" :
                            "border-red-500/50 shadow-red-500/20"
            )}>
                <span className={cn("text-3xl font-bold", colorClass)}>
                    {rating}
                </span>
            </div>
            <span className="text-xs font-medium text-white/40 mt-2 uppercase tracking-wide">Rating</span>
        </div>
    );
}
