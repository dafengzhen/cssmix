export type StyleInput = StyleInput[] | StyleObject | StyleValue;

export interface StyleObject {
  [key: string]: StyleInput | StyleValue;
}

export type StyleValue = boolean | null | number | string | undefined;

/**
 * Combines multiple style inputs into a single style object.
 *
 * @param inputs - The style inputs (string, object, or array).
 * @returns A combined style object with key-value pairs.
 */
export default function cssmix(...inputs: StyleInput[]): Record<string, number | string> {
  const result: Record<string, number | string> = {};

  inputs.forEach((input) => processStyle(input, result));

  return result;
}

/**
 * Converts a value to a number or string.
 *
 * @param value - The style value (number, string, etc.).
 * @returns The converted value (number or string).
 */
function convertValue(value: StyleValue): number | string {
  return typeof value === 'number' ? value : String(value);
}

/**
 * Checks if a value is an object (not an array).
 *
 * @param value - The value to check.
 * @returns True if the value is an object-like structure, otherwise false.
 */
function isObjectLike(value: unknown): value is StyleObject {
  return typeof value === 'object' && !Array.isArray(value) && value !== null;
}

/**
 * Checks if a value is valid (not null, undefined, or boolean).
 *
 * @param value - The value to check.
 * @returns True if the value is valid (string, number, or undefined).
 */
function isValidValue(value: unknown): value is StyleValue {
  return value !== null && value !== undefined && typeof value !== 'boolean';
}

/**
 * Parses a CSS string into an object with camelCase properties.
 *
 * @param styleString - The CSS style string (e.g., "color: red;").
 * @returns A key-value object with camelCase properties.
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
 * Recursively processes nested style values and merges them into the result object.
 *
 * @param parentKey - The parent key that will be prefixed to nested properties (to handle nesting).
 * @param value - The nested value, which can be a `StyleObject`, `StyleInput[]`, or a valid `StyleValue`.
 * @param result - The accumulated style object where the processed styles are merged.
 */
function processNestedStyle(parentKey: string, value: StyleInput, result: Record<string, number | string>): void {
  Object.entries(value as StyleObject).forEach(([key, nestedValue]) => {
    const fullKey = `${parentKey}-${key}`;
    if (isObjectLike(nestedValue)) {
      processNestedStyle(fullKey, nestedValue, result);
    } else if (isValidValue(nestedValue)) {
      result[toCamelCase(fullKey)] = convertValue(nestedValue);
    }
  });
}

/**
 * Processes a style input and merges it into the result.
 *
 * @param style - The style input (string, object, or array).
 * @param result - The accumulated style object.
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
        processNestedStyle(key, value, result);
      } else if (isValidValue(value)) {
        result[toCamelCase(key)] = convertValue(value);
      }
    });
  }
}

/**
 * Converts a hyphenated CSS property to camelCase, preserving CSS variables.
 *
 * @param property - The hyphenated property (e.g., 'background-color').
 * @returns The property in camelCase (e.g., 'backgroundColor').
 */
function toCamelCase(property: string): string {
  return property.startsWith('--')
    ? property
    : property.replace(/[^a-zA-Z0-9-]/g, '-').replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
}
