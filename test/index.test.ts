import postcss from 'postcss';
import nested from 'postcss-nested';
import plugin from '../index';
import { normalizeCSS } from '../utils/index';

describe('postcss-minicloud-theme-color', () => {
  it('should transform colors for light theme', async () => {
    const inputCSS = `
      .header {
        background-color: transformColor(primary);
        color: transformColor(secondary);
      }
    `;

    const expectedCSS = `
      .header {
        background-color: #ffffff;
        color: #333333;
      }
    `.trim();

    const result = await postcss([
      plugin({
        function: 'transformColor',
        groups: {
          primary: ['#ffffff', '#000000'],
          secondary: ['#333333', '#cccccc'],
        },
      }),
    ]).process(inputCSS, { from: undefined });

    expect(normalizeCSS(result.css)).toBe(normalizeCSS(expectedCSS));
  });

  it('should transform colors for dark theme', async () => {
    const inputCSS = `
      .header {
        background-color: transformColor(primary);
        color: transformColor(secondary);
      }
    `;

    const result = await postcss([
      nested,
      plugin({
        function: 'transformColor',
        groups: {
          primary: ['#ffffff', '#000000'],
          secondary: ['#333333', '#cccccc'],
        },
        useCustomProperties: false,
        darkThemeSelector: 'html[data-theme="dark"]',
        nestingPlugin: 'nested',
      }),
    ]).process(inputCSS, { from: undefined });

    expect(normalizeCSS(result.css)).toContain('html[data-theme=\"dark\"].header{background-color:#000000;}');
    expect(normalizeCSS(result.css)).toContain('html[data-theme=\"dark\"].header{color:#cccccc;}');
    expect(result.warnings().length).toBe(0);
  });

  it('should correctly handle custom properties with --', async () => {
    const inputCSS = `
      .header {
        background-color: transformColor(primary);
        color: transformColor(secondary);
      }
    `;

    const result = await postcss([
      nested,
      plugin({
        function: 'transformColor',
        groups: {
          primary: ['--primary-color', '--primary-dark-color'],
          secondary: ['--secondary-color', '--secondary-dark-color'],
        },
        useCustomProperties: true,
        darkThemeSelector: 'html[data-theme="dark"]',
        nestingPlugin: 'nested',
      }),
    ]).process(inputCSS, { from: undefined });

    expect(normalizeCSS(result.css)).toContain('.header{background-color:var(--primary-color);}');
    expect(normalizeCSS(result.css)).toContain('.header{color:var(--secondary-color);}');
    expect(normalizeCSS(result.css)).toContain('html[data-theme=\"dark\"].header{background-color:var(--primary-dark-color);}');
    expect(normalizeCSS(result.css)).toContain('html[data-theme=\"dark\"].header{color:var(--secondary-dark-color);}');
  });

  it('not install postcss- nesting or postcss-nested', async () => {
    const inputCSS = `
      .header {
        background-color: transformColor(primary);
      }
    `;

    const expectedCSS = `
      .header {
        background-color: #ffffff;
      }
    `;

    const result = await postcss([
      plugin({
        function: 'transformColor',
        groups: {
          primary: ['#ffffff', '#000000'],
        },
      }),
    ]).process(inputCSS, { from: undefined });

    expect(normalizeCSS(result.css)).toBe(normalizeCSS(expectedCSS));
    expect(result.warnings().length).toBe(1);
    expect(result.warnings()[0].text).toMatch('Plugin(postcss-nesting or postcss-nested) not found');
  });

  it('should issue a warning when no color group is found', async () => {
    const inputCSS = `
      .header {
        background-color: transformColor(nonexistent);
      }
    `;

    try {
      const result = await postcss([
        nested,
        plugin({
          function: 'transformColor',
          groups: {
            primary: ['#ffffff', '#000000'],
          },
          useCustomProperties: false,
          darkThemeSelector: 'html[data-theme="dark"]',
          nestingPlugin: 'nested',
        }),
      ]).process(inputCSS, { from: undefined });
    } catch (err) {
      const error = err as Error;
      expect(error.message).toContain('The color transformColor(nonexistent) is invalid');
    }
  });
});
