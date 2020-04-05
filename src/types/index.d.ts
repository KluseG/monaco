/**
 * @interface Console
 */
declare interface Console {
  [key: string]: any;
  memory: any;
  assert(condition?: boolean, message?: string, ...data: any[]): void;
  clear(): void;
  count(label?: string): void;
  debug(message?: any, ...optionalParams: any[]): void;
  dir(value?: any, ...optionalParams: any[]): void;
  dirxml(value: any): void;
  error(message?: any, ...optionalParams: any[]): void;
  exception(message?: string, ...optionalParams: any[]): void;
  group(groupTitle?: string, ...optionalParams: any[]): void;
  groupCollapsed(groupTitle?: string, ...optionalParams: any[]): void;
  groupEnd(): void;
  info(message?: any, ...optionalParams: any[]): void;
  log(message?: any, ...optionalParams: any[]): void;
  markTimeline(label?: string): void;
  profile(reportName?: string): void;
  profileEnd(reportName?: string): void;
  table(...tabularData: any[]): void;
  time(label?: string): void;
  timeEnd(label?: string): void;
  timeStamp(label?: string): void;
  timeline(label?: string): void;
  timelineEnd(label?: string): void;
  trace(message?: any, ...optionalParams: any[]): void;
  warn(message?: any, ...optionalParams: any[]): void;
  _clear(): void;
  _debug(message?: any, ...optionalParams: any[]): void;
  _error(message?: any, ...optionalParams: any[]): void;
  _group(groupTitle?: string, ...optionalParams: any[]): void;
  _groupCollapsed(groupTitle?: string, ...optionalParams: any[]): void;
  _groupEnd(): void;
  _info(message?: any, ...optionalParams: any[]): void;
  _log(message?: any, ...optionalParams: any[]): void;
  _trace(message?: any, ...optionalParams: any[]): void;
  _warn(message?: any, ...optionalParams: any[]): void;
}
