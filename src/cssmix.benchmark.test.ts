import { describe, expect, it } from 'vitest';

import cssmix from './cssmix';

describe('cssmix Performance and Edge Case Tests', () => {
  // Benchmark: Small input
  it('should handle small input efficiently', () => {
    const startTime = performance.now();
    const result = cssmix('color: red;', { margin: '10px' });
    const duration = performance.now() - startTime;
    console.log('Small input duration:', duration.toFixed(4), 'ms');
    expect(duration).toBeLessThan(10);
    expect(result).toEqual({ color: 'red', margin: '10px' });
  });

  // Benchmark: Large input
  it('should handle large input efficiently', () => {
    const startTime = performance.now();
    const largeInput = Array(1000)
      .fill('color: red;')
      .concat(Array(1000).fill({ margin: { top: '10px' }, padding: '5px' }));
    const result = cssmix(...largeInput);
    const duration = performance.now() - startTime;
    console.log('Large input duration:', duration.toFixed(4), 'ms');
    expect(duration).toBeLessThan(1000);
    expect(result).toMatchObject({ color: 'red', marginTop: '10px', padding: '5px' });
  });

  // Benchmark: Deeply nested input
  it('should handle deeply nested input efficiently', () => {
    const startTime = performance.now();
    const deepInput = ['color: red;', [[[{ fontSize: '12px' }]]], { margin: { top: '10px' }, padding: '5px' }];
    const result = cssmix(...deepInput);
    const duration = performance.now() - startTime;
    console.log('Deeply nested input duration:', duration.toFixed(4), 'ms');
    expect(duration).toBeLessThan(100);
    expect(result).toEqual({
      color: 'red',
      fontSize: '12px',
      marginTop: '10px',
      padding: '5px',
    });
  });

  // Benchmark: Concurrent calls
  it('should handle concurrent calls efficiently', async () => {
    const startTime = performance.now();
    const promises = Array(100)
      .fill(0)
      .map(() => cssmix('color: red;', { margin: '10px' }));
    await Promise.all(promises);
    const duration = performance.now() - startTime;
    console.log('Concurrent calls duration:', duration.toFixed(4), 'ms');
    expect(duration).toBeLessThan(500);
  });

  // Edge Case: Invalid values (undefined, null, false)
  it('should ignore invalid values (undefined, null, false)', () => {
    const start = performance.now();
    const result = cssmix(undefined, null, false, 'color: red;', { margin: '10px' });
    const end = performance.now();
    console.log(`Invalid values duration: ${(end - start).toFixed(4)} ms`);
    expect(result).toEqual({ color: 'red', margin: '10px' });
  });

  // Edge Case: Incorrectly formatted style strings
  it('should ignore incorrectly formatted style strings', () => {
    const start = performance.now();
    const result = cssmix('color red', 'font-size 12px;', 'margin 10px');
    const end = performance.now();
    console.log(`Incorrect format duration: ${(end - start).toFixed(4)} ms`);
    expect(result).toEqual({});
  });

  // Edge Case: Duplicate styles (last one wins)
  it('should handle duplicate styles correctly (last one wins)', () => {
    const start = performance.now();
    const result = cssmix('color: red;', { color: 'blue' }, 'color: green;');
    const end = performance.now();
    console.log(`Duplicate styles duration: ${(end - start).toFixed(4)} ms`);
    expect(result).toEqual({ color: 'green' });
  });

  // Edge Case: Empty objects and arrays
  it('should ignore empty objects and arrays', () => {
    const start = performance.now();
    const result = cssmix({}, [], '', null);
    const end = performance.now();
    console.log(`Empty objects and arrays duration: ${(end - start).toFixed(4)} ms`);
    expect(result).toEqual({});
  });

  // Edge Case: Deeply nested objects
  it('should correctly handle deeply nested objects', () => {
    const start = performance.now();
    const result = cssmix({
      color: 'red',
      font: { size: '12px', weight: 'bold' },
    });
    const end = performance.now();
    console.log(`Nested objects duration: ${(end - start).toFixed(4)} ms`);
    expect(result).toEqual({
      color: 'red',
      fontSize: '12px',
      fontWeight: 'bold',
    });
  });

  // Edge Case: Combining multiple types of inputs
  it('should combine strings, objects, and arrays correctly', () => {
    const start = performance.now();
    const result = cssmix('color: red;', { margin: '10px' }, ['padding: 20px;', { display: 'flex' }]);
    const end = performance.now();
    console.log(`Mixed inputs duration: ${(end - start).toFixed(4)} ms`);
    expect(result).toEqual({
      color: 'red',
      display: 'flex',
      margin: '10px',
      padding: '20px',
    });
  });
});
