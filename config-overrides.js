const {
  override,
  addBabelPlugin,
  removeModuleScopePlugin,
  fixBabelImports,
  addWebpackPlugin,
  addDecoratorsLegacy
} = require("customize-cra");

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
    // addBabelPlugin([
    //   "import",
    //   {
    //     libraryName: "lodash",
    //     customName: (name) => `lodash/${name.match(/(?!_).*/)[0]}`
    //   },
    //   "lodash"
    // ]),
    addBabelPlugin([
      "import",
      {
        libraryName: "lodash",
        libraryDirectory: "",
        camel2DashComponentName: false
      },
      "lodash"
    ]),
    addBabelPlugin([
      "formatjs",
      {
        idInterpolationPattern: "[sha512:contenthash:base64:6]",
        ast: true
      }
    ]),
    addWebpackPlugin(
      new LodashWebpackPlugin({
        collections: true,
        paths: true
      })
    )
  )
};
