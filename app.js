var assert = require('assert');
var numbers = require('./numbers.js');
var Complex = numbers.complex;
var basic = numbers.basic;
var app = require('electron').remote;
var dialog = app.dialog;
var fs = require('fs');
var Plotly = require('./plotly/plotly.js');
var matrix = numbers.matrix;

var sig = new Array();  //全局变量
sig[0] = new Array();
sig[1] = new Array();
var wtsig = new Array();
var rmin = 0.5;
var rmax = 6;
var dr = 0.5;
var kmin = 0.5;
var kmax = 12;
var dk = 0.5;
////test function
//  var myFunc = function(x) {
//    return 2*Math.pow(x,2) + 1;
//  }
//  document.getElementById('button').onclick = function () {
//  var message = document.getElementById('message').value;
// 使用 ipcRenderer.send 向主进程发送消息。
//    var oInp = document.getElementById('message');
//    oInp.onblur=function(){
//      if(isNaN(Number(oInp.value))){  //当输入不是数字的时候，Number后返回的值是NaN;然后用isNaN判断。
//            alert('不是数字！')
//        }
//    }
//    var outdata = myFunc(oInp.value);
//document.querySelector('.WTexafs-result').innerHTML = outdata;
//}



//Morlet函数
var eta = 2;
var sigma = 5;
function morlet(x) {
  var temp = Math.exp(-x * x / (2 * sigma * sigma)) / (Math.sqrt(2 * Math.PI) * sigma);
 // var A = new Complex(Math.cos(eta * x) * temp, Math.sin(eta * x) * temp);
 var A = new Complex((Math.cos(eta * x) - Math.exp(- eta * eta * sigma * sigma / 2)) * temp, Math.sin(eta * x) * temp);
  return A;
}

function FFTexafs(rmin1, rmax1, dr1) {
  var fftr = new Array();
  fftr[0] = new Array();
  fftr[1] = new Array();
  var fftrcomp = new Array();
  for (i = 0; i < (rmax1 - rmin1) / dr1; i++) {
    fftr[0][i] = rmin1 + i * dr1;
    fftrcomp[i] = new Complex(0, 0);
    for (j = 0; j < sig[0].length - 1; j++) {
      var temp = new Complex(sig[1][j] * (sig[0][j + 1] - sig[0][j]) * Math.cos(2 * fftr[0][i] * sig[0][j]), -sig[1][j] * (sig[0][j + 1] - sig[0][j]) * Math.sin(2 * fftr[0][i] * sig[0][j]));
      fftrcomp[i] = fftrcomp[i].add(temp);
    }
    fftr[1][i] = fftrcomp[i].r;
  }
  return fftr;
}


function WTexafs() {
  //获取r的范围
  if (document.getElementById("rrange").value.length != 0) {
    var rrange1 = document.getElementById("rrange").value.split(" ");
    for (var k = 0; k < rrange1.length; k++) {
      if (rrange1[k] == "" || rrange1[k] == "undefined") {
        rrange1.splice(k, 1);
        k--;
      }
    }

    rmin = parseFloat(rrange1[0]);
    rmax = parseFloat(rrange1[1]);
    dr = parseFloat(rrange1[2]);
  }
  //获取k的范围
  if (document.getElementById("krange").value.length != 0) {
    var krange1 = document.getElementById("krange").value.split(" ");
    for (var k = 0; k < krange1.length; k++) {
      if (krange1[k] == "" || krange1[k] == "undefined") {
        krange1.splice(k, 1);
        k--;
      }
    }
    kmin = parseFloat(krange1[0]);
    kmax = parseFloat(krange1[1]);
    dk = parseFloat(krange1[2]);
  }
  //获取参数
  eta = parseFloat(document.getElementById("eta").value);
  sigma = parseFloat(document.getElementById("sigma").value);

  var r = new Array();
  var a = new Array();
  var k = new Array();
  var daughterwavelet = new Array();
  var wtarry = new Array();
  var wtmag = new Array();
  for (i = 0; i < (rmax - rmin) / dr; i++) {
    r[i] = rmin + i * dr;
    a[i] = eta / (2 * r[i]);
    daughterwavelet[i] = new Array();
    wtarry[i] = new Array();
    wtmag[i] = new Array();
    for (j = 0; j < (kmax - kmin) / dk; j++) {
      k[j] = kmin + j * dk;
      daughterwavelet[i][j] = new Array();
      wtarry[i][j] = new Complex(0, 0);
      for (t = 0; t < sig[0].length; t++) {
        daughterwavelet[i][j][t] = morlet((sig[0][t] - k[j]) / a[i]);
        wtarry[i][j] = wtarry[i][j].add(daughterwavelet[i][j][t].conjugate().multiply(new Complex(sig[1][t] * dk / Math.sqrt(a[i]), 0)));
      }
      wtmag[i][j] = wtarry[i][j].r;
    }
  }
  var wtr = new Array();
  wtr[0] = k;
  wtr[1] = r;
  wtr[2] = wtmag;
  return wtr;
}






//打开文件
document.getElementById('select-file').addEventListener('click', function () {
  dialog.showOpenDialog(function (fileNames) {
    if (fileNames === undefined) {
      console.log("No file selected");
    } else {
      document.getElementById("actual-file").value = fileNames[0];
      readFile(fileNames[0]);

    }
  });
}, false);
//保存文件
document.getElementById('export-wt').addEventListener('click', function () {
  dialog.showSaveDialog(function (fileNames) {

    fs.writeFile(fileNames + "-k", wtsig[0], { 'flag': 'a' }, function (err) {
      if (err) {
        alert("An error ocurred updating the file" + err.message);
        console.log(err);
        return;
      }
    });
    fs.writeFile(fileNames + "-r", wtsig[1], { 'flag': 'a' }, function (err) {
      if (err) {
        alert("An error ocurred updating the file" + err.message);
        console.log(err);
        return;
      }
    });
    var wtsigout = new Array();
    for (i = 0; i < wtsig[2].length; i++) {
      wtsigout[i] = new Array();
      for (j = 0; j < wtsig[2][i].length; j++) {
        wtsigout[i][j] = wtsig[2][i][j];
      }
      wtsigout[i][wtsig[2][i].length] = "\r\n";
    }
    fs.writeFile(fileNames + "-wt", wtsigout, { 'flag': 'a' }, function (err) {
      if (err) {
        alert("An error ocurred updating the file" + err.message);
        console.log(err);
        return;
      }
    });
  });
}, false);
//

//作图
document.getElementById('wt-plot').addEventListener('click', function () {
  var kspace = {
    x: sig[0],
    y: sig[1],
    type: 'line'
  };
  var rsig = FFTexafs(0.5, 6, 0.1);
  var rspace = {
    x: rsig[0],
    y: rsig[1],
    type: 'line'
  };
  var dataplotk = [kspace];
  var dataplotr = [rspace];
  var layoutk = {
    title: 'K-space',
    xaxis: {
      title: 'k',
      titlefont: {
        family: 'Courier New, monospace',
        size: 18,
        color: '#7f7f7f'
      }
    },
    yaxis: {
      title: 'EXAFS',
      titlefont: {
        family: 'Courier New, monospace',
        size: 18,
        color: '#7f7f7f'
      }
    }
  };
  var layoutr = {
    title: 'r-space',
    xaxis: {
      title: 'r',
      titlefont: {
        family: 'Courier New, monospace',
        size: 18,
        color: '#7f7f7f'
      }
    },
    yaxis: {
      title: 'FT-EXAFS',
      titlefont: {
        family: 'Courier New, monospace',
        size: 18,
        color: '#7f7f7f'
      }
    }
  };
  Plotly.newPlot('k-space', dataplotk, layoutk);
  Plotly.newPlot('r-space', dataplotr, layoutr);

  wtsig = WTexafs();
  var wtspace = {
    x: wtsig[0],
    y: wtsig[1],
    z: wtsig[2],
    type: 'contour'
  };
  var dataplotwt = [wtspace];

  var layoutwt = {
    title: 'WT-magnitude',
    xaxis: {
      title: 'K',
      titlefont: {
        family: 'Courier New, monospace',
        size: 18,
        color: '#7f7f7f'
      }
    },
    yaxis: {
      title: 'r',
      titlefont: {
        family: 'Courier New, monospace',
        size: 18,
        color: '#7f7f7f'
      }
    }
  };

  Plotly.newPlot('WT', dataplotwt, layoutwt);

}, false);
//读取文件
function readFile(filepath) {
  fs.readFile(filepath, 'utf-8', function (err, data) {
    if (err) {
      alert("An error ocurred reading the file :" + err.message);
      return;
    }
    var sig2 = new Array();
    sig2 = data.split("\r\n");
    var j = 0;
    for (var i = 0; i < sig2.length; i++) {
      //  sig[i]=new Array();
      var sigtemp = sig2[i].split(" ");
      for (var k = 0; k < sigtemp.length; k++) {
        if (sigtemp[k] == "" || sigtemp[k] == "undefined") {
          sigtemp.splice(k, 1);
          k--;
        }
      }
      sig[0][j] = parseFloat(sigtemp[0]);
      sig[1][j] = parseFloat(sigtemp[sigtemp.length - 1]);
      if (isNaN(sig[0][j])) {
        sig[0].splice(j, 1);
        sig[1].splice(j, 1);
        j--;
      }
      j++;
    }
    //                    document.getElementById("content-editor").value = data;
    //                   document.getElementById("content-editor").value = sig;
  });
  //读取数组

}


function saveChanges(filepath, content) {
  fs.writeFile(filepath, content, function (err) {
    if (err) {
      alert("An error ocurred updating the file" + err.message);
      console.log(err);
      return;
    }

    alert("The file has been succesfully saved");
  });
}
