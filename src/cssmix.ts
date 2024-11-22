export type StyleInput = Record<string, Record<string, StyleValue> | StyleValue> | StyleInput[] | StyleValue;

export type StyleValue = boolean | null | number | string | undefined;

/**
 * cssmix - A utility for combining and processing style objects, arrays, and strings.
 *
 * @param {...(string | object | Array<any> | null | undefined | boolean)} args - The styles to process.
 * @returns {Record<string, string>} - A merged style object.
 */
export default function cssmix(...args: StyleInput[]): Record<string, string> {
  const result: Record<string, string> = {};

  for (const style of args) {
    processStyle(style, result);
  }

  return result;
}

/**
 * Checks if a value is an object-like structure (non-null, non-array, and of type 'object').
 *
 * @param {unknown} value - The value to check.
 * @returns {value is Record<string, StyleValue>} - Returns true if the value is object-like, otherwise false.
 */
function isObjectLike(value: unknown): value is Record<string, StyleValue> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

/**
 * Checks if a style value is valid (non-null, non-undefined, and not false).
 *
 * @param {unknown} value - The value to check.
 * @returns {boolean} - Returns true if the value is valid, otherwise false.
 */
function isValidValue(value: unknown): boolean {
  return value !== null && value !== undefined && value !== false;
}

/**
 * Parses a string style definition into a key-value object using regex.
 *
 * Explanation:
 * ([\w-]+): Matches a CSS property name (composed of letters, numbers, underscores, or hyphens).
 * \s*:\s*: Matches optional spaces before and after the colon.
 * ([^;]+): Matches the value until a semicolon is encountered.
 * ;?: Allows for an optional semicolon after the value.
 * g: Global matching, to extract multiple key: value pairs.
 *
 * @param {string} styleString - A string containing CSS styles (e.g. "color: red; font-size: 12px;").
 * @returns {Record<string, string>} - A key-value object representing the CSS styles.
 */
function parseStyleString(styleString: string): Record<string, string> {
  const result: Record<string, string> = {};
  const regex = /([\w-]+)\s*:\s*([^;]+)\s*;?/g;
  let match;

  while ((match = regex.exec(styleString))) {
    const property = match[1].trim();
    result[property] = match[2].trim();
  }

  return result;
}

/**
 * Recursively processes styles from various input types (strings, objects, arrays).
 *
 * @param {StyleInput} style - The style data to process (can be a string, object, or array of styles).
 * @param {Record<string, string>} result - The object to store the merged style properties.
 */
function processStyle(style: StyleInput, result: Record<string, string>): void {
  if (!style) {
    return;
  }

  if (typeof style === 'string') {
    Object.assign(result, parseStyleString(style));
    return;
  }

  if (Array.isArray(style)) {
    for (const item of style) {
      processStyle(item, result);
    }
    return;
  }

  if (typeof style === 'object') {
    Object.entries(style).forEach(([key, value]) => {
      if (isObjectLike(value)) {
        Object.entries(value).forEach(([nestedKey, nestedValue]) => {
          if (isValidValue(nestedValue)) {
            result[`${key}-${nestedKey}`] = String(nestedValue);
          }
        });
      } else if (isValidValue(value)) {
        result[key] = String(value);
      }
    });
  }
}
