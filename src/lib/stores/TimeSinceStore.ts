import { readable } from 'svelte/store';

export function timeSince(date: Date) {
    return readable(calculateTimeSince(date), (set) => {
        const interval = setInterval(() => {
            set(calculateTimeSince(date));
        }, 60000); // Update every minute

        return () => clearInterval(interval);
    });
}

function calculateTimeSince(date: Date): string {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);

    let interval = Math.floor(seconds / 31536000);
    if (interval >= 1) return interval === 1 ? "1 year ago" : `${interval} years ago`;

    interval = Math.floor(seconds / 2592000);
    if (interval >= 1) return interval === 1 ? "1 month ago" : `${interval} months ago`;

    interval = Math.floor(seconds / 86400);
    if (interval >= 1) return interval === 1 ? "1 day ago" : `${interval} days ago`;

    interval = Math.floor(seconds / 3600);
    if (interval >= 1) return interval === 1 ? "1 hour ago" : `${interval} hours ago`;

    interval = Math.floor(seconds / 60);
    if (interval >= 1) return interval === 1 ? "1 minute ago" : `${interval} minutes ago`;

    return "Just now";
}
