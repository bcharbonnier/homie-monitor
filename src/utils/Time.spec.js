import { humanize } from "./Time";

it("should humanize basic duration", () => {
  expect(humanize(63)).toBe("1 minute 3 seconds");
  expect(humanize(3600)).toBe("1 hour");
  expect(humanize(3606)).toBe("1 hour 6 seconds");
  expect(humanize(86400)).toBe("1 day");
  expect(humanize(86434)).toBe("1 day 34 seconds");
});

it("should humanize with shot format", () => {
  expect(humanize(32498434, true)).toBe("376d 3h 20m 34s");
});
