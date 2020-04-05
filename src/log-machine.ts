import { Verbosity } from './contracts/enums';

export class LogMachine {
  protected trace: string | null = null;
  protected isCompact: boolean = true;
  protected isOperative: boolean = true;

  constructor(
    protected verbosity: Verbosity,
    protected groupName: string | null,
    protected colors: { fg: string; bg: string },
    protected logType: string,
    protected message: any[]
  ) {}

  log(): void {
    if (!this.isOperative) {
      return;
    }

    const formattedMsg: any[] = [];
    if (!this.message.some((val: any) => typeof val === 'string' && val.includes('%c'))) {
      if (this.groupName) {
        formattedMsg.push(
          `%c ${this.groupName} %c ${this.logType.slice(0, 1).toUpperCase() + this.logType.slice(1)} %c ${
            this.isCompact ? '' : '\r\n'
          }%c›`,
          `background:#343a40; padding:3px; border-radius:3px 0 0 3px; color: #fff;font-family:system-ui;`,
          `background:${this.colors.bg}; padding:3px; border-radius: 0 3px 3px 0; color:${this.colors.fg};font-family:system-ui;`,
          'background:transparent',
          `font-size: 14px; line-height: 1; font-weight: bold; color:${this.colors.bg}; padding: 0;font-family:system-ui;`
        );
      } else {
        formattedMsg.push(
          `%c ${this.logType.slice(0, 1).toUpperCase() + this.logType.slice(1)} %c ${this.isCompact ? '' : '\r\n'}%c›`,
          `background:${this.colors.bg}; padding:3px; border-radius: 3px; color:${this.colors.fg};font-family:system-ui;`,
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
        method = (console as any)[`original_${this.logType}`] || (console as any)[this.logType];
      } else {
        method = (console as any).original_log || console.log;
      }
    }

    method.call(this, ...formattedMsg);
  }

  multiline(): this {
    this.isCompact = false;

    const formatted: any[] = [];
    this.message.forEach((msg: any) => {
      formatted.push(msg);
      formatted.push('\r\n');
    });
    this.message = formatted;

    return this;
  }

  when(verbosity: Verbosity | ((verbosity: Verbosity) => boolean)): this {
    if (typeof verbosity === 'function') {
      this.isOperative = verbosity(this.verbosity);
    } else {
      this.isOperative = this.verbosity >= verbosity;
    }

    return this;
  }

  withTrace(msg: string = 'Trace'): this {
    if (console.hasOwnProperty('trace')) {
      this.trace = msg;
    }

    return this;
  }
}
