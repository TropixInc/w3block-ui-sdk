import path from 'path';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default (env, argv) => {
  const isProduction = argv.mode === 'production';
  const isDevelopment = !isProduction;
  return {
    mode: argv.mode || 'development',
    // watch: isDevelopment,
    entry: {
      index: './src/index.ts',
      auth: './src/auth.ts',
      style: './src/style.css',
    },

    plugins: [
      new MiniCssExtractPlugin({
        filename: 'style.css',
      }),
    ],

    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: '[name].js',
      library: {
        type: 'module',
      },
      clean: isProduction,
      assetModuleFilename: 'assets/[hash][ext][query]',
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
      react: 'react',
      'react-dom': 'react-dom',
      'react/jsx-runtime': 'react/jsx-runtime',
      'react/jsx-dev-runtime': 'react/jsx-dev-runtime',
      'swiper/react': 'swiper/react',
      swiper: 'swiper',
      '@tanstack/react-query': '@tanstack/react-query',
      '@tanstack/query-core': '@tanstack/query-core',
    },

    resolve: {
      extensions: ['.js', '.jsx', '.ts', '.tsx', '.svg'],
      alias: {
        'swiper/css': path.resolve(
          __dirname,
          'node_modules/swiper/swiper.min.css'
        ),
      },
    },

    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
          exclude: /node_modules/,
        },
        {
          test: /\.svg$/,
          issuer: /\.[jt]sx?$/,
          use: [
            {
              loader: '@svgr/webpack',
              options: {
                typescript: true,
                ext: 'tsx',
                svgoConfig: {
                  plugins: [
                    {
                      name: 'preset-default',
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
              loader: 'file-loader',
              options: {
                publicPath: '/_next/static/images/',
                outputPath: 'static/images/',
              },
            },
          ],
        },
         {
          test: /\.css$/,
          use: [
            MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader',
              options: {
                url: false,
                import: false,
              }
            },
            {
              loader: 'postcss-loader',
              options: {
                postcssOptions: {
                  plugins: [
                    'tailwindcss',
                    'autoprefixer',
                  ],
                },
              },
            },
          ]
        },
      ],
    },
  };
};
