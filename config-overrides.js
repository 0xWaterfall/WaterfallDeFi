const {
  override,
  addBabelPlugin,
  removeModuleScopePlugin,
  fixBabelImports,
  addWebpackPlugin,
  addDecoratorsLegacy
} = require("customize-cra");
const AntdDayjsWebpackPlugin = require("antd-dayjs-webpack-plugin");
const LodashWebpackPlugin = require("lodash-webpack-plugin");
module.exports = {
  webpack: override(
    removeModuleScopePlugin(),
    addDecoratorsLegacy(),
    fixBabelImports("antd", {
      libraryName: "antd",
      libraryDirectory: "es",
      style: "css"
    }),
    fixBabelImports("ahooks", {
      libraryName: "ahooks",
      libraryDirectory: "es",
      camel2DashComponentName: false
    }),
    addBabelPlugin([
      "import",
      {
        libraryName: "lodash",
        customName: (name) => `lodash/${name.match(/(?!_).*/)[0]}`
      },
      "lodash"
    ]),
    addWebpackPlugin(
      new LodashWebpackPlugin({
        collections: true,
        paths: true
      })
    ),
    addWebpackPlugin(new AntdDayjsWebpackPlugin()),
    addBabelPlugin([
      "formatjs",
      {
        idInterpolationPattern: "[sha512:contenthash:base64:6]",
        ast: true
      }
    ])
  )
};
