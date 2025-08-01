import path from "path"
import MiniCssExtractPlugin from "mini-css-extract-plugin"
import webpack from "webpack"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default (env, argv) => {
  const isProduction = argv.mode === "production"

  return {
    mode: argv.mode || "development",
    entry: {
      index: "./src/index.ts",
      auth: "./src/auth.ts",
      addFunds: "./src/addFunds.ts",
      affiliates: "./src/affiliates.ts",
      business: "./src/business.ts",
      shared: "./src/shared.ts",
      pass: "./src/pass.ts",
      custom: "./src/custom.ts",
      storefront: "./src/storefront.ts",
      tokens: "./src/tokens.ts",
      dashboard: "./src/dashboard.ts",
      style: "./src/style.css",
      checkout: "./src/checkout.ts",
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: "[name].css",
        chunkFilename: "[name].[contenthash].css",
      }),
      new webpack.ProvidePlugin({
        process: "process/browser.js",
      }),
      new webpack.EnvironmentPlugin({
        NEXTAUTH_URL: "",
        NEXT_PUBLIC_BASE_URL: "http://localhost:3000",
        NEXT_PUBLIC_ENVIRONMENT: "developmento",
        NEXT_PUBLIC_NEXTAUTH_SECRET: "",
        NEXT_PUBLIC_BUILD_PATH: "/",
        NEXT_PUBLIC_PDF_API_URL: "https://pdf.w3block.io/",
        GITHUB_TOKEN: "",
        NEXT_PUBLIC_COMMERCE_API_URL: "https://commerce.w3block.io",
        NEXT_PUBLIC_PIXWAY_ID_API_URL: "https://pixwayid.w3block.io/",
        NEXT_PUBLIC_PIXWAY_KEY_API_URL: "https://api.w3block.io/",
        NEXT_PUBLIC_POLL_API_URL: "https://survey.w3block.io/",
        NEXT_PUBLIC_PASS_API_URL: "https://pass.w3block.io/ ",
        NEXT_PUBLIC_GOOGLE_API_KEY: "",
      }),
    ],
    optimization: {
      splitChunks: {
        cacheGroups: {
          styles: {
            name: "styles",
            type: "css/mini-extract",
            chunks: "all",
            enforce: true,
          },
        },
      },
    },
    output: {
      path: path.resolve(__dirname, "dist"),
      filename: "[name].js",
      library: {
        type: "module",
      },
      clean: isProduction,
      assetModuleFilename: "assets/[hash][ext][query]",
    },
    watchOptions: {
      ignored: /node_modules/,
      poll: 500,
      aggregateTimeout: 300,
      followSymlinks: true,
    },
    experiments: {
      outputModule: true,
    },
    externals: {
      react: "react",
      "react-dom": "react-dom",
      "react/jsx-runtime": "react/jsx-runtime",
      "react/jsx-dev-runtime": "react/jsx-dev-runtime",
      "swiper/react": "swiper/react",
      swiper: "swiper",
      "@tanstack/react-query": "@tanstack/react-query",
      "@tanstack/query-core": "@tanstack/query-core",
      next: "next",
      "next-auth": "next-auth",
      "@w3block/w3block-ui-sdk": "@w3block/w3block-ui-sdk",
    },
    resolve: {
      extensions: [".js", ".jsx", ".ts", ".tsx", ".svg", ".png"],
      alias: {
        "swiper/css": path.resolve(__dirname, "node_modules/swiper/swiper.min.css"),
        react: path.resolve(__dirname, "node_modules/react"),
        "react-dom": path.resolve(__dirname, "node_modules/react-dom"),
      },
      fallback: {
        zlib: false,
        stream: false,
        fs: false,
      },
      symlinks: false,
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: "ts-loader",
          exclude: /node_modules/,
        },
        {
          test: /\.svg$/,
          issuer: /\.[jt]sx?$/,
          use: [
            {
              loader: "@svgr/webpack",
              options: {
                typescript: true,
                ext: "tsx",
                svgoConfig: {
                  plugins: [
                    {
                      name: "preset-default",
                      params: {
                        overrides: {
                          removeViewBox: false,
                        },
                      },
                    },
                  ],
                },
              },
            },
          ],
        },
        {
          test: /\.(png|jpe?g|gif|ico)$/,
          use: [
            {
              loader: "file-loader",
              options: {
                publicPath: "/_next/static/images/",
                outputPath: "static/images/",
              },
            },
          ],
        },
        {
          test: /\.css$/,
          use: [
            MiniCssExtractPlugin.loader,
            {
              loader: "css-loader",
              options: {
                url: false,
                import: false,
              },
            },
            {
              loader: "postcss-loader",
              options: {
                postcssOptions: {
                  plugins: ["tailwindcss", "autoprefixer"],
                },
              },
            },
          ],
        },
      ],
    },
  }
}
