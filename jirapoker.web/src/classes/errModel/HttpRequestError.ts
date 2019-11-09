import Vue from 'vue';
import { i18n } from '@/modules/i18n';
import { AxiosError } from 'axios';
export default class HttpRequestError extends Error {
  public url: string;
  public statusCode: number | undefined;
  constructor(message?: string, url?: string, status?: number) {
    super(message);
    this.name = 'HttpRequestError';
    this.url = String(url);
    this.statusCode = status;
    this.stack = new Error().stack;
  }

  public toServerString = (): string => {
    return `[${this.name}][${this.statusCode || '??'}][${this.url}] ${this.message}`;
  }

  public toString = (): string => {
    return i18n.tc('msg.error.httpRequestError');
  }
}
