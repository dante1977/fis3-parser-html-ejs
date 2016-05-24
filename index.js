'use strict';
var ejs = require('ejs');
var path = require('path');
//提取<script>
var scriptExpr = /<!--[\S\s]*?-->|<script([\s\S]*?)>([\s\S]*?)<\/script>/gi;
var attrExpr = /\s*([\w-]+)[\s\S]*?=[\s\S]*?"\s*([\s\S]*?)\s*"/g;
//<%- include('user/show', {user: user}) %> <% include user/show %>
var includeExpr = /<%-?\s[\s\S]*?include\s*(?:\(\s*('|")(.*?)\1|([\w\/\\-_\.]+))/g;
var ejsPrefixExpr = /\.ejs$/;

module.exports = function (content, file, conf) {
  conf.filename = file.getId();
  conf.client = true;

  return content.replace(scriptExpr, function (matchStr) {
    var template = arguments[2];
    if (!template) {
      return matchStr;
    }
    var attrs = {};
    var keyVal = '';

    while ((keyVal = attrExpr.exec(arguments[1]))) {
      attrs[keyVal[1]] = keyVal[2];
    }
    if (attrs['type'] !== 'text/ejs') {
      return matchStr;
    }
    //判断是否需要去解析 ejs 模板
    try {
      if (!conf.raw) {
        //判断 include
        var includeArgs = '';
        while ((includeArgs = includeExpr.exec(template))) {
          var ejsUri = includeArgs[2] || includeArgs[3];
          file.cache.addDeps(path.resolve(file.dirname, ejsPrefixExpr.test(ejsUri) ? ejsUri : (ejsUri + '.ejs')));
        }
        var data = {};
        if(attrs['data-json']) {
          var realpath = path.resolve(file.dirname, attrs['data-json']);
          data = require(realpath);
        }
        return ejs.render(template, data, conf);
      }
    } catch (e) {
      fis.log.warn('ejs parse %s with an error: %s', file.filename, e);
      return matchStr;
    }
    return template;
  });
};