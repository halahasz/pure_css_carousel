const path = require("path"),
  MiniCssExtractPlugin = require("mini-css-extract-plugin"),
  UglifyJSPlugin = require("uglifyjs-webpack-plugin"),
  OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin"),
  BrowserSyncPlugin = require("browser-sync-webpack-plugin"),
  // StyleLintPlugin = require("stylelint-webpack-plugin"),
  SpriteLoaderPlugin = require("svg-sprite-loader/plugin");
// WriteFilePlugin = require("write-file-webpack-plugin");

module.exports = {
  context: __dirname,
  entry: {
    main: ["./index.js"]
  },
  output: {
    path: path.resolve(__dirname, "assets/js"),
    filename: "[name]-bundle.js"
  },
  mode: "development",
  devtool: "source-map",
  module: {
    rules: [
      {
        enforce: "pre",
        exclude: /node_modules/,
        test: /\.jsx$/,
        loader: "eslint-loader"
      },
      {
        test: /\.jsx?$/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              [
                "@babel/env",
                {
                  targets: {
                    browsers: ["last 2 versions"]
                  }
                }
              ]
            ]
          }
        }
      },
      {
        test: /\.s?css$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
            options: {
              sourceMap: true
            }
          },
          {
            loader: "postcss-loader",
            options: {
              sourceMap: "inline",
              plugins: () => [
                require("autoprefixer")({
                  browsers: ["last 3 versions", ">0%"]
                })
              ]
            }
          },
          {
            loader: "sass-loader",
            options: {
              sourceMap: true
            }
          }
        ]
      },
      {
        test: /\.svg$/,
        loader: "svg-sprite-loader",
        options: {
          extract: true,
          spriteFilename: "svg-defs.svg"
        }
      },
      {
        test: /\.(jpe?g|png|gif|ico|svg|webm|mp4)$/,
        use: [
          {
            loader: "file-loader",
            options: {
              outputPath: "../img/",
              name: "[name].[ext]"
            }
          },
          "img-loader"
        ]
      }
    ]
  },
  plugins: [
    // new StyleLintPlugin(),
    // new WriteFilePlugin(),
    new MiniCssExtractPlugin({ filename: "../css/style.css" }),
    new SpriteLoaderPlugin(),
    new BrowserSyncPlugin({
      // browse to http://localhost:3000/ during development,
      // ./public directory is being served
      host: 'localhost',
      port: 3000,
      files: ['./*.html'],
      server: {
        baseDir: ['./']
      }
    }),
  ],
  optimization: {
    minimizer: [new UglifyJSPlugin(), new OptimizeCssAssetsPlugin()]
  }
};
