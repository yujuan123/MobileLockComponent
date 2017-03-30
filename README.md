# 手机解锁
##如何查看效果
- 运行 mobile-lock.html
- 按F12键，便可以看到效果，如图：

![](http://upload-images.jianshu.io/upload_images/2913413-6854244d1feb24bc.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

##实现思路

####用canvas绘制解锁点
创建3*3 的解锁点,结合canvas的大小给每个解锁点设置位置 (x,y) 和半径 r ，并用canvas对象绘制出来
经过计算，假设canvas的宽度是width,则半径r为
```
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext('2d');*/
var r = ctx.canvas.width / (2 + 4 * n);//圆圈半径
```
####给每个解锁点绑定事件
前面我们已经绘制了解锁点，这时候需要每个点绑定三大触摸事件，分别有
> touchstart事件

监听了touchstart事件，我们就要判断是否点击了解锁点，只需判断点击的坐标与解锁点之间的距离小于半径就可以了,如果点击上了，就把该点保存到数组touchedArr中
> touchmove事件

监听了touchmove事件，我们就要把移动的路径画出来:
- 每次移动，路径就会发生改变,因此每次我们都要清空画布，重新画出解锁点
 ```
 ctx.clearRect(0, 0,ctx.canvas.width, ctx.canvas.height);

  for (var i = 0; i < circleArr.length; i++) { // 每帧先把面板画出来
    drawCircle(circleArr[i].x, circleArr[i].y);
  }
 ```
- 先画出原来的每个点，每条线
```
  drawTouchedPoint();
  drawLine(p);
```
-  再判断剩下的点中有没有又被触摸的，并添加到touchArr中

> touchend事件

监听了touchend事件，我们就要对密码和状态进行逻辑处理


***

##写在最后
最终的结果基本让我满意，也是第一次尝试 HTML Canvas。从开始的忐忑，到渐渐理清思路和结构，用小demo来验证想法，到编写中的各种未知的坑，感觉这一周我过的很充实。同时也为后续的学习积攒更丰富的经验，谢谢你看完！
