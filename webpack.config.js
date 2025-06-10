import svgr from 'vite-plugin-svgr';

module.exports = {
  module: {
    rules: [
      {
        test: /\.svg$/,
        use: [svgr(), 'url-loader'],
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
        use: [
          {
            loader: 'file-loader',
          },
        ],
      },
    ],
  },
};
