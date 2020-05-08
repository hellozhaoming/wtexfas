<h1>wtexfas</h1>
<p>a tool to make wavelet transformation of EXAFS</p>
<p>很多做同步辐射吸收谱的研究者是化学或者物理背景，对计算机编程不太熟。
一些现存的吸收谱小波变换的软件太久没有更新，在新系统里运行不太方便，而且大多是命令行的操作，对非计算机专业的人来说不友好</p>
<p>因此我写了这个带图形界面的软件，感谢中科院应用物理研究所姜政老师的指导</p>
<p>还有一些功能还在开发中，最近忙毕设，所以开发进度比较慢请谅解。</p>
<hr>
<p>如果觉得好用，欢迎引用一下下面关于小波变换的综述，谢谢</p>
<p>
Physica B: Condensed Matter 542 (2018) 12–19
<a href="https://www.sciencedirect.com/science/article/pii/S0921452618303053?via%3Dihub" rel="nofollow">https://www.sciencedirect.com/science/article/pii/S0921452618303053?via%3Dihub</a></p>
<p></p>
<p></p>
<p></p>
<p></p>
<h2>一般使用方法：</h2>
<p>下载编译好的程序（由于github有25M程序限制，因此暂时将编译好的程序放在百度网盘）：</p>
<p>链接：https://pan.baidu.com/s/1E-BE-LJsmkiWU3QWfzcBFQ </p>
<p>提取码：rpum</p>
<p>三选一：</p>
<p>1.下载wtexafs Setup xxx.exe,该文件为安装包双击安装后运行</p>
<p>2.下载wtexafs-xxx-xx-xx.zip，解压，双击运行wtexafs.exe</p>
<p>3.下载wtexafs-xxx-xx-xx.exe，该文件为免安装单文件版。但是因为文件经过压缩，运行相较前两者较慢。</p>
  <p>  </p>
<p></p>
<p>用新版athena软件导出的k空间的数据，后缀是*.chik1/.chik2/.chik3的，可以直接导入到软件，然后一直点后面的按钮就好了。</p>
<p>如果用的旧版本的athena，需要将文件先导入到originpro 或者excel，调整第一列为k值，第二列为信号强度，保存为txt文件，两列之间分隔符用空格。</p>
<p>eta和sigma的乘积可以控制小波变换在r和k上的分辨率，多试一些值，直到得到的图满足你的要求。</p>
<p>本软件的作图模块调用plotly的API,但是plotly经常升级api，导致图片交互编辑功能经常失效。暂时没有找到其他好用的作图函数库。(matlab的函数库非常强大，但是体积超过1G)</p>
<p></p>
<h2>推荐作图方式：</h2>
<p>1.直接将图片存为png格式用ppt或者photoshop重写坐标轴名称并修改字体</p>
<p>2.点击exportWT，将会得到三个文件，分别是两个数组，和一个矩阵。两个数组分别存储了k和r的坐标，矩阵存储了k和r坐标对应的小波变换的值。然后用matlab/excel等工具导入数据/转换数据格式/作图。</p>
<p></p>
<p></p>
<p></p>
<p></p>
<p></p>
<p></p>
<p></p>
<p></p>
<p></p>
<p>本软件使用js编写，基于nodejs，理论上只要支持浏览器的操作系统都可以运行，可以跨平台使用。</p>
<p></p>
<p></p>
<p></p>
<p></p>
<p></p>
<p></p>
<p></p>
<h2>开发编译指南：</h2>
<h3>一、编译前的准备</h3>
<p>1.下载并安装nodejs(https://nodejs.org/en/)</p>
<p>     安装时勾选自动下载并安装必要的工具。软件会自动下载python和visual c++</p>
<p>     检查node.js和npm是否安装成功</p>
 <p>        命令行：node -v</p>
 <p>        命令行：npm -v</p>
<p>2.安装electron</p>
  <p>   命令行：npm install -g electron</p>
<p></p>
<p>（如果在国内安装特别慢，建议先把npm的仓库切换到国内taobao仓库，</p>
<p>注册cnpm命令，如下</p>
<p>npm install -g cnpm --registry=https://registry.npm.taobao.org</p>
<p>然后运行</p>
<p>cnpm install -g electron</p>
<p>）</p>
<p></p>
 <p>    检查electron是否安装成功</p>
 <p>        命令行：electron -v</p>
<p>3.安装打包输出工具</p>
 <p>    命令行：npm i -g electron-builder</p>
 <p>    或cnpm i -g electron-builder（国内taobao仓库）</p>
<p></p>
<p>4.安装git</p>
<p>https://git-scm.com/</p>
<p>根据操作系统选择相应的版本，双击运行。</p>
<p></p>
<h3>二、开始编译</h3>
<p>1.下载源代码</p>
 <p>    命令行进入准备放置程序的文件夹，下载源代码</p>
<p>     命令行：git clone https://github.com/hellozhaoming/wtexfas</p>
<p>     进入项目</p>
<p>     命令行：cd wtexfas</p>
<p></p>
<p>2.安装依赖</p>
<p>     命令行：npm install</p>
<p></p>
<p>3.修改代码</p>
 <p>    若要修改mother wavelet的形式，可以修改app.js中的函数</p>
<p> </p>
<p>4.测试运行</p>
 <p>    命令行：npm start</p>
<p></p>
<p></p>
<p></p>
<h3>三、程序打包</h3>
<p>以32位windows系统可执行文件为例</p>
<p>命令行：electron-builder --ia32</p>







