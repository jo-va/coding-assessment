import { multiply, multiplyBy321 } from './multiply';

describe('multiplyBy321(value)', () => {
  it('should return 0 if value is 0', () => {
    expect(multiplyBy321(0)).toBe(0);
  });

  it('should return 321 if value is 1', () => {
    expect(multiplyBy321(1)).toBe(321);
  });

  it('should return the correct result for positive values', () => {
    expect(multiplyBy321(5)).toBe(321 * 5);
    expect(multiplyBy321(10)).toBe(3210);
    expect(multiplyBy321(13)).toBe(321 * 13);
  });

  it('should return the correct result for negative values', () => {
    expect(multiplyBy321(-5)).toBe(-5 * 321);
    expect(multiplyBy321(-10)).toBe(-3210);
    expect(multiplyBy321(-13)).toBe(-13 * 321);
  });

  it('should return the correct result for positive and negative floats', () => {
    expect(multiplyBy321(13.5)).toBe(321 * 13.5);
    expect(multiplyBy321(-13.5)).toBeCloseTo(-13.5 * 321);
  });

  it('should return NaN when given NaN', () => {
    expect(multiplyBy321(NaN)).toBe(NaN);
  });

  it('should throw an error the value is not a number', () => {
    expect(() => multiplyBy321('hello')).toThrow(TypeError);
    expect(() => multiplyBy321('10')).toThrow(TypeError);
    expect(() => multiplyBy321({ hello: 'world' })).toThrow(TypeError);
  });
});

describe('multiply(value, multiplier)', () => {
  it('should return 0 when multiplying by 0', () => {
    expect(multiply(0, 10)).toBe(0);
    expect(multiply(10, 0)).toBe(0);
    expect(multiply(0, 0)).toBe(0);
  });

  it('should return the value unchanged when multiplying by 1', () => {
    expect(multiply(1, 12)).toBe(12);
    expect(multiply(12, 1)).toBe(12);
    expect(multiply(1, 1)).toBe(1);
  });

  it('should return the correct result for positive operands', () => {
    expect(multiply(2, 5)).toBe(10);
    expect(multiply(5, 2)).toBe(10);
    expect(multiply(23, 55)).toBe(23 * 55);
    expect(multiply(55, 23)).toBe(55 * 23);
  });

  it('should return the correct result for negative operands', () => {
    expect(multiply(-2, 5)).toBe(-10);
    expect(multiply(2, -5)).toBe(-10);
    expect(multiply(-2, -5)).toBe(10);
  });

  it('should return the correct result if "value" is a positive or negative float', () => {
    expect(multiply(13.5, 5)).toBe(13.5 * 5);
    expect(multiply(-13.5, 5)).toBeCloseTo(-13.5 * 5);
  });

  it('should return NaN if an operand is NaN', () => {
    expect(multiply(NaN, 18)).toBe(NaN);
    expect(multiply(18, NaN)).toBe(NaN);
  });

  it('should throw an error if "value" is not a number', () => {
    expect(() => multiply('hello', 10)).toThrow(TypeError);
    expect(() => multiply('10', 10)).toThrow(TypeError);
    expect(() => multiply({ hello: 'world' }, 10)).toThrow(TypeError);
    expect(() => multiply({ hello: 'world' }, NaN)).toThrow(TypeError);
  });

  it('should throw an error if "multiplier" is not a number', () => {
    expect(() => multiply(10, 'hello')).toThrow(TypeError);
    expect(() => multiply(10, '10')).toThrow(TypeError);
    expect(() => multiply(10, { hello: 'world' })).toThrow(TypeError);
    expect(() => multiply(NaN, { hello: 'world' })).toThrow(TypeError);
  });
});
