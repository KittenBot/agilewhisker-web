// custom webpack config, mostly for antd pro-chat dependencies
export default async function webpackFix(context, options) {
    return {
      name: 'custom-webpack',
      configureWebpack(config, isServer, utils) {
        return {
          resolve: {
            fallback: {
              buffer: require.resolve('buffer/'),
              "stream": require.resolve("stream-browserify")
            }
          },
          plugins: [
            new (require('webpack')).ProvidePlugin({
              Buffer: ['buffer', 'Buffer'],
            }),
          ],
        };
      },
    };
  };