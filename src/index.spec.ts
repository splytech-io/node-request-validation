import { expect } from 'chai';
import * as J from 'joi';
import { RequestValidation } from './index';

describe('request-validation', () => {

  describe('body', () => {
    function createBody(body: object) {
      return <any>{
        request: {
          body,
        },
      };
    }

    it('should pass validation', () => {
      const { body } = RequestValidation.validate(createBody({
        name: 'john',
      }), {
        body: J.object(),
      });

      expect(body).to.deep.equals({
        name: 'john',
      });
    });

    it('should cast number', () => {
      const { body } = RequestValidation.validate(createBody({
        age: '25',
      }), {
        body: J.object({
          age: J.number(),
        }),
      });

      expect(body).to.deep.equals({
        age: 25,
      });
    });

    it('should throw', () => {
      expect(() => {
        RequestValidation.validate(createBody({}), {
          body: J.object({
            age: J.number(),
          }),
        });
      }).to.throw(RequestValidation.Error);
    });

    it('should throw if extra params are passed', () => {
      expect(() => {
        RequestValidation.validate(createBody({
          extra: true,
        }), {
          body: J.object({}),
        });
      }).to.throw(RequestValidation.Error);
    });
  });

  describe('query', () => {
    function createQuery(query: object) {
      return <any>{
        query,
      };
    }

    it('should pass validation', () => {
      const { query } = RequestValidation.validate(createQuery({
        name: 'john',
      }), {
        query: J.object(),
      });

      expect(query).to.deep.equals({
        name: 'john',
      });
    });

    it('should cast number', () => {
      const { query } = RequestValidation.validate(createQuery({
        age: '25',
      }), {
        query: J.object({
          age: J.number(),
        }),
      });

      expect(query).to.deep.equals({
        age: 25,
      });
    });

    it('should throw', () => {
      expect(() => {
        RequestValidation.validate(createQuery({
          age: 'poipoi',
        }), {
          query: J.object({
            age: J.number(),
          }),
        });
      }).to.throw(RequestValidation.Error);
    });

    it('should not throw if params are not passed', () => {
      expect(() => {
        RequestValidation.validate(createQuery({}), {
          query: J.object({
            age: J.number(),
          }),
        });
      }).to.not.throw(RequestValidation.Error);
    });
  });

  describe('params', () => {
    function createParams(params: object) {
      return <any>{
        params,
      };
    }

    it('should pass validation', () => {
      const { params } = RequestValidation.validate(createParams({
        name: 'john',
      }), {
        params: J.object(),
      });

      expect(params).to.deep.equals({
        name: 'john',
      });
    });

    it('should cast number', () => {
      const { params } = RequestValidation.validate(createParams({
        age: '25',
      }), {
        params: J.object({
          age: J.number(),
        }),
      });

      expect(params).to.deep.equals({
        age: 25,
      });
    });

    it('should throw', () => {
      expect(() => {
        RequestValidation.validate(createParams({
          age: 'poipoi',
        }), {
          params: J.object({
            age: J.number(),
          }),
        });
      }).to.throw(RequestValidation.Error);
    });

    it('should throw if params are not passed', () => {
      expect(() => {
        RequestValidation.validate(createParams({}), {
          params: J.object({
            age: J.number(),
          }),
        });
      }).to.throw(RequestValidation.Error);
    });
  });
});
