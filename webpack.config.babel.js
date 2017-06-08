export default {
  resolve: {
    extensions: ['', '.js', 'jsx'],
  },
  devtool: "cheap-eval-source-map",
  entry: [
    './src/1-signup.jsx', './src/2-confirmregistration.jsx', './src/3-resendconfirmation.jsx', './src/4-signin.jsx',
    './src/5-getuserattributes.jsx', './src/6-verifyuserattribute.jsx', './src/7-deleteuserattribute.jsx', './src/8-updateuserattribute.jsx',
    './src/9-enablemfa.jsx', './src/10-disablemfa.jsx', './src/11-changepwd.jsx', './src/12-forgotpwd.jsx', './src/13-deleteuser.jsx', './src/14-signout.jsx'],
  output: {
  path: 'dist',
    filename: 'main.bundle.js'
  },
  module: {
    loaders: [{
      test: /\.jsx?$/,
      loader: 'babel',
      exclude: /node_modules/,
      query: {
        cacheDirectory: true,
      }
    },
    {
      test: /\.json$/,
      loader: 'json'
    }]
  }
};
