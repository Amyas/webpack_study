const path = require("path");
const webpack = require("webpack");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

let pages = ["index", "base"];
pages = pages.map(
  page =>
    new HtmlWebpackPlugin({
      // 指定产出的html模板
      template: "./src/index.html",
      // 产出的文件名
      filename: `${page}.html`,
      // 将引入的js文件添加 hash 值
      hash: true,
      // 产出的html引入哪些代码块(entry 指定的代码块名称)
      // chunks: ["index", "common", "vendor"],
      chunks: ["common", `${page}`],
      minify: {
        // 删除标签双引号
        removeAttributeQuotes: true
      },
      // 产出自定义变量
      // 通过 <p><%=htmlWebpackPlugin.options.content%></p> 方式使用
      title: `${page}`,
      content: `这是一段自定义内容${page}`
    })
);

module.exports = {
  // 单入口
  // entry: "./src/index.js",
  // 多入口打包到一个文件中
  // entry: ["./src/index.js", "./src/base.js"],
  // 多入口打包到各自文件中
  entry: {
    index: "./src/index.js",
    base: "./src/base.js",
    // 这是一个入口，引用jquery
    // vendor: "jquery",
    common: "./src/common.js"
  },
  // 出口
  output: {
    // 出入的文件夹，只能是绝对路径
    path: path.join(__dirname, "dist"),
    // 打包后的文件名
    // filename: "bundle.js"
    // 打包 hash 值的文件
    // :8 代表只取 hash 前8位
    filename: "[name].[hash:8].js"
  },
  module: {
    rules: [
      {
        // 转换文件的匹配规则
        test: /\.css$/,
        // css-loader 用来解析处理 css 文件中的 url 路径，把 css 文件变成一个模块
        // style-loader 可以把 css 文件变成 style 标签插入 heade 中
        // 多个 loader 是有顺序要求的，从右往左执行转换
        loader: ["style-loader", "css-loader"]
      },
      {
        test: require.resolve("jquery"),
        use: {
          loader: "expose-loader",
          options: "$"
        }
      }
    ]
  },
  plugins: [
    // 用来自动向模块内部注入变量
    // new webpack.ProvidePlugin({
    //   $: "jquery"
    // }),
    // 清空dist文件夹
    new CleanWebpackPlugin(),
    // 此插件可以自动产出html文件，并将 ouput 打包文件插入模板中
    ...pages
    // new HtmlWebpackPlugin({
    //   // 指定产出的html模板
    //   template: "./src/index.html",
    //   // 产出的文件名
    //   filename: "base.html",
    //   // 将引入的js文件添加 hash 值
    //   hash: true,
    //   // 产出的html引入哪些代码块(entry 指定的代码块名称)
    //   // chunks: ["base", "common", "vendor"],
    //   chunks: ["base", "common"],
    //   minify: {
    //     // 删除标签双引号
    //     removeAttributeQuotes: true
    //   },
    //   // 产出自定义变量
    //   // 通过 <p><%=htmlWebpackPlugin.options.content%></p> 方式使用
    //   title: "base",
    //   content: "这是一段自定义内容base"
    // })
  ],
  // 配置此静态文件服务器，可以用来预览打包后的项目
  devServer: {
    contentBase: "./dist",
    host: "localhost",
    port: "8002",
    // 服务器返回给浏览器的时候是否启动gzip压缩
    compress: true
  }
};
