export function formatTime(seconds: number): string {
    seconds = seconds/1000>>0
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    if (hrs > 0) return `${hrs}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    if (mins > 0) return `${mins}:${String(secs).padStart(2, '0')}`;
    return `${secs}`;
}