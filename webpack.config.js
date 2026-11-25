const path = require('path');
const fs = require('fs');
const HtmlWebpackPlugin = require('html-webpack-plugin');

class CopyStaticFilesPlugin {
  apply(compiler) {
    compiler.hooks.afterEmit.tap('CopyStaticFilesPlugin', (compilation) => {
      const sourceDir = path.resolve(__dirname, 'src');
      const outputDir = compilation.outputOptions.path;

      const copyDirectory = (currentSource, currentOutput, isRoot = false) => {
        fs.mkdirSync(currentOutput, { recursive: true });
        for (const entry of fs.readdirSync(currentSource, { withFileTypes: true })) {
          if (entry.name === '.qodo' || (isRoot && entry.name === 'index.html')) continue;

          const sourcePath = path.join(currentSource, entry.name);
          const outputPath = path.join(currentOutput, entry.name);
          if (entry.isDirectory()) {
            copyDirectory(sourcePath, outputPath);
          } else {
            fs.copyFileSync(sourcePath, outputPath);
          }
        }
      };

      copyDirectory(sourceDir, outputDir, true);
    });
  }
}

// Base config that applies to either development or production mode.
const config = {
  entry: './src/index.js',
  output: {
    // Compile the source files into a bundle.
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
  // Enable webpack-dev-server to get hot refresh of the app.
  devServer: {
    static: './src',
  },
  module: {
    rules: [
      {
        // Load CSS files. They can be imported into JS files.
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  plugins: [
    // Generate the HTML index page based on our template.
    // This will output the same index page with the bundle we
    // created above added in a script tag.
    new HtmlWebpackPlugin({
      template: 'src/index.html',
    }),
    new CopyStaticFilesPlugin(),
  ],
};

module.exports = (env, argv) => {
  if (argv.mode === 'development') {
    // Set the output path to the `build` directory
    // so we don't clobber production builds.
    config.output.path = path.resolve(__dirname, 'build');

    // Generate source maps for our code for easier debugging.
    // Not suitable for production builds. If you want source maps in
    // production, choose a different one from https://webpack.js.org/configuration/devtool
    config.devtool = 'eval-cheap-module-source-map';

    // Include the source maps for Blockly for easier debugging Blockly code.
    config.module.rules.push({
      test: /(blockly\/.*\.js)$/,
      use: [require.resolve('source-map-loader')],
      enforce: 'pre',
    });

    // Ignore spurious warnings from source-map-loader
    // It can't find source maps for some Closure modules and that is expected
    config.ignoreWarnings = [/Failed to parse source map/];
  }
  return config;
};
