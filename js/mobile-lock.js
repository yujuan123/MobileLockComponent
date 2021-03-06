function mobileLock() {
  this.canvas = document.getElementById("canvas");
  this.ctx = this.canvas.getContext('2d');

  this.touchedArr = [];//保存触摸过的圆圈
  this.untouchedArr = [];//保存未触摸的圆圈
  this.isTouch = false;//标记是否被触摸
  this.isShort = false;//标记密码长度是否太短
  this.passObj = window.localStorage.getItem('password') ? {
    step: 0,
    spassword: JSON.parse(window.localStorage.getItem('password'))
  } : {};

  createCircle();
  touchEvent();
}

function drawCircle(x, y) {
  //设置圆圈轮廓的颜色
  this.ctx.strokeStyle = '#00FF00';
  this.ctx.lineWidth = 2;
  this.ctx.beginPath();
  //画圈圈
  this.ctx.arc(x, y, this.r, 0, Math.PI * 2, true);
  this.ctx.closePath();
  this.ctx.stroke();
}

function createCircle() {
  var n = 3;
  var count = 0;
  this.circleArr = [];
  this.r = this.ctx.canvas.width / (2 + 4 * n);//圆圈半径
  /*清空之前的触碰点*/
  this.touchedArr = [];
  this.untouchedArr = [];
  for (var i = 0; i < n; i++) {
    for (var j = 0; j < n; j++) {
      count++;
      var obj = {
        x: j * 4 * this.r + 3 * this.r,
        y: i * 4 * this.r + 3 * this.r,
        index: count
      };
      this.circleArr.push(obj);
      this.untouchedArr.push(obj);
    }
  }
  this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
  for (var i = 0; i < this.circleArr.length; i++) {
    drawCircle(this.circleArr[i].x, this.circleArr[i].y);
  }
}

//画触摸的点
function drawTouchedPoint() {
  console.log("长度" + this.touchedArr.length);
  for (var i = 0; i < this.touchedArr.length; i++) {
    //设置触摸的点的填充颜色
    this.ctx.fillStyle = "#00FF00";
    this.ctx.beginPath();
    this.ctx.arc(this.touchedArr[i].x, this.touchedArr[i].y, this.r / 2, 0, Math.PI * 2, true);
    this.ctx.closePath();
    this.ctx.fill();
  }
}

//画走过的轨迹
function drawLine(po) {
  this.ctx.beginPath();
  this.ctx.lineWidth = 3;
  this.ctx.moveTo(this.touchedArr[0].x, this.touchedArr[0].y);

  for (var i = 1; i < this.touchedArr.length; i++) {
    this.ctx.lineTo(this.touchedArr[i].x, this.touchedArr[i].y);
  }
  this.ctx.lineTo(po.x, po.y);
  this.ctx.stroke();
  this.ctx.closePath();
}

function getPosition(e) {
  var rect = e.currentTarget.getBoundingClientRect();
  var p = {
    x: e.touches[0].clientX - rect.left,
    y: e.touches[0].clientY - rect.top
  };
  return p;
}

function changePos(p) {
  //因为每次移动，路径就会发生改变
  this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

  for (var i = 0; i < this.circleArr.length; i++) { // 每帧先把面板画出来
    drawCircle(this.circleArr[i].x, this.circleArr[i].y);
  }
  //所以先画出原来的每个点，每条线
  drawTouchedPoint();
  drawLine(p);
  //再添加触摸的点
  for (var i = 0; i < this.untouchedArr.length; i++) {
    if (Math.abs(p.x - this.untouchedArr[i].x) < this.r && Math.abs(p.y - this.untouchedArr[i].y) < this.r) {
      drawTouchedPoint();
      this.touchedArr.push(this.untouchedArr[i]);
      this.untouchedArr.splice(i, 1);
      break;
    }
  }
}

//比较输入的密码（序列）
function checkPass(psw1, psw2) {
  var p1 = '',
      p2 = '';
  for (var i = 0; i < psw1.length; i++) {
    console.log(psw1[i]);
    p1 += psw1[i].index;
  }
  for (var i = 0; i < psw2.length; i++) {
    p2 += psw2[i].index;
  }
  console.log("先前的序列" + p1);
  console.log("之后的序列" + p2);
  return p1 === p2;
}


function storePath(psw) {
  var bool = document.getElementsByName("operation")[1].checked;
  /*密码长度*/
  console.log("长度" + psw.length);
  if (psw.length < 5) {
    console.log("it works");
    this.isShort = true;
    document.getElementById('info').innerHTML = '密码太短，至少需要5个点';
  }
  else {
    if (this.passObj.step == 1) {
      if (checkPass(this.passObj.fpassword, psw)) {
        console.log("they are same");
        this.passObj.step = 2;
        this.passObj.spassword = psw;
        document.getElementById('info').innerHTML = '密码保存成功，请选择验证密码';
        window.localStorage.setItem('password', JSON.stringify(this.passObj.spassword));
      } else {
        document.getElementById('info').innerHTML = '两次不一致，重新输入';
        delete this.passObj.step;
      }
    } else if (this.passObj.step == 2&&bool) {
      if (checkPass(this.passObj.spassword, psw)) {
        document.getElementById('info').innerHTML = '密码正确';
      } else {
        document.getElementById('info').innerHTML = '密码不正确！';
      }
    } else {
      this.passObj.step = 1;
      this.passObj.fpassword = psw;
      document.getElementById('info').innerHTML = '再次输入';
    }
  }
}

//重置，等待用户输入
function reset() {
  if(this.isShort){
    document.getElementById('info').innerHTML = '请再次输入手势密码';
    this.isShort = false;
  }
  createCircle();//要是touchedArr能够变为空就好了
}

//给每个圈绑定触摸事件
function touchEvent() {

  //passObj想存的是 两次一样，并保存的正确密码

  var self = this;

  this.canvas.addEventListener("touchstart", function (startEve) {
    startEve.preventDefault();
    var p = getPosition(startEve);

    console.log("当前触摸的点:" + p);
    for (var i = 0; i < self.circleArr.length; i++) {
      if (Math.abs(p.x - self.circleArr[i].x) < self.r && Math.abs(p.y - self.circleArr[i].y) < self.r) {//证明在圈圈内部
        //不能重复再画
        self.isTouch = true;
        //保存这个点的位置
        self.touchedArr.push(self.circleArr[i]);
        //先把触摸的这个点画出来
        drawTouchedPoint();
        //保存去掉正确路径下的圈圈
        self.untouchedArr.splice(i, 1);
        break;
      }
    }
  }, false);

  self.canvas.addEventListener("touchmove", function (moveEve) {
    if (self.isTouch) {
      console.log("111");
      changePos(getPosition(moveEve));
    }
  }, false);

  self.canvas.addEventListener("touchend", function (endEve) {
    if (self.isTouch) {
      self.isTouch = false;

      storePath(self.touchedArr);
      setTimeout(function () {
        reset();
      }, 800);

    }

  }, false);

  document.addEventListener('touchmove', function (e) {
    e.preventDefault();
  }, false);
}

