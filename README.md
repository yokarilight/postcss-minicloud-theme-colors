# postcss-minicloud-theme-colors

A PostCSS plugin that automatically transforms color groups for light and dark themes, allowing you to define colors once and apply them across your project with ease. This plugin also supports CSS custom properties (variables) for more flexible theming.

## Features

- **Automatic Theme Switching**: Easily define and switch between light and dark theme colors.
- **Support for Custom Properties**: Use CSS variables to define theme colors.
- **Nesting Support**: Automatically handles nested CSS selectors when used with `postcss-nested` or `postcss-nesting`.

## Installation

Install via npm:

```bash
npm install postcss-minicloud-theme-colors --save-dev
```

## Usage
```javascript
// postcss.config.js
module.exports = {
  plugins: [
    require('postcss-nested'), // If you use nested CSS
    require('postcss-minicloud-theme-colors')({
      function: 'transformColor',
      groups: {
        primary: ['#ffffff', '#000000'],
        secondary: ['#333333', '#cccccc'],
      },
      useCustomProperties: false,
      darkThemeSelector: 'html[data-theme="dark"]',
      nestingPlugin: 'nested', // Set to 'nesting' if using postcss-nesting
    }),
    require('autoprefixer'),
  ]
};
```

## Example
Given the following CSS:
```css
.header {
  background-color: transformColor(primary);
  color: transformColor(secondary);
}
```

The plugin will generate:
```css
.header {
  background-color: #ffffff;
  color: #333333;
}

html[data-theme="dark"] .header {
  background-color: #000000;
  color: #cccccc;
}
```

---
You can also use CSS custom properties (variables) to define your theme colors:
```javascript
// postcss.config.js
module.exports = {
  plugins: [
    require('postcss-minicloud-theme-colors')({
      function: 'transformColor',
      groups: {
        primary: ['--primary-color', '--primary-dark-color'],
        secondary: ['--secondary-color', '--secondary-dark-color'],
      },
      useCustomProperties: true,
      darkThemeSelector: 'html[data-theme="dark"]',
    }),
    require('autoprefixer'),
  ]
};
```

With the following CSS:
```css
.header {
  background-color: transformColor(primary);
  color: transformColor(secondary);
}
```

The plugin will generate:
```css
.header {
  background-color: var(--primary-color);
  color: var(--secondary-color);
}

html[data-theme="dark"] .header {
  background-color: var(--primary-dark-color);
  color: var(--secondary-dark-color);
}
```

## Options
- **function (string)**: The function name used in your CSS to trigger color transformation. Default is 'transformColor'.

- **groups (object)**: An object where keys are group names and values are arrays of two colors: the first for light theme, and the second for dark theme.

- **colors (object)**: An optional object that maps color names to actual color values or CSS variables.

- **useCustomProperties (boolean)**: If set to true, the plugin will treat the group values as CSS custom properties (variables). Default is false.

- **darkThemeSelector (string)**: The selector for dark theme styles. Default is 'html[data-theme="dark"]'.

- **nestingPlugin (string or null)**: If you're using a nesting plugin like postcss-nesting or postcss-nested, specify its name here. This allows the plugin to correctly generate nested styles.

## Error Handling
If the plugin encounters an invalid color value or group, it will throw an error and stop processing. Ensure that all color groups are properly defined and that any defaultValue passed to the transformColor function is a valid CSS color.

## License
This project is licensed under the MIT License - see the [LICENSE](https://choosealicense.com/licenses/) file for details.

## Support
If you encounter any issues or have questions, feel free to open an issue on the GitHub repository.
