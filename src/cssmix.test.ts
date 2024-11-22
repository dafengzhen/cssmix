import { describe, expect, it } from 'vitest';

import cssmix from './cssmix';

describe('cssmix', () => {
  it('should handle strings', () => {
    expect(cssmix('color: red; font-size: 16px;')).toEqual({
      color: 'red',
      'font-size': '16px',
    });
  });

  it('should handle objects', () => {
    expect(cssmix({ display: false, margin: '10px', padding: '5px' })).toEqual({
      margin: '10px',
      padding: '5px',
    });
  });

  it('should handle arrays', () => {
    expect(cssmix(['color: blue;', { background: 'yellow' }])).toEqual({
      background: 'yellow',
      color: 'blue',
    });
  });

  it('should handle nested arrays', () => {
    expect(cssmix(['color: green;', [{ border: '1px solid black' }], [[{ opacity: '0.9' }]]])).toEqual({
      border: '1px solid black',
      color: 'green',
      opacity: '0.9',
    });
  });

  it('should handle mixed inputs', () => {
    expect(
      cssmix('font-size: 12px;', { display: 'flex' }, ['margin: 5px;', { padding: '10px' }], null, false, undefined),
    ).toEqual({
      display: 'flex',
      'font-size': '12px',
      margin: '5px',
      padding: '10px',
    });
  });

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
      'font-size': '16px',
    });
  });

  it('should merge styles with same keys, last one wins', () => {
    expect(cssmix({ color: 'red', padding: '10px' }, 'color: blue; margin: 5px;', { margin: '10px' })).toEqual({
      color: 'blue',
      margin: '10px',
      padding: '10px',
    });
  });

  it('should handle deeply nested arrays and objects', () => {
    expect(cssmix(['color: red;', [[[{ fontSize: '12px' }]]], { margin: { top: '10px' }, padding: '5px' }])).toEqual({
      color: 'red',
      fontSize: '12px',
      'margin-top': '10px',
      padding: '5px',
    });
  });
});
