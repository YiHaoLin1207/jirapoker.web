import { i18n } from '@/modules/i18n';
export default class HttpTimeoutError extends Error {
  public url: string;
  public statusCode: number | undefined;
  constructor(message?: string, url?: string) {
    super(message);
    this.name = 'HttpTimeoutError';
    this.url = String(url);
    this.stack = new Error().stack;
  }

  public toServerString = (): string => {
    return `[${this.name}][${this.statusCode || '??'}][${this.url}] ${this.message}`;
  }

  public toString = (): string => {
    return i18n.tc('msg.error.httpTimeoutError');
  }
}
