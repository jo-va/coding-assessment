/**
 * A function that multiplies a number by an integer.
 * The function returns NaN if an operand is NaN (like the regular "*" operator)
 *
 * @param {number} value First operand to the multiply function
 * @param {integer} multiplier Second operand to the multiply fuction, must be an integer
 *
 * @returns The result of multiplying `value` with `multiplier`.
 */
export function multiply(value, multiplier) {
  if (typeof value !== 'number') {
    throw new TypeError(`expected "value" to be a number but got: ${value}`);
  } else if (!Number.isNaN(multiplier) && !Number.isSafeInteger(multiplier)) {
    throw new TypeError(`expected "multiplier" to be an integer but got: ${multiplier}`);
  } else if (Number.isNaN(value) || Number.isNaN(multiplier)) {
    return NaN;
  }

  if (multiplier === 0) {
    return 0;
  } else if (multiplier > 0) {
    return value + multiply(value, multiplier - 1);
  } else {
    return -multiply(value, -multiplier);
  }
}

/**
 * A function that multiplies a number by 321.
 *
 * @param {number} value The value to be multiplied by 321.
 *
 * @returns The result of multiplying `value` with 321.
 */
export function multiplyBy321(value) {
  return multiply(value, 321);
}
