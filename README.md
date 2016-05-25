## fis3-parser-html-ejs
fis3的parser插件。关于 `ejs` 的使用方法，可以参考其[文档](https://github.com/mde/ejs)。

### 用法
* 安装

```bash
npm install -g fis3-parser-html-ejs
```

* 配置
    
```bash
// fis3
fis.match('**.html', {
    parser: fis.plugin('html-ejs', {
        // options
    })
})

// dtjs
dtjs.match('**.html', {
    parser: 'fis3-parser-html-ejs'
})
dtjs.match('**.html', {
    parser: {
        name: 'fis3-parser-html-ejs',
        options: {
            // options
        }
    }
})
```

* 在html中使用ejs
    * source
    
```html
/**********************************
 * index.html content:
 **********************************
 <ul>
    <script type="text/ejs" data-json="config/data.json">
        <%
            for(var i=0;i<list.length;i++){
                %><li><img src="<%=list[i]%>" /></li><%
            }
        %>
    </script>
 </ul>
 **********************************/
```

```javascript
/**********************************
 * src/config/data.json content:
 **********************************
 {
    "list":["img/1.jpg","img/2.jpg"]
 }
**********************************/
```

* build

```html
/**********************************
 * index.html content:
 **********************************
 <ul>
    <li><img src="img/1.jpg" /></li>
    <li><img src="img/2.jpg" /></li>
 </ul>
 **********************************/
```

## 配置项
可配置的选项可以参考ejs的[文档说明](https://github.com/mde/ejs#options)。但 fis3-parser-html-ejs 也提供了一些可配置项。

- `raw` 是否保留 .html 文件中的 ejs 代码块。默认为 false。如上面的例子：
    
    > 这个配置项是为了让前端人员用 `ejs` 开发页面，输页面给后端时，将 `raw` 设置成 `true` 即可。 

```bash
//fis3
fis.match('**.html', {
    parser: fis.plugin('html-ejs', {
        raw: true
    })
})
```
```html
/**********************************
 * index.html content output:
 **********************************
 <ul>
    <%
        for(var i=0;i<list.length;i++){
            %><li><img src="<%=list[i]%>" /></li><%
        }
    %>
 </ul>
 **********************************/
```