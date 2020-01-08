import { i18n } from '@/modules/i18n';

export default class NoPermissionError extends Error {
  public action: string;
  public params: string[];

  constructor(message?: string, action?: string, params?: string[]) {
    super(message);
    this.name = 'NoPermissionError';
    this.action = String(action);
    this.stack = new Error().stack;

    if (params) {
      this.message = `${this.message}`;
    }
  }

  public toServerString = (): string => {
    return `[${this.name}][${this.action}]`;
  }

  public toString = (): string => {
    return i18n.tc('msg.error.noPermissionType0Msg');
  }
}
