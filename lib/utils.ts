import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTimeAgo(date: string | Date | undefined): string {
  if (!date) return '';
  
  const now = new Date();
  const past = new Date(date);
  
  // If date is invalid (e.g. "3h" mock string), return it as is
  if (isNaN(past.getTime())) {
    return typeof date === 'string' ? date : '';
  }

  const diffInMs = Math.max(0, now.getTime() - past.getTime());
  const diffInSecs = Math.floor(diffInMs / 1000);
  const diffInMins = Math.floor(diffInSecs / 60);
  const diffInHours = Math.floor(diffInMins / 60);
  const diffInDays = Math.floor(diffInHours / 24);
  const diffInMonths = Math.floor(diffInDays / 30);
  const diffInYears = Math.floor(diffInDays / 365);

  if (diffInYears > 0) return `hace ${diffInYears} año${diffInYears > 1 ? 's' : ''}`;
  if (diffInMonths > 0) return `hace ${diffInMonths} mes${diffInMonths > 1 ? 'es' : ''}`;
  if (diffInDays > 0) return `hace ${diffInDays} d`;
  if (diffInHours > 0) return `hace ${diffInHours} h`;
  if (diffInMins > 0) return `hace ${diffInMins} min`;
  if (diffInSecs > 10) return `hace ${diffInSecs} s`;
  return 'ahora';
}

export function getTotalCommentsCount(comments: any[]): number {
  if (!comments) return 0;
  let count = comments.length;
  comments.forEach(comment => {
    if (comment.replies && comment.replies.length > 0) {
      count += getTotalCommentsCount(comment.replies);
    }
  });
  return count;
}