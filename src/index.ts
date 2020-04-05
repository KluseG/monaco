import { Verbosity, BackgroundColors, ForegroundColors } from './contracts/enums';
import { ColorConfig } from './contracts/config';
import { LogMachine } from './log-machine';

let _instance: Monaco | null = null;

export default class Monaco {
  constructor(
    protected verbosity: Verbosity = 0,
    protected groupName: string | null = null,
    protected colors?: ColorConfig
  ) {}

  static $patch(groupName: string | null = null, colors?: ColorConfig): Monaco {
    if (_instance) {
      return _instance;
    }
    _instance = new Monaco(0, groupName, colors);

    ['error', 'info', 'log', 'warn'].forEach((key: string) => {
      (console as any)[`original_${key}`] = (console as any)[key];
    });

    console.error = _instance.error.bind(_instance);
    console.info = _instance.notice.bind(_instance);
    console.warn = _instance.warn.bind(_instance);
    console.log = _instance.info.bind(_instance);

    return _instance;
  }

  error(...msg: any[]): LogMachine {
    return this.makeMachine('error', msg);
  }

  group(callback: (logger: Monaco) => void, msg: string = 'Group'): void {
    const method = console.groupCollapsed || console.group;

    method.call(
      this,
      ...[
        `%c ${msg} `,
        `background:#343a40; padding:3px; border-radius: 3px; color:#ffffff;font-family:system-ui;font-weight: normal;`,
      ]
    );
    callback(this);
    console.groupEnd();
  }

  info(...msg: any[]): LogMachine {
    return this.makeMachine('info', msg);
  }

  notice(...msg: any[]): LogMachine {
    return this.makeMachine('notice', msg);
  }

  success(...msg: any[]): LogMachine {
    return this.makeMachine('success', msg);
  }

  warn(...msg: any[]): LogMachine {
    return this.makeMachine('warn', msg);
  }

  protected getColor(colorName: keyof ColorConfig): { bg: string; fg: string } {
    let bg = '';
    let fg = '';

    if (this.colors && this.colors[colorName]) {
      bg = this.colors[colorName]!.background;
      fg = this.colors[colorName]!.foreground;
    } else {
      bg = BackgroundColors[colorName];
      fg = ForegroundColors[colorName];
    }

    return {
      bg,
      fg,
    };
  }

  protected makeMachine(type: keyof ColorConfig, message: any[]): LogMachine {
    return new LogMachine(this.verbosity, this.groupName, this.getColor(type), type, message);
  }
}
