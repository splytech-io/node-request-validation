import * as J from 'joi';
import { Schema, ValidationErrorItem, ValidationOptions } from 'joi';
import { Context } from 'koa';

export namespace RequestValidation {

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

  /**
   *
   * @param {Application.Context} ctx
   * @param {RequestValidation.Rules} rules
   * @returns {T}
   */
  export function validate<T>(ctx: Context, rules: Rules): T {
    const result: any = {};

    if (rules.body) {
      result.body = validateItem(Scope.BODY, ctx.request.body, rules.body, {
        abortEarly: false,
        presence: 'required',
      });
    }

    if (rules.query) {
      result.query = validateItem(Scope.QUERY, ctx.query, rules.query, {
        abortEarly: false,
        presence: 'optional',
      });
    }

    if (rules.params) {
      result.params = validateItem(Scope.PARAMS, ctx.params, rules.params, {
        abortEarly: false,
        presence: 'required',
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
    const validationResult = J.validate(input, schema, options);

    if (validationResult.error) {
      throw new Error(scope, validationResult.error.details);
    }

    return validationResult.value;
  }
}
