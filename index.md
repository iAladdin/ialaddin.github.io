---
layout: page
title: Weixin For Mac
tagline: Weixin,Wechat
---
{% include JB/setup %}

[Weixin For Mac](http://ialaddin.github.io/Weixin-Mac/index.html) 

<span class="label label-success">Version 1.3</span>
<ul class="posts">
  <li><span class="label label-success">更新了 ICON 和部分 UI 交互</span></li>
  <li><span class="label label-warning">如果遇到了无法加载微信登录二维码的情况，请耐心等待，还不知道原因，但通常等待可以解决。</span></li>
  <li><span class="label label-important">不支持Retina Macbook Pro，求素材，求测试设备</span></li>
</ul>


<ul class="posts">
  {% for post in site.posts %}
    <li><span>{{ post.date | date_to_string }}</span> &raquo; <a href="{{ BASE_PATH }}{{ post.url }}">{{ post.title }}</a></li>
  {% endfor %}
</ul>


