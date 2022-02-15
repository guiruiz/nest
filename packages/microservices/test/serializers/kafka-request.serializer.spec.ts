import { expect } from 'chai';
import { KafkaHeaders } from '../../enums/kafka-headers.enum';
import { KafkaRequestSerializer } from '../../serializers/kafka-request.serializer';

describe('KafkaRequestSerializer', () => {
  let instance: KafkaRequestSerializer;
  beforeEach(() => {
    instance = new KafkaRequestSerializer();
  });
  describe('serialize', () => {
    it('undefined', async () => {
      const message = undefined;

      expect(await instance.serialize({ data: message })).to.deep.eq({
        headers: {},
        value: null,
      });
    });

    it('null', async () => {
      const message = null;

      expect(await instance.serialize({ data: message })).to.deep.eq({
        headers: {},
        value: null,
      });
    });

    it('string', async () => {
      const message = 'string';

      expect(await instance.serialize({ data: message })).to.deep.eq({
        headers: {},
        value: 'string',
      });
    });

    it('number', async () => {
      const message = 12345;
      expect(await instance.serialize({ data: message })).to.deep.eq({
        headers: {},
        value: '12345',
      });
    });

    it('buffer', async () => {
      const message = Buffer.from('buffer');

      expect(await instance.serialize({ data: message })).to.deep.eq({
        headers: {},
        value: Buffer.from('buffer'),
      });
    });

    it('array', async () => {
      const message = [1, 2, 3, 4, 5];

      expect(await instance.serialize({ data: message })).to.deep.eq({
        headers: {},
        value: '[1,2,3,4,5]',
      });
    });

    it('object', async () => {
      const message = {
        prop: 'value',
      };

      expect(await instance.serialize({ data: message })).to.deep.eq({
        headers: {},
        value: '{"prop":"value"}',
      });
    });

    it('complex object with .toString()', async () => {
      class Complex {
        private readonly name = 'complex';
        public toString(): string {
          return this.name;
        }
      }
      const message = new Complex();

      expect(await instance.serialize({ data: message })).to.deep.eq({
        headers: {},
        value: 'complex',
      });
    });

    it('complex object without .toString()', async () => {
      class ComplexWithOutToString {
        private readonly name = 'complex';
      }
      const message = new ComplexWithOutToString();

      expect(await instance.serialize({ data: message })).to.deep.eq({
        headers: {},
        value: '[object Object]',
      });
    });
  });

  describe('serialize kafka message', () => {
    it('kafka message without key', async () => {
      const message = {
        value: 'string',
      };

      expect(await instance.serialize({ data: message })).to.deep.eq({
        headers: {},
        value: 'string',
      });
    });

    it('kafka message with key', async () => {
      const message = {
        key: '1',
        value: 'string',
      };

      expect(await instance.serialize({ data: message })).to.deep.eq({
        headers: {},
        key: '1',
        value: 'string',
      });
    });

    it('kafka message with headers', async () => {
      const message = {
        key: '1',
        value: 'string',
        headers: {
          [KafkaHeaders.CORRELATION_ID]: '1234',
        },
      };

      expect(await instance.serialize({ data: message })).to.deep.eq({
        headers: {
          [KafkaHeaders.CORRELATION_ID]: '1234',
        },
        key: '1',
        value: 'string',
      });
    });
  });

  describe('serialize kafka response message', () => {
    it('kafka object response message', async () => {
      const message = {
        foo: 'bar',
      };

      expect(await instance.serialize({ response: message })).to.deep.eq({
        headers: {},
        value: '{"foo":"bar"}',
      });
    });
  });
});
