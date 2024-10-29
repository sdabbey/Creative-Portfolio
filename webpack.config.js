module.exports = {
    // Other webpack config options...
    module: {
      rules: [
        {
          test: /\.m?js/,
          resolve: {
            fullySpecified: false,
          },
          enforce: 'pre',
          use: ['source-map-loader'],
          exclude: /node_modules\/@mediapipe\/tasks-vision\//,  // Exclude the problematic package
        },
      ],
    },
  };
  