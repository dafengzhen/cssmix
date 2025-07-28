export type StyleInput = StyleInput[] | StyleObject | StyleValue;

export interface StyleObject {
  [key: string]: StyleInput;
}

export type StyleValue = boolean | null | number | string | undefined | unknown;

const camelCache = new Map<string, string>();

/**
 * Converts various style input types into a flat object with camelCased CSS property names.
 * Later values override earlier ones.
 *
 * @param inputs - A list of style inputs, which may include objects, strings, or nested arrays.
 * @returns A flat style object with camelCase keys and string or number values.
 */
export default function cssmix(...inputs: StyleInput[]): Record<string, number | string> {
  const result: Record<string, number | string> = {};
  const queue: StyleInput[] = inputs;

  for (let i = 0; i < queue.length; i++) {
    const current = queue[i];
    if (!current) {
      continue;
    }

    if (typeof current === 'string') {
      parseStyleStringInto(current, result);
    } else if (Array.isArray(current)) {
      queue.splice(i + 1, 0, ...current);
    } else if (isObjectLike(current)) {
      const entries = Object.entries(current);
      for (let j = 0; j < entries.length; j++) {
        const [key, value] = entries[j];
        if (isObjectLike(value)) {
          queue.push(flattenNested(key, value));
        } else if (isValidValue(value)) {
          result[toCamelCase(key)] = convertValue(value);
        }
      }
    }
  }

  return result;
}

/**
 * Converts a value to either a string or a number.
 *
 * @param value - The style value to convert.
 * @returns A string or number representation of the value.
 */
function convertValue(value: StyleValue): number | string {
  return typeof value === 'number' ? value : String(value);
}

/**
 * Flattens a nested style object by prefixing keys with the parent key.
 *
 * @param prefix - The prefix to apply to all keys.
 * @param obj - The nested style object.
 * @returns A new flat object with hyphenated keys.
 */
function flattenNested(prefix: string, obj: StyleObject): StyleObject {
  const flattened: StyleObject = {};
  for (const key in obj) {
    flattened[`${prefix}-${key}`] = obj[key];
  }
  return flattened;
}

/**
 * Determines if a value is a plain object (not null, not an array).
 *
 * @param value - The value to test.
 * @returns True if the value is object-like, false otherwise.
 */
function isObjectLike(value: unknown): value is StyleObject {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/**
 * Determines if a value is a valid style value (not null, undefined, or boolean).
 *
 * @param value - The value to test.
 * @returns True if the value is valid, false otherwise.
 */
function isValidValue(value: unknown): value is StyleValue {
  return value !== null && value !== undefined && typeof value !== 'boolean';
}

/**
 * Parses a CSS style string and adds the parsed properties to a result object.
 *
 * @param styleString - The CSS string to parse (e.g. "color: red; margin: 10px").
 * @param result - The object to store parsed properties.
 */
function parseStyleStringInto(styleString: string, result: Record<string, number | string>): void {
  const rules = styleString.split(';');
  for (let i = 0; i < rules.length; i++) {
    const rule = rules[i].trim();
    if (!rule) {
      continue;
    }

    const colon = rule.indexOf(':');
    if (colon === -1) {
      continue;
    }

    const key = rule.slice(0, colon).trim();
    const value = rule.slice(colon + 1).trim();
    if (key) {
      result[toCamelCase(key)] = value;
    }
  }
}

/**
 * Converts a CSS property name to camelCase, using a cache for performance.
 * Keeps custom properties (starting with `--`) as-is.
 *
 * @param property - The CSS property name to convert.
 * @returns The camelCased property name.
 */
function toCamelCase(property: string): string {
  if (property.startsWith('--')) {
    return property;
  }
  if (camelCache.has(property)) {
    return camelCache.get(property)!;
  }

  const camel = property.replace(/[^a-zA-Z0-9-]/g, '-').replace(/-([a-z])/g, (_, c) => c.toUpperCase());
  camelCache.set(property, camel);
  return camel;
}
