// Dynamic theme/palette resolver — used by ~60/67 projects
// Exported from config.js as: { theme: string, colors: { primary, secondary, accent, ... } }

export function resolveTheme(selectedTheme, availableThemes) {
  if (!availableThemes[selectedTheme]) {
    return availableThemes[Object.keys(availableThemes)[0]];
  }
  return availableThemes[selectedTheme];
}

export function useTheme(userDataTheme, themeConfig) {
  const theme = resolveTheme(userDataTheme, themeConfig.themes);
  return {
    ...theme,
    css: generateCSSVariables(theme)
  };
}

function generateCSSVariables(theme) {
  return Object.entries(theme).reduce((acc, [key, value]) => {
    if (typeof value === 'string' && /^#|rgb/.test(value)) {
      acc[`--color-${key}`] = value;
    }
    return acc;
  }, {});
}

export const themeTypes = {
  DARK: 'dark',
  LIGHT: 'light',
  NEON: 'neon',
  PASTEL: 'pastel'
};
