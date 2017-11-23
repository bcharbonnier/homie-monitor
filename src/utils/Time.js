const DURATIONS = ["second", "minute", "hour", "day"];
const DURATIONS_PLURAL = ["seconds", "minutes", "hours", "days"];

const MINUTE = 60;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

export function humanize(seconds, short = false) {
  const parts = [
    seconds / DAY,
    (seconds % DAY) / HOUR,
    (seconds % HOUR) / MINUTE,
    seconds % MINUTE
  ]
    .map(p => Math.floor(p))
    .reverse()
    .map((p, index) => {
      if (p === 1) {
        return short ? p + DURATIONS[index][0] : p + " " + DURATIONS[index];
      } else if (p > 1) {
        return short
          ? p + DURATIONS_PLURAL[index][0]
          : p + " " + DURATIONS_PLURAL[index];
      }
      return 0;
    })
    .filter(p => p !== 0)
    .reverse()
    .join(" ");
  return parts;
}
