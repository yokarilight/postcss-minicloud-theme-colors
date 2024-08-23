const postcss = require('postcss');

const defaults = {
  'function': 'transformColor',
  'groups': {},
  'colors': {},
  'useCustomProperties': false,
  'darkThemeSelector': 'html[data-theme="dark"]',
  'nestingPlugin': null,
};

const transformColor = (options, theme, group, defaultValue) => {
  const [lightColor, darkColor] = options.groups[group] || [];
  const color = theme === 'dark' ? darkColor : lightColor;
  if (!color) {
    return defaultValue;
  }

  if (options.useCustomProperties) {
    return color.startsWith('--') ? `var(${color})` : color;
  }

  return options.colors[color] || defaultValue;
};

module.exports = postcss.plugin('postcss-minicloud-theme-color', (options) => {
  options = Object.assign({}, defaults, options);

  const reGroup = new RegExp(`\\b${options.function}\\(([^)]+)\\)`, 'g');

  return (style, result) => {
    const hasPlugin = (name) => {
      const cleanName = name.replace(/^postcss-/, '');
      return cleanName === options.nestingPlugin || result.processor.plugins.some((p) => p.postcssPlugin === cleanName);
    };

    const getValue = (value, theme) => {
      return value.replace(reGroup, (match, group) => {
        return transformColor(options, theme, group, match);
      });
    };

    style.walkDecls((decl) => {
      const value = decl.value;

      if (!value || !reGroup.test(value)) {
        return;
      }

      const lightValue = getValue(value, 'light');
      const darkValue = getValue(value, 'dark');

      const darkDecl = decl.clone({ value: darkValue });

      let darkRule;

      if (hasPlugin('nesting')) {
        darkRule = postcss.atRule({
          name: 'nest',
          params: `${options.darkThemeSelector} &`,
        });
      } else if (hasPlugin('nested')) {
        darkRule = postcss.rule({
          selector: `${options.darkThemeSelector} &`,
        });
      } else {
        decl.warn(result, 'Plugin(postcss-nesting or postcss-nested) not found');
      }

      if (darkRule) {
        darkRule.append(darkDecl);
        decl.after(darkRule);
      }

      const lightDecl = decl.clone({ value: lightValue });
      decl.replaceWith(lightDecl);
    });
  };
});
