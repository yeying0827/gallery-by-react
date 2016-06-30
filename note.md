node_modules: 项目编译所需node组件所在的包
src:源代码所在目录
test:测试代码所在目录

editConfig(用来统一不同的编辑器、IDE的编码风格)
配置文件：.editorconfig
配置文件生效的前提:所用的编辑器或者IDE安装了支持editconfig配置文件的插件
editconfig.org

eslintrc
*lint,*hint 代码风格检测工具
jshintrc 不支持jax语法
eslint默认规则包含所有jshint中存在的规则，并且支持jax

yo-rc.json
yeoman的配置文件，用来记录当前项目的一些信息

karma.conf.js
karma测试框架的文件

package.json
node项目的配置文件，声明当前项目的一些信息都依赖了哪些npm包等

webpack.config.js
webpack开发环境和生产环境的配置文件

server.js+cfg目录
自动化编译的配置文件

npm install -g webpack
通过 npm install -g webpack 方式安装webpack的话，可以通过命令行直接执行打包命令
打包：webpack --config webpack.config.js

npm install -g webpack-dev-server
webpack 提供了一个 webpack-dev-server 服务器
webpack-dev-server

npm install --save-dev react-hot-loader

require指令
commonjs规范规定一个单独的文件就是一个模块，每一个模块都是一个单独的作用域
定义的变量、函数和类，都是私有的，对其他文件是不可见的
暴露模块：通过module.exports，将我们希望暴露的内容暴露出去，这个对象的所有属性和方法都可以被其他文件导入


打包后：
css文件最终被以内嵌的方式嵌入到最终生成的js文件里，这种生成的js文件往往被称为js bundle。
当引用的图片文件过小的时候，webpack会以base64的方式来嵌入这个图片，否则按照传统的url方式引入这个文件

webpack-dev-server：就是封装了一个express server，然后提供了一个webpack相关的middleware，来提供webpack bundle的服务。
就是webpack配上了一个服务器

