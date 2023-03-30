import semver from 'semver';
import { TransformOptions } from '@babel/core';
// @ts-ignore
import presetEnv from '@babel/preset-env';
// @ts-ignore
import presetReact from '@babel/preset-react';
// @ts-ignore
import presetTypescript from '@babel/preset-typescript';
// @ts-ignore
import pluginSyntaxDynamicImport from '@babel/plugin-syntax-dynamic-import';
// @ts-ignore
import babelPluginTransformTypescriptMetadata from 'babel-plugin-transform-typescript-metadata';
// @ts-ignore
import pluginProposalDecorators from '@babel/plugin-proposal-decorators';
// @ts-ignore
import pluginTransformModulesCommonjs from '@babel/plugin-transform-modules-commonjs';
// @ts-ignore
import babelPluginAddModuleExports from 'babel-plugin-add-module-exports';
// @ts-ignore
import pluginTransformRuntime from '@babel/plugin-transform-runtime';
// @ts-ignore
import babelPluginTransformRemoveImports from 'babel-plugin-transform-remove-imports';
// @ts-ignore
import pluginProposalClassProperties from '@babel/plugin-proposal-class-properties';
// @ts-ignore
import pluginTransformClasses from '@babel/plugin-transform-classes';
// @ts-ignore
import babelPluginTransformRenameImport from 'babel-plugin-transform-rename-import';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const pkgRuntime = require('@babel/runtime/package.json');
const pkgHelpers = require('@babel/helpers/package.json');

// import pkgHelpers from '@babel/helpers/package.json' assert { type: 'json' };
// import pkgRuntime from '@babel/runtime/package.json' assert { type: 'json' };

const runtimeVersion = semver.clean(pkgRuntime.version);

export const getDefaultTransformOption: () => TransformOptions = () => ({
  presets: [
    [
      presetReact.default,
      {
        /**
         * Fix: ReferenceError: React is not defined
         * https://github.com/facebook/create-react-app/issues/9882
         */
        runtime: 'automatic',
      },
    ],
    presetTypescript.default,
  ],
  envName: process.env.BABEL_ENV,
  plugins: [
    pluginSyntaxDynamicImport.default,
    babelPluginTransformTypescriptMetadata.default,
    /**
     * Use the legacy (stage 1) decorators syntax and behavior.
     * https://babeljs.io/docs/en/babel-plugin-proposal-decorators#legacy
     * If you are including your plugins manually and using `@babel/plugin-proposal-class-properties`,
     * make sure that `@babel/plugin-proposal-decorators` comes before `@babel/plugin-proposal-class-properties`.
     */
    [pluginProposalDecorators.default, { legacy: true }],
  ],
});

export const getCjsTransformOption: () => TransformOptions = () => {
  const option: TransformOptions = getDefaultTransformOption();
  option.envName = 'cjs';
  option.presets?.push([
    presetEnv.default,
    {
      modules: 'cjs',
      loose: false,
    },
  ]);
  option.envName = 'cjs';
  const transformRuntime = {
    modules: 'cjs',
    loose: false,
    /**
     * transform-runtime regression, not requiring _objectSpread helper
     * https://github.com/babel/babel/issues/10261#issuecomment-549940457
     */
    version: pkgHelpers.version,
  };
  if (runtimeVersion && !semver.gte(runtimeVersion, '7.13.0')) {
    /**
     * ⚠️ This option has been deprecated: starting from version 7.13.0,
     * @babel/runtime's package.json uses "exports" option to automatically choose between CJS and ESM helpers.
     * https://babeljs.io/docs/en/babel-plugin-transform-runtime#useesmodules
     */
    (transformRuntime as any).useESModules = !semver.gte(runtimeVersion, '7.13.0');
  }
  option.plugins?.push(pluginTransformModulesCommonjs.default);
  option.plugins?.push(babelPluginAddModuleExports);
  option.plugins?.push([pluginTransformRuntime.default, transformRuntime]);
  option.plugins?.push([
    // @ts-ignore
    babelPluginTransformRemoveImports.default,
    {
      test: '\\.(less|css|scss|styl)$',
    },
  ]);
  option.plugins?.push([pluginProposalClassProperties.default, { loose: false }]);
  option.plugins?.push([pluginTransformClasses.default, { loose: false }]);
  return option;
};

export const getESMTransformOption: () => TransformOptions = () => {
  const option: TransformOptions = getDefaultTransformOption();
  option.envName = 'esm';
  option.presets?.push([
    presetEnv.default,
    {
      modules: false,
      loose: true,
      targets: {
        esmodules: true,
      },
    },
  ]);
  option.envName = 'esm';
  const transformRuntime = {
    loose: false,
    modules: 'auto',
    /**
     * transform-runtime regression, not requiring _objectSpread helper
     * https://github.com/babel/babel/issues/10261#issuecomment-549940457
     */
    version: pkgHelpers.version,
  };
  if (runtimeVersion && !semver.gte(runtimeVersion, '7.13.0')) {
    /**
     * ⚠️ This option has been deprecated: starting from version 7.13.0,
     * @babel/runtime's package.json uses "exports" option to automatically choose between CJS and ESM helpers.
     * https://babeljs.io/docs/en/babel-plugin-transform-runtime#useesmodules
     */
    (transformRuntime as any).useESModules = !semver.gte(runtimeVersion, '7.13.0');
  }
  option.plugins?.push([pluginTransformRuntime.default, transformRuntime]);
  option.plugins?.push([pluginProposalClassProperties.default, { loose: true }]);
  option.plugins?.push([
    babelPluginTransformRenameImport.default,
    {
      original: '^(.+?)\\.(less|scss|sass|styl)$',
      replacement: '$1.css',
    },
  ]);
  return option;
};
