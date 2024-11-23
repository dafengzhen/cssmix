# cssmix

一个用于组合和处理样式对象、数组和字符串的实用工具

它简化了 React 项目中内联样式的管理，使您能够动态地合并、处理和应用样式

<p>
  <a aria-label="Licence" href="https://github.com/dafengzhen/cssmix/blob/main/LICENSE">
    <img alt="Licence" src="https://img.shields.io/github/license/dafengzhen/cssmix?style=flat-quare&labelColor=000000" />
  </a>
</p>

[English](./README.md)

## 特性

- **合并样式**: 将多个样式对象、数组或字符串合并为一个
- **处理样式**: 根据输入或条件动态处理样式
- **灵活格式**: 支持对象、数组或 CSS 字符串格式的样式
- **轻量级**: 一个没有依赖的小工具

## 安装

使用 npm 安装 `cssmix`：

```bash
npm install cssmix
```

## 使用

cssmix 支持多种样式组合与处理方式，以下是一些常见场景的示例:：

### 1. 合并样式对象

将多个样式对象合并为一个。如果存在重复的样式属性，后面的值会覆盖前面的值

```js
import cssmix from 'cssmix';

const style1 = { color: 'red', fontSize: '14px' };
const style2 = { backgroundColor: 'blue', fontSize: '16px' };

const combinedStyle = cssmix(style1, style2);
console.log(combinedStyle);
// Output: { color: 'red', fontSize: '16px', backgroundColor: 'blue' }
```

### 2. 合并样式数组

可以传入样式数组（对象或字符串），cssmix 会将它们合并为一个

```js
const styles = [{ color: 'green' }, 'background-color: yellow;', { padding: '10px' }];

const combinedStyles = cssmix(...styles);
console.log(combinedStyles);
// Output: { color: 'green', backgroundColor: 'yellow', padding: '10px' }
```

### 3. 条件样式

根据条件动态应用样式，例如应用程序状态或用户设置

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
- **Returns**: 一个合并后的样式对象，其中：
  - 嵌套对象会被展开，例如 { margin: { top: '10px' } } → { marginTop: '10px' }
  - 重复的键会被覆盖，后面出现的值优先

### 示例：

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

## 其他

欢迎贡献！请随时提交问题、分支或拉取请求

## License

[MIT](https://opensource.org/licenses/MIT)
