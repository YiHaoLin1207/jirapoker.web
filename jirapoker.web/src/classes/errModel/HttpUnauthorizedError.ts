import Vue from 'vue';
import { i18n } from '@/modules/i18n';
import { EnumHttpStatusCode } from '../enum';

export default class HttpUnauthorizedError extends Error {
  public url: string;
  public statusCode: number = EnumHttpStatusCode.UNAUTHORIZED;

  constructor(error?: string, url?: string) {
    super(error);
    this.name = 'HttpUnauthorizedError';
    this.url = String(url);
    this.stack = new Error().stack;
  }

  public toServerString = (): string => {
    return `[${this.name}][${String(this.statusCode)}][${this.url}] ${this.message}`;
  }

  public toString = (): string => {
    return i18n.tc('msg.error.httpUnauthorizedError');
  }
}
