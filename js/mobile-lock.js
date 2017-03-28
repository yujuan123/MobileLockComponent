function mobileLock() {
    var canvas = document.getElementById("canvas");
    var ctx = canvas.getContext('2d');
    var n= 3;
    var r = ctx.canvas.width / (2 + 4 * n);
    var circleArray = [];
    var untouchedArr = [];
    var isTouch = false;
    createCircle(ctx,circleArray,untouchedArr);

    touchEvent(canvas,ctx,circleArray,untouchedArr,r,isTouch);
    /*drawStatusPoint(ctx);*/
}
function drawCircle(ctx, x, y, radius) {
    //设置圆圈轮廓的颜色
    ctx.strokeStyle = 'rgb(0,' + Math.floor(255 - 42.5) + ',' + Math.floor(255 - 42.5) + ')';
    ctx.lineWidth = 2;
    ctx.beginPath();
    //画圈圈
    ctx.arc(x, y, radius, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.stroke();
}

function createCircle(ctx,circleArray,untouchedArr) {// 创建解锁点的坐标，根据canvas的大小来平均分配半径


    var n = 3;
    var count = 0;
    var r = ctx.canvas.width / (2 + 4 * n);// 公式计算
    /* this.lastPoint = [];
     this.arr = [];
     this.restPoint = [];*/

    for (var i = 0; i < n; i++) {
        for (var j = 0; j < n; j++) {
            count++;
            var obj = {
                x: j * 4 * r + 3 * r,
                y: i * 4 * r + 3 * r,
                index: count
            };
            circleArray.push(obj);
            untouchedArr.push(obj);
        }
    }
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    for (var i = 0; i < circleArray.length; i++) {
        drawCircle(ctx, circleArray[i].x, circleArray[i].y, r);
    }

    /*touchEvent(circleArray, r);*/
}
//画触摸的点
function drawTouchedPoint(ctx,r, touchedArr) {

    console.log("长度" + touchedArr.length);
    for (var i = 0; i < touchedArr.length; i++) {
        //设置触摸的点的填充颜色
        ctx.fillStyle = "#CFE6FF";
        ctx.beginPath();
        ctx.arc(touchedArr[i].x, touchedArr[i].y, r / 2, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.fill();
    }

}
/*function drawStatusPoint (ctx) { // 初始化状态线条
    for (var i = 0 ; i < this.lastPoint.length ; i++) {
        this.ctx.strokeStyle = 'red';
        this.ctx.beginPath();
        this.ctx.arc(this.lastPoint[i].x, this.lastPoint[i].y, this.r, 0, Math.PI * 2, true);
        this.ctx.closePath();
        this.ctx.stroke();
    }
}*/
//画走过的轨迹
function drawLine(ctx,po, touchedArr) {

    ctx.beginPath();
    ctx.lineWidth = 3;
    ctx.moveTo(touchedArr[0].x, touchedArr[0].y);

    for (var i = 1; i < touchedArr.length; i++) {
        ctx.lineTo(touchedArr[i].x, touchedArr[i].y);
    }
    ctx.lineTo(po.x, po.y);
    ctx.stroke();
    ctx.closePath();

}
function getPosition(e) {
    var rect = e.currentTarget.getBoundingClientRect();
    var p = {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top
    };
    return p;
}
function changePos(ctx,p, arr, touchedArr, untouchedArr, r) {
    console.log("touchArray"+touchedArr+"un"+untouchedArr);

    //因为每次移动，路径就会发生改变
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    for (var i = 0; i < arr.length; i++) { // 每帧先把面板画出来
        drawCircle(ctx, arr[i].x, arr[i].y, r);
    }

    drawTouchedPoint(ctx,r, touchedArr);
    drawLine(ctx,p, touchedArr);

    for (var i = 0; i < untouchedArr.length; i++) {
        if (Math.abs(p.x - untouchedArr[i].x) < r && Math.abs(p.y - untouchedArr[i].y) < r) {
            drawTouchedPoint(ctx,r, untouchedArr[i]);
            touchedArr.push(untouchedArr[i]);
            untouchedArr.splice(i, 1);
            break;
        }
    }

}
//保存路径
function storePath(touchedArr) {

}
//给每个圈绑定触摸事件

function touchEvent(canvas,ctx,circleArr,untouchedArr,r,isTouch) {

    var touchedArr = [];
    canvas.addEventListener("touchstart", function (startEve) {
        startEve.preventDefault();
        var p = getPosition(startEve);

        console.log("当前触摸的点:" + p);
        for (var i = 0; i < circleArr.length; i++) {
            if (Math.abs(p.x - circleArr[i].x) < r && Math.abs(p.y - circleArr[i].y) < r) {//证明在圈圈内部
                //不能重复再画
                isTouch = true;
                //保存这个点的位置
                touchedArr.push(circleArr[i]);
                //先把触摸的这个点画出来
                drawTouchedPoint(ctx,r, touchedArr);
                //保存去掉正确路径下的圈圈
                untouchedArr.splice(i, 1);
                break;
            }
        }
    }, false);
    canvas.addEventListener("touchmove", function (moveEve) {
        if (isTouch) {
            console.log("111")
            changePos(ctx,getPosition(moveEve), circleArr, touchedArr, untouchedArr, r);
        }
    }, false);
   canvas.addEventListener("touchend",function(endEve){
       if(isTouch){
           isTouch = false;
           storePath(touchedArr);
       }

   },false);
    document.addEventListener('touchmove', function(e){
        e.preventDefault();
    },false);

}
