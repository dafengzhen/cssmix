# cssmix

A utility for combining and processing style objects, arrays, and strings in a flexible and efficient way.

It simplifies managing inline styles and allows you to merge, process, and apply styles dynamically in JavaScript or
TypeScript-based
projects.

<p>
  <a aria-label="Licence" href="https://github.com/dafengzhen/cssmix/blob/main/LICENSE">
    <img alt="Licence" src="https://img.shields.io/github/license/dafengzhen/cssmix?style=flat-quare&labelColor=000000" />
  </a>
</p>

[简体中文](./README.zh.md)

## Features

- **Combine styles**: Merge multiple style objects or arrays into one.
- **Process styles**: Handle conditional styles based on certain conditions or inputs.
- **Flexible format**: Accepts styles in the form of objects, arrays, or strings.
- **Lightweight**: A small utility with no dependencies.

## Installation

You can install `cssmix` via npm:

```bash
npm install cssmix
```

## Usage

Here are some common examples of how to use `cssmix` to combine and process styles:

### 1. Combine Style Objects

You can combine multiple style objects into one. If there are overlapping properties, the later ones will override the
earlier ones.

```js
import cssmix from 'cssmix';

const style1 = { color: 'red', fontSize: '14px' };
const style2 = { backgroundColor: 'blue', fontSize: '16px' };

const combinedStyle = cssmix(style1, style2);
console.log(combinedStyle);
// Output: { color: 'red', fontSize: '16px', backgroundColor: 'blue' }
```

### 2. Combine Style Arrays

You can also pass arrays of style objects or strings and `cssmix` will merge them into one.

```js
const styles = [{ color: 'green' }, 'background-color: yellow;', { padding: '10px' }];

const combinedStyles = cssmix(...styles);
console.log(combinedStyles);
// Output: { color: 'green', backgroundColor: 'yellow', padding: '10px' }
```

### 3. Conditional Styles

You can conditionally apply styles based on a condition.

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

- **Parameters**: Accepts a mix of style objects, arrays, and strings.
- **Returns**: A merged style object.

### Example:

```js
cssmix({ color: 'blue' }, { fontSize: '18px' });
// Output: { color: 'blue', fontSize: '18px' }
```

## Contributing

Contributions are welcome! Please feel free to submit issues, forks, or pull requests.

## License

[MIT](https://opensource.org/licenses/MIT)
