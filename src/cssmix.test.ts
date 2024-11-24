import { describe, expect, it } from 'vitest';

import cssmix from './cssmix';

describe('cssmix', () => {
  // Test: Handling simple CSS strings and mixed types
  it('should handle CSS strings, objects, arrays, and mixed inputs', () => {
    expect(cssmix('color: red; font-size: 16px;')).toEqual({
      color: 'red',
      fontSize: '16px',
    });

    expect(cssmix({ display: false, margin: '10px', padding: '5px' })).toEqual({
      margin: '10px',
      padding: '5px',
    });

    expect(cssmix(['color: blue;', { background: 'yellow' }])).toEqual({
      background: 'yellow',
      color: 'blue',
    });

    expect(cssmix(['color: green;', [{ border: '1px solid black' }], [[{ opacity: '0.9' }]]])).toEqual({
      border: '1px solid black',
      color: 'green',
      opacity: '0.9',
    });

    expect(
      cssmix('font-size: 12px;', { display: 'flex' }, ['margin: 5px;', { padding: '10px' }], null, false, undefined),
    ).toEqual({
      display: 'flex',
      fontSize: '12px',
      margin: '5px',
      padding: '10px',
    });

    expect(
      cssmix('color: red;', { display: false, margin: undefined, padding: null }, [
        'font-size: 16px;',
        null,
        false,
        undefined,
      ]),
    ).toEqual({
      color: 'red',
      fontSize: '16px',
    });
  });

  // Test: Merging styles with same keys (last one wins)
  it('should merge styles with same keys, last one wins', () => {
    expect(cssmix({ color: 'red', padding: '10px' }, 'color: blue; margin: 5px;', { margin: '10px' })).toEqual({
      color: 'blue', // Overwritten by the last occurrence
      margin: '10px', // Overwritten by the last occurrence
      padding: '10px',
    });
  });

  // Test: Handling numeric values without units
  it('should handle numeric values (without units)', () => {
    expect(cssmix({ opacity: 0.5, zIndex: 10 })).toEqual({
      opacity: 0.5,
      zIndex: 10,
    });
  });

  // Test: Handling CSS strings with invalid formats
  it('should gracefully handle invalid CSS strings', () => {
    expect(cssmix('invalid-css-string')).toEqual({});
    expect(cssmix('color red; font-size:;')).toEqual({});
    expect(cssmix('color: red; font-size')).toEqual({
      color: 'red',
    });
  });

  // Test: Handling duplicate keys in CSS strings
  it('should handle duplicate keys in CSS strings and use the last value', () => {
    expect(cssmix('color: red; color: blue; font-size: 16px;')).toEqual({
      color: 'blue', // Overwritten by the last occurrence
      fontSize: '16px',
    });
  });

  // Test: Handling empty or null inputs
  it('should return an empty object for empty or null inputs', () => {
    expect(cssmix()).toEqual({});
    expect(cssmix(null)).toEqual({});
    expect(cssmix(undefined)).toEqual({});
    expect(cssmix(false)).toEqual({});
    expect(cssmix([])).toEqual({});
    expect(cssmix([null, undefined, false])).toEqual({});
  });

  // Test: Handling invalid inputs (non-object and non-string)
  it('should ignore invalid inputs (non-object and non-string)', () => {
    expect(cssmix(42, true, null, undefined)).toEqual({});
  });

  // Test: Handling special characters and camelCase properties
  it('should handle special characters and camelCase properties', () => {
    expect(cssmix({ 'margin-top@media': '10px', 'padding.left': '5px' })).toEqual({
      marginTopMedia: '10px',
      paddingLeft: '5px',
    });

    expect(cssmix({ backgroundColor: 'blue', fontSize: '16px' })).toEqual({
      backgroundColor: 'blue',
      fontSize: '16px',
    });
  });

  // Test: Transforming hyphenated keys to camelCase in nested objects
  it('should transform hyphenated keys to camelCase in nested objects', () => {
    expect(cssmix({ 'border-top': { 'width-px': 5 } })).toEqual({
      borderTopWidthPx: 5,
    });

    expect(cssmix({ 'border-bottom': { 'left-width': { px: 10 } } })).toEqual({
      borderBottomLeftWidthPx: 10,
    });
  });

  // Test: Handling deeply nested objects and arrays
  it('should handle deeply nested arrays and objects', () => {
    expect(cssmix(['color: red;', [[[{ fontSize: '12px' }]]], { margin: { top: '10px' }, padding: '5px' }])).toEqual({
      color: 'red',
      fontSize: '12px',
      marginTop: '10px', // Transformed from nested object
      padding: '5px',
    });

    expect(cssmix([{ color: 'red' }, null, false, undefined, { fontSize: '16px' }])).toEqual({
      color: 'red',
      fontSize: '16px',
    });

    expect(
      cssmix(
        { margin: { bottom: { left: '5px' }, top: '10px' } },
        [{ border: { 'top-width': '2px' } }],
        [[{ padding: { all: '20px' } }]],
      ),
    ).toEqual({
      borderTopWidth: '2px',
      marginBottomLeft: '5px',
      marginTop: '10px',
      paddingAll: '20px',
    });
  });

  // Test: Handling arrays with null or invalid values
  it('should gracefully handle arrays with null or invalid values', () => {
    expect(cssmix([{ color: 'red' }, null, false, undefined, { fontSize: '16px' }])).toEqual({
      color: 'red',
      fontSize: '16px',
    });
  });

  // Test: Handling numeric values in arrays and nested objects
  it('should handle numeric values in arrays and nested objects', () => {
    expect(cssmix(['font-size: 16px;', { marginTop: 10 }, [{ padding: 5 }]])).toEqual({
      fontSize: '16px',
      marginTop: 10,
      padding: 5,
    });
  });

  // Test: Handling boolean values and ignoring them
  it('should ignore boolean values in objects and arrays', () => {
    expect(cssmix({ display: true, opacity: 1, visibility: false }, [true, false])).toEqual({
      opacity: 1,
    });
  });

  // Test: Handling unusual but valid keys in objects
  it('should handle unusual but valid keys in objects', () => {
    expect(cssmix({ '--custom-property': 'value', color: 'red' })).toEqual({
      '--custom-property': 'value',
      color: 'red',
    });
  });

  // Test: Handling both camelCase and hyphenated keys
  it('should handle both camelCase and hyphenated keys in the same input', () => {
    expect(cssmix({ fontSize: '16px', 'margin-top': '10px' })).toEqual({
      fontSize: '16px',
      marginTop: '10px',
    });
  });
});
