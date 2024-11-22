# cssmix

一个用于组合和处理样式对象、数组和字符串的实用工具

它简化了内联样式的管理，并允许你动态地合并、处理和应用样式，适用于 JavaScript 或 TypeScript 项目

<p>
  <a aria-label="Licence" href="https://github.com/dafengzhen/cssmix/blob/main/LICENSE">
    <img alt="Licence" src="https://img.shields.io/github/license/dafengzhen/cssmix?style=flat-quare&labelColor=000000" />
  </a>
</p>

[English](./README.md)

## 特性

- **合并样式**: 将多个样式对象或数组合并为一个
- **处理样式**: 根据特定条件或输入处理样式
- **灵活格式**: 支持样式对象、数组或字符串格式
- **轻量级**: 一个没有依赖的小工具

## 安装

你可以通过 npm 安装 `cssmix`：

```bash
npm install cssmix
```

## 使用

以下是一些常见的 `cssmix` 使用示例，展示如何合并和处理样式：

### 1. 合并样式对象

你可以将多个样式对象合并成一个。如果有重复的属性，后面的属性将覆盖前面的属性

```js
import cssmix from 'cssmix';

const style1 = { color: 'red', fontSize: '14px' };
const style2 = { backgroundColor: 'blue', fontSize: '16px' };

const combinedStyle = cssmix(style1, style2);
console.log(combinedStyle);
// Output { color: 'red', fontSize: '16px', backgroundColor: 'blue' }
```

### 2. 合并样式数组

你还可以传递样式对象或字符串的数组，`cssmix` 会将它们合并成一个样式对象

```js
const styles = [{ color: 'green' }, 'background-color: yellow;', { padding: '10px' }];

const combinedStyles = cssmix(...styles);
console.log(combinedStyles);
// Output: { color: 'green', backgroundColor: 'yellow', padding: '10px' }
```

### 3. 条件样式

你可以根据条件动态应用样式

```js
const isDarkMode = true;

const darkModeStyle = { backgroundColor: 'black', color: 'white' };
const lightModeStyle = { backgroundColor: 'white', color: 'black' };

const activeStyle = cssmix(isDarkMode ? darkModeStyle : lightModeStyle);
console.log(activeStyle);
// Output（if isDarkMode is true）: { backgroundColor: 'black', color: 'white' }
```

## API

### `cssmix(...styles)`

- **Parameters**: 接受样式对象、数组和字符串的混合
- **Returns**: 合并后的样式对象

### 示例：

```js
cssmix({ color: 'blue' }, { fontSize: '18px' });
// Output: { color: 'blue', fontSize: '18px' }
```

## 其他

欢迎贡献！请随时提交问题、分支或拉取请求

## License

[MIT](https://opensource.org/licenses/MIT)
