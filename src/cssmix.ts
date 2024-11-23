export type StyleInput = Record<string, Record<string, StyleValue> | StyleValue> | StyleInput[] | StyleValue;

export type StyleValue = boolean | null | number | string | undefined;

/**
 * Combines and processes style objects, arrays, and strings into a single style object.
 *
 * @param {...StyleInput[]} args - The styles to process.
 * @returns {Record<string, number | string>} - A merged style object.
 */
export default function cssmix(...args: StyleInput[]): Record<string, number | string> {
  const result: Record<string, number | string> = {};

  args.forEach((style) => processStyle(style, result));

  return result;
}

/**
 * Capitalizes the first letter of a string (e.g., 'top' → 'Top').
 *
 * @param {string} str - The string to capitalize.
 * @returns {string} - The string with the first letter capitalized.
 */
const capitalizeFirstLetter = (str: string): string => str.charAt(0).toUpperCase() + str.slice(1);

/**
 * Converts a hyphenated CSS property to camelCase.
 *
 * @param {string} property - The hyphenated CSS property (e.g., 'background-color').
 * @returns {string} - The property in camelCase (e.g., 'backgroundColor').
 */
const toCamelCase = (property: string): string => property.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());

/**
 * Converts a value into a string or keeps it as a number.
 *
 * @param {StyleValue} value - The value to convert.
 * @returns {string | number} - The converted value.
 */
const convertValue = (value: StyleValue): number | string => (typeof value === 'number' ? value : String(value));

/**
 * Checks if a value is a valid style value (non-null, non-undefined, and not false).
 *
 * @param {unknown} value - The value to check.
 * @returns {boolean} - True if the value is valid, otherwise false.
 */
const isValidValue = (value: unknown): boolean => value !== null && value !== undefined && value !== false;

/**
 * Checks if a value is an object-like structure (non-null, non-array, and of type 'object').
 *
 * @param {unknown} value - The value to check.
 * @returns {boolean} - True if the value is object-like, otherwise false.
 */
const isObjectLike = (value: unknown): value is Record<string, StyleValue> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

/**
 * Parses a CSS-like string into a key-value object using regex.
 *
 * @param {string} styleString - A string containing CSS styles (e.g., "color: red; font-size: 12px;").
 * @returns {Record<string, string>} - A key-value object representing the CSS styles.
 */
function parseStyleString(styleString: string): Record<string, string> {
  const result: Record<string, string> = {};
  const regex = /([\w-]+)\s*:\s*([^;]+)\s*;?/g;
  let match;

  while ((match = regex.exec(styleString))) {
    result[toCamelCase(match[1].trim())] = match[2].trim();
  }

  return result;
}

/**
 * Recursively processes styles from various input types (strings, objects, arrays).
 *
 * @param {StyleInput} style - The style data to process (can be a string, object, or array of styles).
 * @param {Record<string, number | string>} result - The object to store the merged style properties.
 */
function processStyle(style: StyleInput, result: Record<string, number | string>): void {
  if (!style) {
    return;
  }

  if (typeof style === 'string') {
    Object.assign(result, parseStyleString(style));
  } else if (Array.isArray(style)) {
    style.forEach((item) => processStyle(item, result));
  } else if (isObjectLike(style)) {
    Object.entries(style).forEach(([key, value]) => {
      if (isObjectLike(value)) {
        Object.entries(value).forEach(([nestedKey, nestedValue]) => {
          if (isValidValue(nestedValue)) {
            const compoundKey = `${toCamelCase(key)}${capitalizeFirstLetter(nestedKey)}`;
            result[compoundKey] = convertValue(nestedValue);
          }
        });
      } else if (isValidValue(value)) {
        result[toCamelCase(key)] = convertValue(value);
      }
    });
  }
}
