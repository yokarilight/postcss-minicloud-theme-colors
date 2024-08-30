import postcss, { AtRule, Rule, Plugin } from 'postcss';
import { isColor } from './utils/index';

interface PluginOptions {
  function?: string;
  groups?: Record<string, [string, string]>;
  colors?: Record<string, string>;
  useCustomProperties?: boolean;
  darkThemeSelector?: string;
  nestingPlugin?: string | null;
}

const defaults: PluginOptions  = {
  'function': 'transformColor',
  'groups': {},
  'colors': {},
  'useCustomProperties': false,
  'darkThemeSelector': 'html[data-theme="dark"]',
  'nestingPlugin': null,
};

const transformColor = (options: PluginOptions, theme: string, group: string, defaultValue: string) => {
  const [lightColor, darkColor] = options.groups?.[group] || [];
  const color = theme === 'dark' ? darkColor : lightColor;
  if (!color) {
    if (isColor(defaultValue)) {
      return defaultValue;
    }

    throw new Error(`The color ${defaultValue} is invalid`);
  }

  if (options.useCustomProperties) {
    return color.startsWith('--') ? `var(${color})` : color;
  }

  return options.colors?.[color] || color;
};

const minicloudThemeColor = (options?: PluginOptions): Plugin => {
  options = { ...defaults, ...options };

  const reGroup = new RegExp(`\\b${options.function}\\(([^)]+)\\)`, 'g');

  return {
    postcssPlugin: 'postcss-minicloud-theme-color',
    Once(root, { result }) {
      const hasPlugin = (name: string) => {
        const cleanName = name.replace(/^postcss-/, '');
        return cleanName === options.nestingPlugin || result.processor.plugins.some((p) => {
          const plugin = p as { postcssPlugin?: string };

          return plugin.postcssPlugin === cleanName;
        });
      };
  
      const getValue = (value: string, theme: string) => {
        return value.replace(reGroup, (match, group) => {
          try {
            return transformColor(options, theme, group, match);
          } catch (err) {
            const error = err as Error;
            throw root.error(error.message, { plugin: 'postcss-minicloud-theme-color', word: group });
          }
        });
      };

      root.walkDecls((decl) => {
        const value = decl.value;
  
        if (!value || !reGroup.test(value)) {
          return;
        }
  
        const lightValue = getValue(value, 'light');
        const darkValue = getValue(value, 'dark');
  
        const darkDecl = decl.clone({ value: darkValue });
  
        let darkRule: AtRule | Rule | undefined;
  
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
    }
  }
};

minicloudThemeColor.postcss = true;
export default minicloudThemeColor;
