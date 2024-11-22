import { describe, expect, it } from 'vitest';

import stylns from './stylns';

describe('stylns', () => {
  it('should handle strings', () => {
    expect(stylns('color: red; font-size: 16px;')).toEqual({
      color: 'red',
      'font-size': '16px',
    });
  });

  it('should handle objects', () => {
    expect(stylns({ display: false, margin: '10px', padding: '5px' })).toEqual({
      margin: '10px',
      padding: '5px',
    });
  });

  it('should handle arrays', () => {
    expect(stylns(['color: blue;', { background: 'yellow' }])).toEqual({
      background: 'yellow',
      color: 'blue',
    });
  });

  it('should handle nested arrays', () => {
    expect(stylns(['color: green;', [{ border: '1px solid black' }], [[{ opacity: '0.9' }]]])).toEqual({
      border: '1px solid black',
      color: 'green',
      opacity: '0.9',
    });
  });

  it('should handle mixed inputs', () => {
    expect(
      stylns('font-size: 12px;', { display: 'flex' }, ['margin: 5px;', { padding: '10px' }], null, false, undefined),
    ).toEqual({
      display: 'flex',
      'font-size': '12px',
      margin: '5px',
      padding: '10px',
    });
  });

  it('should ignore bad data', () => {
    expect(
      stylns('color: red;', { display: false, margin: undefined, padding: null }, [
        'font-size: 16px;',
        null,
        false,
        undefined,
      ]),
    ).toEqual({
      color: 'red',
      'font-size': '16px',
    });
  });

  it('should merge styles with same keys, last one wins', () => {
    expect(stylns({ color: 'red', padding: '10px' }, 'color: blue; margin: 5px;', { margin: '10px' })).toEqual({
      color: 'blue',
      margin: '10px',
      padding: '10px',
    });
  });

  it('should handle deeply nested arrays and objects', () => {
    expect(stylns(['color: red;', [[[{ fontSize: '12px' }]]], { margin: { top: '10px' }, padding: '5px' }])).toEqual({
      color: 'red',
      fontSize: '12px',
      'margin-top': '10px',
      padding: '5px',
    });
  });
});
