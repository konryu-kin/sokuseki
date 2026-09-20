export type RelativeDateSpecifier =
  | {
      base: "day";
      reference: string;
      expression: {
        offset: {
          day: number;
        };
      };
    }
  | {
      base: "week";
      reference: string;
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
      reference: string;
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
      reference: string;
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
