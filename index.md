---
layout: page
title: Weixin For Mac
tagline: Weixin,Wechat
---
{% include JB/setup %}

[Weixin For Mac](http://ialaddin.github.io/Weixin-Mac/index.html) <span class="label label-success">September Early</span>
<ul class="posts">
  <li><span class="label label-success">增加关闭窗口，呼出窗口的功能</span></li>
  <li><span class="label label-success">增加自动更新框架</span></li>
  <li><span class="label label-success">增加公共账号推荐功能</span></li>
  <li><span class="label label-success">增加本地主题的支持逻辑，功能未开始做</span></li>
  <li><span class="label label-warning">更改本地替换背景图片的方法</span></li>
  <li><span class="label label-important">不支持Retina Macbook Pro，求素材，求测试设备</span></li>
</ul>


<ul class="posts">
  {% for post in site.posts %}
    <li><span>{{ post.date | date_to_string }}</span> &raquo; <a href="{{ BASE_PATH }}{{ post.url }}">{{ post.title }}</a></li>
  {% endfor %}
</ul>


