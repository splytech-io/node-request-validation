import * as Joi from 'joi';
import { Context } from 'koa';
import { RequestValidation } from '../index';

interface Request {
  body: {
    username: string;
  };
  params: {
    user_id: string;
  };
  query: {
    limit: number;
  };
}

const validation: RequestValidation.Rules = {
  body: Joi.object({
    username: Joi.string(),
  }),
  params: Joi.object({
    user_id: Joi.string(),
  }),
  query: Joi.object({
    limit: Joi.number(),
  }),
};

export default (ctx: Context) => {
  const { body, params, query } = RequestValidation.validate<Request>(ctx, validation);

  console.log(body.username, params.user_id, query.limit);
}

