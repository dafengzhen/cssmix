# cssmix

A utility for combining and processing style objects, arrays, and strings in a flexible and efficient way.

It simplifies the management of inline styles in React projects, enabling you to dynamically merge, process, and apply styles.

<p>
  <a aria-label="Licence" href="https://github.com/dafengzhen/cssmix/blob/main/LICENSE">
    <img alt="Licence" src="https://img.shields.io/github/license/dafengzhen/cssmix?style=flat-quare&labelColor=000000" />
  </a>
</p>

[简体中文](./README.zh.md)

## Features

- **Combine styles**: Merge multiple style objects, arrays, or strings into one.
- **Process styles**: Handle conditional and dynamic styles based on input or state.
- **Flexible format**: Accepts styles in the form of objects, arrays, or CSS-compatible strings.
- **Lightweight**: Small utility with no dependencies.

## Installation

Install `cssmix` using npm:

```bash
npm install cssmix
```

## Usage

cssmix can combine and process styles in various formats. Below are examples of how you can use it effectively.

### 1. Combine Style Objects

Merge multiple style objects into one. If there are overlapping properties, the later ones will override the earlier
ones.

```js
import cssmix from 'cssmix';

const style1 = { color: 'red', fontSize: '14px' };
const style2 = { backgroundColor: 'blue', fontSize: '16px' };

const combinedStyle = cssmix(style1, style2);
console.log(combinedStyle);
// Output: { color: 'red', fontSize: '16px', backgroundColor: 'blue' }
```

### 2. Combine Style Arrays

Pass arrays of style objects or strings, and cssmix will merge them into one.

```js
const styles = [{ color: 'green' }, 'background-color: yellow;', { padding: '10px' }];

const combinedStyles = cssmix(...styles);
console.log(combinedStyles);
// Output: { color: 'green', backgroundColor: 'yellow', padding: '10px' }
```

### 3. Conditional Styles

Apply styles dynamically based on conditions, such as application state or user preferences.

```js
const isDarkMode = true;

const darkModeStyle = { backgroundColor: 'black', color: 'white' };
const lightModeStyle = { backgroundColor: 'white', color: 'black' };

const activeStyle = cssmix(isDarkMode ? darkModeStyle : lightModeStyle);
console.log(activeStyle);
// Output (if isDarkMode is true): { backgroundColor: 'black', color: 'white' }
```

## API

### `cssmix(...styles)`

- **Parameters**: Accepts any combination of style objects, arrays, or strings.
- **Returns**: A single merged style object where:
  - Nested objects are flattened (e.g., { margin: { top: '10px' } } → { marginTop: '10px' }).
  - Duplicate keys are overridden, with the last value taking precedence.

### Example:

```js
cssmix({ color: 'blue' }, { fontSize: '18px' });
// Output: { color: 'blue', fontSize: '18px' }
```

```js
cssmix(['padding: 10px;', { margin: '5px' }, { margin: { top: '10px', bottom: '20px' } }]);
// Output: { padding: '10px', margin: '5px', marginTop: '10px', marginBottom: '20px' }
```

```js
cssmix(null, undefined, false, '', {}, { color: 'red' });
// Output: { color: 'red' }
```

```js
cssmix({ color: 'red' }, { color: 'blue', fontSize: '14px' });
// Output: { color: 'blue', fontSize: '14px' }
```

## Contributing

Contributions are welcome! Please feel free to submit issues, forks, or pull requests.

## License

[MIT](https://opensource.org/licenses/MIT)
