import { describe, expect, it } from 'vitest';

import cssmix from './cssmix';

describe('cssmix', () => {
  // Test: Handling simple CSS strings
  it('should handle CSS strings', () => {
    expect(cssmix('color: red; font-size: 16px;')).toEqual({
      color: 'red',
      fontSize: '16px',
    });
  });

  // Test: Handling objects with valid and invalid values
  it('should handle objects', () => {
    expect(cssmix({ display: false, margin: '10px', padding: '5px' })).toEqual({
      margin: '10px',
      padding: '5px',
    }); // `display: false` is ignored
  });

  // Test: Handling arrays of mixed styles
  it('should handle arrays', () => {
    expect(cssmix(['color: blue;', { background: 'yellow' }])).toEqual({
      background: 'yellow',
      color: 'blue',
    });
  });

  // Test: Handling deeply nested arrays
  it('should handle nested arrays', () => {
    expect(cssmix(['color: green;', [{ border: '1px solid black' }], [[{ opacity: '0.9' }]]])).toEqual({
      border: '1px solid black',
      color: 'green',
      opacity: '0.9',
    });
  });

  // Test: Handling mixed types of inputs
  it('should handle mixed inputs', () => {
    expect(
      cssmix('font-size: 12px;', { display: 'flex' }, ['margin: 5px;', { padding: '10px' }], null, false, undefined),
    ).toEqual({
      display: 'flex',
      fontSize: '12px',
      margin: '5px',
      padding: '10px',
    });
  });

  // Test: Ignoring invalid or bad data
  it('should ignore bad data', () => {
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

  // Test: Merging styles with the same keys (last one wins)
  it('should merge styles with same keys, last one wins', () => {
    expect(cssmix({ color: 'red', padding: '10px' }, 'color: blue; margin: 5px;', { margin: '10px' })).toEqual({
      color: 'blue', // Overwritten by the last occurrence
      margin: '10px', // Overwritten by the last occurrence
      padding: '10px',
    });
  });

  // Test: Handling deeply nested arrays and objects
  it('should handle deeply nested arrays and objects', () => {
    expect(cssmix(['color: red;', [[[{ fontSize: '12px' }]]], { margin: { top: '10px' }, padding: '5px' }])).toEqual({
      color: 'red',
      fontSize: '12px',
      marginTop: '10px', // Transformed from nested object
      padding: '5px',
    });
  });

  // Test: Handling numeric values without units
  it('should handle numeric values (without units)', () => {
    expect(cssmix({ opacity: 0.5, zIndex: 10 })).toEqual({
      opacity: 0.5,
      zIndex: 10,
    });
  });

  // Test: Handling numeric values with units
  it('should handle numeric values with units', () => {
    expect(cssmix({ height: '200px', width: 100 })).toEqual({
      height: '200px',
      width: 100,
    });
  });

  // Test: Handling mixed string and number values
  it('should handle mixed string and number values', () => {
    expect(cssmix({ fontSize: '16px', marginTop: 10 })).toEqual({
      fontSize: '16px',
      marginTop: 10,
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
});
