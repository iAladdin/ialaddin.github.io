---
layout: page
title: "Weixin Mac App"
description: "将网页版本的Weixin封装起来，支持快捷键，聊天背景替换，本地的通知"
---
{% include JB/setup %}
9月5日 September Early [网盘下载](http://pan.baidu.com/share/link?shareid=2367862141&uk=2885731703)

    - 增加关闭窗口，呼出窗口的功能
    - 增加自动更新框架
    - 增加公共账号推荐功能
    - 增加本地主题的支持逻辑，功能未开始做
    - 更改本地替换背景图片的方法


8月30日 August Late [网盘下载](http://yun.baidu.com/share/link?shareid=3983916216&uk=2885731703&third=0)

支持了本地的图片，解决了流量问题，这个事情，好开心。快捷键还是不能配置，因为没有人提。
接下来准备支持多主题。研究研究js劫持什么的。


旧：

最近用微信太频繁，而且是群聊，鉴于越来越频繁的使用，而微信的信息量也愈加的大的情况下。我还是决定写一个Mac端的封装，便于资料的汇总，图片下载，同步到evernote之类的功能。本来想完成多一些功能再放出来的，还是快速迭代吧...  

![image](http://i.minus.com/ibqGAg0sR5QNY2.png)


所以roadmap写在下面了，有建议的小伙伴可以直接在本页留言，会使用github issues的小伙伴，可以直接项目页面进行提交，会编码的小伙伴，可以直接fork 改完后，发pull-request，然后我们一起玩完善。

最后

祝微信早日征服QQ。

祝微信早日出官方Mac版本。



    - Version August-Early [完] 
      Download : https://github.com/iAladdin/Weixin-Mac/archive/August-Early.zip
        - 完成快捷键呼出功能 `cmd+control+o`
        - 完成捐赠按钮
        - 完成壁纸功能
        - 完成连接点击功能(打开默认浏览器)
        - 完成基本的本地提醒功能(群多的小伙伴，你们有的烦了，因为没有和你设置的不提醒的那个同步)
        - 支持10.8
    - Version August-Late  [完]
        - 完成壁纸主题模块设计，目前还是只有言叶之庭
        - 完成对服务器端的依赖，完全本地主题包
        - 支持窗口大小调整
    - Version September-Early 
        - 完成在线主题的支持
        - 完成公共账号的推荐
        - 完成Native 图片预览功能



[申请添加更多功能](https://github.com/iAladdin/Weixin-Mac/issues)