import type { RelativeDateSpecifier } from "./relativeDateSpecifier";

export type AbsoluteDateSpecifier =
  | {
      type: "day-base";
      year: number;
      month: number;
      day: number;
    }
  | {
      type: "week-base";
      year: number;
      month: number;
      week: number;
      day: number;
    };

export type DateSpecifier =
  | {
      type: "absolute";
      specifier: AbsoluteDateSpecifier;
    }
  | {
      type: "relative";
      specifier: RelativeDateSpecifier;
    };

export type AbsoluteTimeSpecifier = {
  hour: number;
  minute: number;
};

export type RelativeTimeSpecifier = {
  hour?: number;
  minute: number;
};

export type TimeSpecifier =
  | {
      type: "absolute";
      specifier: AbsoluteTimeSpecifier;
    }
  | {
      type: "relative";
      specifier: RelativeTimeSpecifier;
    };

export type DateTimeSpecifier = {
  date?: DateSpecifier;
  time?: TimeSpecifier;
};
