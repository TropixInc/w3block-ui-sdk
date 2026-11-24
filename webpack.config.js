import path from "path"
import MiniCssExtractPlugin from "mini-css-extract-plugin"
import webpack from "webpack"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default (env, argv) => {
  const isProduction = argv.mode === "production"

  // Packages the host app must provide. Matched by exact name or by sub-path
  // (next/link, swiper/modules, react-dom/client, ...), so none of them is bundled.
  const externalPackages = [
    "react",
    "react-dom",
    "swiper",
    "@tanstack/react-query",
    "@tanstack/query-core",
    "next",
    "next-auth",
    "@w3block/w3block-ui-sdk",
  ]
  const isExternal = (request) =>
    externalPackages.some((pkg) => request === pkg || request.startsWith(pkg + "/"))

  return {
    mode: argv.mode || "development",
    // eval-based devtools inflate the output ~4x; production ships no source maps.
    devtool: isProduction ? false : "eval",
    entry: {
      index: "./src/index.ts",
      auth: "./src/auth.ts",
      core: "./src/core.ts",
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
      notifications: "./src/notifications.ts"
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
        NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: "tropix",
        NEXT_PUBLIC_GOOGLE_API_KEY: "",
      }),
    ],
    optimization: {
      // One runtime (module cache) for every entry, so `index`, `auth`, `checkout`...
      // share a single instance of MUI, emotion, ethers, date-fns... instead of
      // each entry bundling its own copy.
      runtimeChunk: "single",
      splitChunks: {
        chunks: "all",
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
      // Entries keep their public names; the shared chunks they import go to dist/chunks.
      filename: ({ chunk }) => (chunk.name ? "[name].js" : "chunks/[id].js"),
      chunkFilename: "chunks/[id].js",
      library: {
        type: "module",
      },
      // `prebuild` already cleans dist; webpack must not wipe the assets copied before it runs.
      clean: false,
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
    externalsType: "module",
    externals: [
      ({ request }, callback) => {
        if (request && isExternal(request)) return callback(null, request)
        callback()
      },
    ],
    resolve: {
      extensions: [".js", ".jsx", ".ts", ".tsx", ".svg", ".png"],
      alias: {
        "swiper/css": path.resolve(__dirname, "node_modules/swiper/swiper.min.css"),
        react: path.resolve(__dirname, "node_modules/react"),
        "react-dom": path.resolve(__dirname, "node_modules/react-dom"),
        "date-fns": path.resolve(__dirname, "node_modules/date-fns"),
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
          type: 'asset',
          parser: {
            dataUrlCondition: {
              maxSize: 8 * 1024 // 8kb
            }
          },
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
