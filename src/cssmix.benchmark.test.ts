import { describe, expect, it } from 'vitest';

import cssmix from './cssmix.ts';

describe('cssmix Performance Tests', () => {
  // Benchmark: Small input
  it('should handle small input efficiently', () => {
    const startTime = performance.now(); // Start timing

    // Small input data: simple style string and basic object
    cssmix('color: red;', { margin: '10px' });

    const endTime = performance.now(); // End timing
    const duration = endTime - startTime; // Calculate time difference

    console.log('Small input duration:', duration, 'ms'); // Output duration

    // Expect the small input to be processed in less than 10ms
    expect(duration).toBeLessThan(10); // Adjust threshold based on system performance
    // Small input duration: 0.10720000000000596 ms
  });

  // Benchmark: Large input
  it('should handle large input efficiently', () => {
    const startTime = performance.now();

    // Large input data: 1000 repeated style strings and objects
    const largeInput = Array(1000)
      .fill('color: red;')
      .concat(Array(1000).fill({ margin: { top: '10px' }, padding: '5px' }));
    cssmix(...largeInput); // Process the large input

    const endTime = performance.now();
    const duration = endTime - startTime;

    console.log('Large input duration:', duration, 'ms');

    // Expect the large input to be processed in less than 1000ms
    expect(duration).toBeLessThan(1000); // Adjust threshold based on data size
    // Large input duration: 1.4770000000000039 ms
  });

  // Benchmark: Deeply nested input
  it('should handle deeply nested input efficiently', () => {
    const startTime = performance.now();

    // Deeply nested input data: including strings, arrays, and nested objects
    const deepInput = [
      'color: red;',
      [[[{ fontSize: '12px' }]]], // Nested array containing an object
      { margin: { top: '10px' }, padding: '5px' }, // Nested object
    ];
    cssmix(...deepInput); // Process the deeply nested input

    const endTime = performance.now();
    const duration = endTime - startTime;

    console.log('Deeply nested input duration:', duration, 'ms');

    // Expect deeply nested input to be processed in less than 100ms
    expect(duration).toBeLessThan(100); // Adjust threshold based on actual performance
    // Deeply nested input duration: 0.016199999999997772 ms
  });

  // Benchmark: Concurrent calls
  it('should handle concurrent calls efficiently', async () => {
    const promises = Array(100)
      .fill(0)
      .map(() => cssmix('color: red;', { margin: '10px' }));
    const startTime = performance.now();
    await Promise.all(promises); // Wait for all concurrent calls to complete
    const endTime = performance.now();
    const duration = endTime - startTime;
    console.log('Concurrent calls duration:', duration, 'ms');
    expect(duration).toBeLessThan(500); // Expect concurrent calls to complete in less than 500ms
    // Concurrent calls duration: 0.3615000000000066 ms
  });
});

describe('cssmix Performance Tests with Edge Cases', () => {
  // Test invalid values (undefined, null, false)
  it('should handle invalid values (undefined, null, false)', () => {
    const start = performance.now();
    const result = cssmix(undefined, null, false, 'color: red;', { margin: '10px' });
    const end = performance.now();
    console.log(`Invalid values duration: ${end - start} ms`);
    expect(result).toEqual({ color: 'red', margin: '10px' }); // Invalid values should be ignored, valid styles should be processed
    // Invalid values duration: 0.00570000000001869 ms
  });

  // Test incorrectly formatted style strings
  it('should handle incorrectly formatted style strings', () => {
    const start = performance.now();
    const result = cssmix('color red', 'font-size 12px;', 'margin 10px');
    const end = performance.now();
    console.log(`Incorrect format duration: ${end - start} ms`);
    expect(result).toEqual({}); // Incorrect format should result in an empty object
    // Incorrect format duration: 0.009200000000419095 ms
  });

  // Test handling duplicate styles correctly
  it('should handle duplicate styles correctly', () => {
    const start = performance.now();
    const result = cssmix('color: red;', { color: 'blue' }, 'color: green;');
    const end = performance.now();
    console.log(`Duplicate styles duration: ${end - start} ms`);
    expect(result).toEqual({ color: 'green' }); // Last style value should overwrite previous ones
    // Incorrect format duration: 0.009200000000419095 ms
  });

  // Test handling empty objects and arrays
  it('should handle empty objects and arrays', () => {
    const start = performance.now();
    const result = cssmix({}, [], '', null);
    const end = performance.now();
    console.log(`Empty objects and arrays duration: ${end - start} ms`);
    expect(result).toEqual({}); // Empty objects and arrays should be ignored
    // Empty objects and arrays duration: 0.0033000000039464794 ms
  });

  // Test deeply nested objects and ensure they are handled gracefully
  it('should handle nested objects gracefully', () => {
    const start = performance.now();
    const result = cssmix({ color: 'red', font: { size: '12px', weight: 'bold' } });
    const end = performance.now();
    console.log(`Nested objects duration: ${end - start} ms`);
    expect(result).toEqual({
      color: 'red',
      'font-size': '12px',
      'font-weight': 'bold',
    }); // Nested objects should be expanded to the correct format
    // Nested objects duration: 0.009799999999813735 ms
  });
});
