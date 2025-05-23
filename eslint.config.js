import globals from 'globals';
import pluginJs from '@eslint/js';
import pluginPrettier from 'eslint-plugin-prettier';

export default [
  {
    languageOptions: {
      globals: globals.node,
    },
    rules: {
      'prettier/prettier': 'error',
    },
  },
  pluginJs.configs.recommended,
  {
    plugins: {
      prettier: pluginPrettier,
      jest: pluginJest, // ✅ Register Jest plugin
    },
    rules: {
      'prettier/prettier': 'error',
      // optional: add recommended Jest rules
      ...pluginJest.configs.recommended.rules,
    },
  },
  pluginJs.configs.recommended,
];
