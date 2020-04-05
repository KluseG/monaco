import { Verbosity } from './contracts/enums';

/**
 * Class that displays colorful messages.
 *
 * @export
 * @class LogMachine
 */
export class LogMachine {
  /**
   * Defines whether log is displayed as single-line or multi-line.
   *
   * @protected
   * @type {boolean}
   * @memberof LogMachine
   */
  protected isCompact: boolean = true;

  /**
   * Defines if log can be displayed.
   *
   * @protected
   * @type {boolean}
   * @memberof LogMachine
   */
  protected isOperative: boolean = true;

  /**
   * Contains information about log placement in project structure.
   *
   * @protected
   * @type {(string | null)}
   * @memberof LogMachine
   */
  protected location: string | null = null;

  /**
   * Contains title for optional stack trace display.
   *
   * @protected
   * @type {(string | null)}
   * @memberof LogMachine
   */
  protected trace: string | null = null;

  /**
   * Creates an instance of LogMachine.
   *
   * @param {Verbosity} verbosity
   * @param {(string | null)} groupName
   * @param {{ fg: string; bg: string }} colors
   * @param {{ fg: string; bg: string }} primary
   * @param {string} logType
   * @param {any[]} message
   * @memberof LogMachine
   */
  constructor(
    protected verbosity: Verbosity,
    protected groupName: string | null,
    protected colors: { fg: string; bg: string },
    protected primary: { fg: string; bg: string },
    protected logType: string,
    protected message: any[]
  ) {}

  /**
   * Defines if log can be displayed.
   *
   * @readonly
   * @type {boolean}
   * @memberof LogMachine
   */
  get shouldBeDisplayed(): boolean {
    return this.isOperative;
  }

  /**
   * Sets the log location.
   *
   * @param {string} location
   * @returns {this}
   * @memberof LogMachine
   */
  locatedAt(location: string): this {
    this.location = location;

    return this;
  }

  /**
   * Converts input message to multiple lines.
   *
   * @returns {this}
   * @memberof LogMachine
   */
  multiline(): this {
    this.isCompact = false;

    const formatted: any[] = [];
    this.message.forEach((msg: any, index: number) => {
      formatted.push(typeof msg === 'string' && index > 0 ? ` ${msg}` : msg);
      formatted.push('\r\n \r\n');
    });
    this.message = formatted;

    return this;
  }

  /**
   * Prints or "sends" message to the console.
   *
   * @returns {void}
   * @memberof LogMachine
   */
  send(): void {
    if (!this.isOperative) {
      return;
    }

    const formattedMsg: any[] = [];
    if (!this.message.some((val: any) => typeof val === 'string' && val.includes('%c'))) {
      if (this.groupName) {
        formattedMsg.push(
          `%c ${this.groupName} ${this.location === null ? '' : `@ ${this.location} `}%c ${
            this.logType.slice(0, 1).toUpperCase() + this.logType.slice(1)
          } %c ${this.isCompact ? '' : '\r\n'}%c›`,
          `background:#343a40; padding:3px; border-radius:3px 0 0 3px; color: #fff;font-family:system-ui;font-weight: normal;`,
          `background:${this.colors.bg}; padding:3px; border-radius: 0 3px 3px 0; color:${this.colors.fg};font-family:system-ui;font-weight: normal;`,
          'background:transparent',
          `font-size: 14px; line-height: 1; font-weight: bold; color:${this.colors.bg}; padding: 0;font-family:system-ui;`
        );
      } else {
        formattedMsg.push(
          `%c ${this.logType.slice(0, 1).toUpperCase() + this.logType.slice(1)} %c ${this.isCompact ? '' : '\r\n'}%c›`,
          `background:${this.colors.bg}; padding:3px; border-radius: 3px; color:${this.colors.fg};font-family:system-ui;font-weight: normal;`,
          'background:transparent',
          `font-size: 14px; line-height: 1; padding-top: 4px; font-weight: bold; color:${this.colors.bg};font-family:system-ui;`
        );
      }
    }

    formattedMsg.push(...this.message);

    let method;
    if (this.trace !== null && !['error', 'warn'].includes(this.logType)) {
      method = console.trace;
    } else {
      if (console.hasOwnProperty(this.logType)) {
        method = (console as any)[`_${this.logType}`] || (console as any)[this.logType];
      } else {
        method = (console as any)._log || console.log;
      }
    }

    method.call(this, ...formattedMsg);
  }

  /**
   * Determines if log can be displayed based on predefined verbosity and additional input.
   *
   * @param {(Verbosity | ((verbosity: Verbosity) => boolean))} verbosity
   * @returns {this}
   * @memberof LogMachine
   */
  when(verbosity: Verbosity | ((verbosity: Verbosity) => boolean)): this {
    if (typeof verbosity === 'function') {
      this.isOperative = verbosity(this.verbosity);
    } else {
      this.isOperative = this.verbosity >= verbosity;
    }

    return this;
  }

  /**
   * Adds stack trace to any console log.
   *
   * @param {string} [msg='Trace']
   * @returns {this}
   * @memberof LogMachine
   */
  withTrace(msg: string = 'Trace'): this {
    if (console.hasOwnProperty('trace')) {
      this.trace = msg;
    }

    return this;
  }
}
