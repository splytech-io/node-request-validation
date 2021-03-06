import * as J from 'joi';
import { Schema, ValidationErrorItem, ValidationOptions } from 'joi';

export { J };

export namespace RequestValidation {
  export interface Context {
    params: { [key: string]: any };
    query: { [key: string]: any };
    request: {
      body: any;
    };
  }

  export interface Rules {
    body?: Schema;
    query?: Schema;
    params?: Schema;
  }

  export class Error extends global.Error {
    details: ValidationErrorItem[];
    scope: string;

    constructor(scope: string, details: ValidationErrorItem[]) {
      super();

      this.scope = scope;
      this.details = details;
    }
  }

  export namespace Scope {
    export const BODY = 'body';
    export const QUERY = 'query';
    export const PARAMS = 'params';
  }

  export interface Options {
    body?: ValidationOptions;
    query?: ValidationOptions;
    params?: ValidationOptions;
  }

  /**
   *
   * @param {Context} ctx
   * @param {RequestValidation.Rules} rules
   * @param {RequestValidation.Options} options
   * @returns {T}
   */
  export function validate<T>(ctx: Context, rules: Rules, options: Options = {}): T {
    const result: any = {};

    if (rules.body) {
      result.body = validateItem(Scope.BODY, ctx.request.body, rules.body, {
        abortEarly: false,
        presence: 'required',
        ...options.body,
      });
    }

    if (rules.query) {
      result.query = validateItem(Scope.QUERY, ctx.query, rules.query, {
        abortEarly: false,
        presence: 'optional',
        ...options.query,
      });
    }

    if (rules.params) {
      result.params = validateItem(Scope.PARAMS, ctx.params, rules.params, {
        abortEarly: false,
        presence: 'required',
        ...options.params,
      });
    }

    return result;
  }

  /**
   *
   * @param {string} scope
   * @param input
   * @param {Schema} schema
   * @param {ValidationOptions} options
   * @returns {any}
   */
  function validateItem(scope: string, input: any, schema: Schema, options: ValidationOptions) {
    const validationResult = schema.validate(input, options);

    if (validationResult.error) {
      throw new Error(scope, validationResult.error.details);
    }

    return validationResult.value;
  }
}
