export type RelativeDateSpecifier =
  | {
      base: "day";
      expression: {
        offset: {
          day: number;
        };
      };
    }
  | {
      base: "week";
      expression: {
        offset: {
          week: number;
        };
        specifier?: {
          day: number;
        };
      };
    }
  | {
      base: "month";
      expression: {
        offset: {
          month: number;
        };
        specifier?:
          | {
              type: "week-base";
              week: number;
              day: number;
            }
          | {
              type: "day-base";
              day: number;
            };
      };
    }
  | {
      base: "year";
      expression: {
        offset: {
          year: number;
        };
        specifier?:
          | {
              type: "week-base";
              month: number;
              week: number;
              day: number;
            }
          | {
              type: "day-base";
              month: number;
              day: number;
            };
      };
    };
