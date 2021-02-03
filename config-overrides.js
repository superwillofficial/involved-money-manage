const {
  override,
  useBabelRc,
  useEslintRc,
  addLessLoader,
  addWebpackAlias,
  fixBabelImports,
  addPostcssPlugins,
  addWebpackPlugin,
} = require('customize-cra');

const path = require('path');
const AntdDayjsWebpackPlugin = require('antd-dayjs-webpack-plugin');
const px2rem = require('postcss-px2rem');
const autoprefixer = require('autoprefixer');
const modifyVars = require('./src/config/modifyVars');

// 路径别名配置
const alias = {
  ["@assets"]: path.resolve(__dirname, "src/assets"),
  ["@config"]: path.resolve(__dirname, "src/config"),
  ["@components"]: path.resolve(__dirname, "src/components"),
  ["@pages"]: path.resolve(__dirname, "src/pages"),
  ["@routes"]: path.resolve(__dirname, "src/routes"),
  ["@stores"]: path.resolve(__dirname, "src/stores"),
  ["@utils"]: path.resolve(__dirname, "src/utils"),
};

// postcss插件配置
const postcssPlugins = [
  autoprefixer({
    browsers: ['last 2 versions', 'not ie <= 8', 'iOS 7'],
    remove: true,
  }),
  px2rem({ remUnit: 75 }),
];

module.exports = override(
  fixBabelImports('import', {
    libraryName: 'antd',
    libraryDirectory: 'es',
    style: 'css',
  }),
  addLessLoader({
    javascriptEnabled: true,
    modifyVars,
  }),
  useBabelRc(),
  useEslintRc(),
  addWebpackAlias(alias),
  addPostcssPlugins(postcssPlugins),
  addWebpackPlugin(new AntdDayjsWebpackPlugin()),
);
