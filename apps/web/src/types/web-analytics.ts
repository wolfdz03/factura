export type AnalyticsEventSuffix =
  | "-click"
  | "-action"
  | "-submit"
  | "-download"
  | "-toggle"
  | "-select"
  | "-open"
  | "-close";

export interface IAnalytics {
  name: `${string}${AnalyticsEventSuffix}`;
  group?: string;
}
