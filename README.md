# webpack_template
常用 webpack 配置模板。基于最新的 webpack4, babel7。

# 本示例用来演示如何用 webpack 来打包类库

1. 要达到的效果是，类库的打包和发布是独立的。
2. 使用的时候，动态加载。

# 配置文件说明

1. webpack.config.js 是正常的应用
2. webpack.lib.js 是打类库

# 示例功能

1. 在`antd`之上开发了自己的一套业务组件，想把组件抽取出来，自行发布安装
2. 业务在使用中按需加载

