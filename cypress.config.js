const { defineConfig } = require('cypress');

module.exports = defineConfig({
  component: {
    devServer: {
      framework: 'react',
      bundler: 'webpack',
      webpackConfig: {
        resolve: {
          extensions: ['.js', '.jsx', '.ts', '.tsx'],
        },
        module: {
          rules: [
            {
              test: /\.(js|jsx|ts|tsx)$/,
              exclude: /node_modules/,
              use: {
                loader: 'babel-loader',
                options: {
                  presets: ['@babel/preset-env', '@babel/preset-react'],
                },
              },
            },
            {
              test: /\.css$/, // Add this rule to handle CSS files
              use: ['style-loader', 'css-loader'],
            },
          ],
        },
      },
    },
  },
  e2e: {
    baseUrl: 'http://localhost:5173', // Point to your React app's URL
    supportFile: false,
  },
});