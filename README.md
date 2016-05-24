# Dt.js 说明文档

团队原本使用 `FIS3`（[百度FIS3的官方文档](http://fis.baidu.com/fis3/index.html)） 作为前端工程化的构建工具，它的确为我们解决了一些问题，但作为一个主要业务是**给其它团队输出静态页面**的前端组，`FIS3` 没在开发效率上给团队带来多大的提升，这时才想到自己写一款适合团队业务与开发方式的前端工程化构建工具，来解决团队现在开发方式的一些问题。

```bash
#安装
npm install -g dtjs #暂没有发布到npm
```

> `Dt.js` 是基于 `FIS3` 开发的，所有的命令，操作，语法基本和是一致的，所以此处不会过多的介绍 api，只提及些关键的问题。
> 
> * [百度FIS3的官方文档](http://fis.baidu.com/fis3/index.html)
> * [Dt.js文档地址](http://dtjsfm.duapp.com/)

## 例子

这里有一个简单的例子，例子的 [地址](https://github.com/dante1977/dtjs/tree/master/simple)。进入项目根目录，执行命令，进行构建。

```bash
# 相当于 fis 的 release 命令
dtjs output
```

## Dt.js解决的问题

### 第一个问题：页面组件化开发

页面组件化开发，使得团队中开发的代码可以复用，积累，在一个主要业务是**给其它团队输出静态页面**的前端组中，这是亟待解决的问题。而 `Dt.js` 的解决方案主要是参考了京东的前端构建化工具 `JDF`（[京东JDF的Github地址](https://github.com/putaoshu/jdf)）的 `widget` 功能。

> 有关页面组件化开发的介绍，很多文章介绍，可以扩展阅读：
> 
> * [前端工程——基础篇](https://github.com/fouber/blog/blob/master/201508/01.md#第一件事组件化开发)
> * [JDF widget模块 -- 生态圈](https://github.com/putaoshu/jdf/blob/master/doc/core_widget.md)

#### 1. 项目目录结构及引用

    project
	  - html 
	  - js
	  - css
	  - widget
	    - header   #可复用的header组件及代码
	        - header.html
	        - header.js
	        - header.css

```html
<!-- 引用相对的路径，如当前文件在 html 文件夹中 -->
<widget href="../widget/header/header.html" />
```

#### 2. 发布到服务中

```bash
dtjs widget -publish header
```

#### 3. 在新项目中复用（安装）

```bash
dtjs widget -install header
```

#### 4. 可视化布局工具

> 关于可视化布局工具，可以看看Bootstrap的一款可视化布局工具：layoutit [地址](http://www.bootcss.com/p/layoutit/)。

**暂时还没有实现该功能**

### 第二个问题：定位资源

团队输出页面给其它组，不同的组因为开发语言的关系，文件需要放置的目录结构也是大不相同（拿基于express的nodejs web应用为例子，js, css, img文件会放到 public 里，模板文件放到 view 目录下），或者其它组同事要求的目录结构。所有需要定位资源来解决问题，让前端组不需要考虑其它组的目录结构，但又可以生成其它组需求的目录结构。

#### 1. 如上面的项目需要部署成以下的目录结构为例

	project
      - public
        - 项目名
          - 1.0.0    1.0.0版本的静态资源都构建到这里
          - 1.0.1    1.0.1版本的静态资源都构建到这里
          ...
      - views
        - 项目名
          - 1.0.0    1.0.0版本的后端模板都构建到这里
          - 1.0.1    1.0.1版本的后端模板都构建到这里
          ...

#### 2. dtjs.config.js的配置

```javascript
dtjs.match('**', {
    proj: 'dome'    //为文件设置对应的项目名
    version: '1.0.0'    //为文件版本信息
})

//匹配所有的静态文件
dtjs.match('**.{js,css,png,jpg,jpeg,gif}', {
    output: './output/public/${proj}/${version}/$0',
    url: '//cdn/${proj}/${version}/$0',
    useHash: true 
})

//匹配所有的模版文件
dtjs.match('**.{html,ejs}', {
    output: './output/views/${proj}/${version}/$0'
})
```

> * `output` 设置文件的输出路径
> * `url` 设置文件被访问的路径
> * `useHash` 设置文件的 md5 信息

#### 3. 运行输出命令，对比文件

```bash
dtjs output
```

![](https://github.com/dante1977/dtjs/blob/master/docs/img/file_diff.jpg)

> `Dt.js` 的资源定位实现是参考了 `FIS3` 的，用法和功能一样。
> 相关文章，拓展阅读：
> 
> * [前端开发体系建设日记](https://github.com/fouber/blog/blob/master/201404/01.md#1-开发目录设计)
> * [百度FIS3的官方文档--定位资源](http://fis.baidu.com/fis3/docs/user-dev/uri.html)
> * [百度FIS3的官方文档--配置glob](http://fis.baidu.com/fis3/docs/api/config-glob.html)

### 第三个问题：前后端开发分离

前后端开发分离包括前端在不需要搭建后端的 web 服务的情况下：

* 输出可用的模块文件（如 nodejs 的 web 应用，则需要输出 ejs 的模板文件）。
* 模拟 ajax 接口请求。

> `Dt.js` 的输出可用的模块文件功能，是开发了一个 `FIS3` 的 parser，相关内容可参考下面链接的文章：
> 
> * [fis3-parser-html-ejs插件](https://github.com/dante1977/fis3-parser-html-ejs)
> * [百度FIS3的官方文档--预处理](http://fis.baidu.com/fis3/docs/lv1.html#%E9%A2%84%E5%A4%84%E7%90%86)
> * [百度FIS3的官方文档--Mock 假数据模拟](http://fis.baidu.com/fis3/docs/node-mock.html)

#### 1. 输出可用的模块文件，以ejs例

* 下载 fis3-parser-html-ejs 预处理插件

```bash
npm install -g fis3-parser-html-ejs
```

* dtjs.config.js的配置

```javascript
dtjs.match('**.html', {
    parser: {
        name: 'fis3-parser-html-ejs',
        options: {
            raw: false
        }
    }
})

//添加media属性
dtjs.media('dist').match('**.html', {
    parser: {
        name: 'fis3-parser-html-ejs',
        options: {
            raw: true
        }
    }
})
```

* 运行输出命令

```bash
dtjs output -m dist
```
> * `media/m` 接口提供多种状态功能，比如有些配置是仅供开发环境下使用，有些则是仅供生产环境使用的

#### 2. 模拟 ajax 接口请求

**组内业务暂时没有涉及这块，暂不实现。**

## 文档 & 相关

* [API文档地址](http://dtjsfm.duapp.com/)