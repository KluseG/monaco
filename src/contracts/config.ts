/**
 * @export
 * @interface ColorConfigConcrete
 */
export interface ColorConfigConcrete {
  background: string;
  foreground: string;
}

/**
 * @export
 * @interface ColorConfig
 */
export interface ColorConfig {
  debug?: ColorConfigConcrete;
  error?: ColorConfigConcrete;
  info?: ColorConfigConcrete;
  notice?: ColorConfigConcrete;
  primary?: ColorConfigConcrete;
  success?: ColorConfigConcrete;
  warn?: ColorConfigConcrete;
}
