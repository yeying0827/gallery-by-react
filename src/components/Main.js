require('normalize.css/normalize.css');
require('styles/App.scss');

import React from 'react';
import ReactDOM from 'react-dom';

// 获取图片相关的数据
let imageDatas = require('../data/imageDatas.json');

// 处理数据，把图片的文件名转换成真实有效的图片地址
// 获取图片地址的写法直接利用的是url-loader，require(图片的路径)即可把他转换成他的url地址
/*function genImageURL(imageDatasArr){ // 参数：包含imageData的一个数据
	for (var i = 0, j = imageDatasArr.length; i < j; i++) {
		// 拿到单个的图片数据
		var singleImageData = imageDatasArr[i];
		singleImageData.imageURL = require('../images/' + singleImageData.fileName);
		imageDatasArr[i] = singleImageData;
	}

	return imageDatasArr;
}

imageDatas = genImageURL(imageDatas);*/

// 这种只使用一次的函数可以利用自执行函数来调用它
// 利用自执行函数，将图片名信息转成图片URL路径信息js
// 入参和结果的说明...
imageDatas = (
	function genImageURL(imageDatasArr) { // 参数：包含imageData的一个数据
		for (var i = 0, j = imageDatasArr.length; i < j; i++ ) {
			// 拿到单个的图片数据
			var singleImageData = imageDatasArr[i];
			singleImageData.imageURL = require('../images/' + singleImageData.fileName);
			imageDatasArr[i] = singleImageData;
		}
		return imageDatasArr;
	}
)(imageDatas);

/*
 * desc: 给定一个取值区间，取区间内的一个随机值。获取区间内的一个随机值
 */
function getRangeRandom(low, high) {
	return Math.ceil(Math.random() * (high - low) + low);
}

/*
 * 获取0~30°之间一个任意正负值
 */
function get30DegRandom() {
	return ((Math.random() > 0.5 ? '':'-') + Math.ceil(Math.random() * 30));
}

/* figure element 通常用来表示自包含的单个单元内容:
   自包含的内容：单独拿出来放到哪里都是有意义的 */
class ImgFigure extends React.Component {
	/*
	 * imgFigure的点击处理函数
	 */
	handleClick(e) {
		if(this.props.arrange.isCenter){
			this.props.inverse();
		} else {
			this.props.center();
		}

		e.stopPropagation();
		e.preventDefault();
	}

	render() {
		// props：是在使用react component的时候，为其添加的所有属性的集合
		// 所以在ImgFigure组件里，可以通过this.props.data拿到相关图片数据的value
		var styleObj = {};
		// 如果props属性中指定了这张图片的位置，则使用
		if(this.props.arrange.pos) {
			styleObj = this.props.arrange.pos;
		}

		// 如果图片的旋转角度有值且不为0，添加旋转角度
		if(this.props.arrange.rotate) {
			// 兼容ff/chrome/ie/safari
			// 声明一个厂商前缀的数组
			// 样式对象的key应该是样式名的驼峰标识写法
			['MozTransform', 'msTransform', 'WebkitTransform', 'transform'].forEach(function(value){
				styleObj[value] = 'rotate('+this.props.arrange.rotate+'deg)';
			}.bind(this));
			// bind(this)：将ImgFigure component对象传进forEach中的处理函数，以便可以直接在这个函数里面调用this
		}

		if(this.props.arrange.isCenter) {
			styleObj.zIndex = 11;
		}

		let imgFigureClassName = 'img-figure';
			imgFigureClassName += this.props.arrange.isInverse ? ' is-inverse' : '';
		
		return (
			<figure className={imgFigureClassName} style={styleObj} onClick={this.handleClick.bind(this)}>
				<img src={this.props.data.imageURL} alt={this.props.data.fileName} />
				<figcaption>
					<h2 className="img-title">{this.props.data.title}</h2>
					<div className="img-back" onClick={this.handleClick.bind(this)}>
						<p>
							{this.props.data.desc}
						</p>
					</div>
				</figcaption>
			</figure>
		);
	}
}

// 控制组件
class ControllerUnit extends React.Component {
	handleClick(e){
		// 如果点击的是当前正在选中态的按钮，则翻转图片，否则将对应的图片居中
		if(this.props.arrange.isCenter) {
			this.props.inverse();
		} else {
			this.props.center();
		}

		e.stopPropagation();
		e.preventDefault();
	}
	render() {
		var controllerUnitClassName = 'controller-unit';

		// 如果对应的是居中的图片，显示控制按钮的居中态
		if(this.props.arrange.isCenter) {
			controllerUnitClassName += ' is-center';

			// 如果同时对应的是翻转图片，显示控制按钮的翻转态
			if(this.props.arrange.isInverse) {
				controllerUnitClassName += ' is-inverse';
			}
		}
		return (
			<span className={controllerUnitClassName} onClick={this.handleClick.bind(this)}></span>
		);
	}
}

// 管理者模式：大管家
// 掌控一切的数据和数据之间的切换
class AppComponent extends React.Component {
	// 一个常量的key，用于存储排布的可取值范围
	/*constant: {
		centerPos: {// 中心图片的位置点，初始化为0
			left: 0,
			right: 0
		},
		hPosRange: {	//	水平方向的取值范围
			leftSecX: [0, 0], // 左分区x的取值范围
			rightSecX: [0, 0], // 右分区x的取值范围
			y: [0, 0]
		},
		vPosRange: {	//	垂直方向的取值范围
			x: [0, 0],
			topY: [0, 0] // 上分区y的取值范围
		}
	}*/

	// 不加static会报错
	// Warning: propTypes was defined as an instance property on AppComponent.
	// Use a static property to define propTypes instead.
	static propTypes() {
	   Constant: React.PropTypes.object
	}

	static get defaultProps() {
		return {
			// 一个常量的key，用于存储排布的可取值范围
		   	Constant: {
				centerPos: {// 中心图片的位置点，初始化为0
					left: 0,
					right: 0
				},
				hPosRange: {//	水平方向的取值范围
					leftSecX: [0, 0],// 左分区x的取值范围
					rightSecX: [0, 0],// 右分区x的取值范围
					y: [0, 0]
				},
				vPosRange: {//	垂直方向的取值范围
					x: [0, 0],
					topY: [0, 0]// 上分区y的取值范围
				}
			}
		};
	}

	static set defaultProps(props) {
		this.props = props;
	}

	/*
	 * description: 翻转图片
	 * @param index 输入当前被执行inverse操作的图片对应的图片信息数组的index值
	 * @return {Funciton} 这是一个闭包函数，其内return一个真正待被执行的函数
	 *
	 * 设计一个闭包函数，通过闭包变量来缓存当前被执行inverse操作的图片，
	 * 在图片信息数组中对应的index值
	 * 闭包：能够读取其他函数内部变量的函数
	 * 由于在js中，只有函数内部的子函数才能读取局部变量，
	 * 因此可以把闭包简单理解成定义在一个函数内部的函数
	 * 所以在本质上，闭包就是将函数内部和函数外部连接起来的一座桥梁
	 */
	inverse(index) {
		return function() {
			var imgsArrangeArr = this.state.imgsArrangeArr;

			imgsArrangeArr[index].isInverse = !imgsArrangeArr[index].isInverse;

			// 触发视图的重新渲染
			this.setState({
				imgsArrangeArr: imgsArrangeArr
			});
		}.bind(this);
		// bind(this)：将大管家对象传进来，方便调用他的state信息
	}

	/*
	 *  description：重新去布局所有的图片
	 * 	@param centerIndex 指定居中排布哪个图片
	 */
	rearrange(centerIndex) {
		// 拿到每个变量的目的: 方便后面更直接的取值
		let imgsArrangeArr = this.state.imgsArrangeArr,// 所有图片的状态信息
			Constant = this.props.Constant,
			centerPos = Constant.centerPos,
			hPosRange = Constant.hPosRange,
			vPosRange = Constant.vPosRange,
			hPosRangeLeftSecX = hPosRange.leftSecX,
			hPosRangeRightSecX = hPosRange.rightSecX,
			hPosRangeY = hPosRange.y,
			vPosRangeTopY = vPosRange.topY,
			vPosRangeX = vPosRange.x,

			// 用来存储布局在上侧区域的图片的状态信息
			// 从图片数组中取0~1个放到上侧区域
			imgsArrangeTopArr = [],
			// 上侧图片数值，随机
			// Math.random() * 2 : [0,2)
			// floor: 向下取整/ceil：向上取整
			topImgNum = Math.floor(Math.random() * 2),// 取一个或者不取
			// 标记布局在上侧区域的图片，是从数组对象的哪个位置拿出来的，初始化为0
			topImgSpliceIndex = 0,

			// 声明一个数组对象，用来存放居中图片的状态信息
			// 居中图片的状态信息
			// 把centerIndex这个位置的图片居中
			// 拿到的是centerIndex这个位置所表示的图片的状态信息，即中心图片的状态
			imgsArrangeCenterArr = imgsArrangeArr.splice(centerIndex, 1);
			// 首先居中centerIndex的图片（通过操纵位置信息），居中的CenterIndex的图片不需要旋转
			imgsArrangeCenterArr[0] = {
				pos: centerPos,
				rotate: 0,
				isCenter: true
			}

			// 1.取出要布局上侧的图片的状态信息
			// 2.计算随机数，这个随机数用来从imgsArrangeArr中定位取出应该布局上侧的图片的状态信息
			// 取值范围 imgsArrangeArr.length - topImgNum , 减topImgNum是因为是从索引位置往后取
			// 向上取整，避免溢出数组
			topImgSpliceIndex =  Math.ceil(Math.random() * (imgsArrangeArr.length - topImgNum));
			imgsArrangeTopArr = imgsArrangeArr.splice(topImgSpliceIndex, topImgNum);

			// 布局位于上侧的图片
			imgsArrangeTopArr.forEach(function(value, index) {
				imgsArrangeTopArr[index] = {
					pos: { // 随机取一个top、left的值
						top: getRangeRandom(vPosRangeTopY[0],vPosRangeTopY[1]),
						left: getRangeRandom(vPosRangeX[0],vPosRangeX[1])
					},
					rotate: get30DegRandom(),
					isCenter: false
				};
			})

			// 布局左右两侧的图片
			for (var i = 0, j = imgsArrangeArr.length, k = j / 2; i < j; i++) {
				var hPosRangeLORX = null; // 左区域或者右区域的x的取值范围
				// 前半部分布局左边，右半部分布局右边
				if(i < k) {
					hPosRangeLORX = hPosRangeLeftSecX;
				}else {
					hPosRangeLORX = hPosRangeRightSecX;
				}

				imgsArrangeArr[i] = {
					pos: {
						top: getRangeRandom(hPosRangeY[0],hPosRangeY[1]),
						left: getRangeRandom(hPosRangeLORX[0],hPosRangeLORX[1])
					},
					rotate: get30DegRandom(),
					isCenter: false
				};
			}

			// 开启调试，同时eslint的rule需要开放调试
			// "no-debugger":0
			// debugger;
 			
 			// 图片信息塞回去
 			if(imgsArrangeTopArr && imgsArrangeTopArr[0]){
 				imgsArrangeArr.splice(topImgSpliceIndex,0,imgsArrangeTopArr[0]);
 			}

 			imgsArrangeArr.splice(centerIndex,0,imgsArrangeCenterArr[0]);

 			// 触发Component的重新渲染
 			this.setState({
 				imgsArrangeArr: imgsArrangeArr
 			});
	}

	/*
	 * 利用rearrange函数，居中对应index的图片
	 * @param index，需要被居中的图片对应的图片信息数组的index值
	 * @return {Function}
	 */
	center(index) {
		return function(){
			this.rearrange(index);
		}.bind(this);
	}

	constructor(props) {
	    super(props);
	    this.state = {
	    	// 每个数组元素，都认为是一个状态对象，包含位置信息
	    	// 位置的属性值和css position定位的值保持一致
	    	// 这样就直接可以把这个obj作为一个css style obj使用了
	    	imgsArrangeArr: [
	    		/*{
	    			pos: {
	    				left: '0',
	    				top: '0'
	    			}
	    			rotate: 0,	// 旋转角度
	    			isInverse: false,	// 用来表示ImgFigure当前的正反面信息
	    			isCenter: false // 图片是否居中
	    		}*/
	    	]
	    };
	}

	// 组件加载以后，为每张图片计算其位置的位置
	componentDidMount() {
		// Math.ceil：向上取整 Math.floor：向下取整
		// 拿到舞台的大小，需要获取舞台这个DOM节点
		let stageDOM = ReactDOM.findDOMNode(this.refs.stage),
			stageW = stageDOM.scrollWidth,
			stageH = stageDOM.scrollHeight,
			halfStageW = Math.ceil(stageW / 2),// 为了处理方便，这里转成整数
			halfStageH = Math.ceil(stageH / 2);

		// scrollWidth：对象的实际内容的宽度，不包含滚动条等边线宽度，会随对象中内容超过可视区后而变大。
		// clientWidth：对象内容的可视区的宽度，不包含滚动条等边线，会随对象显示大小的变化而改变。
		// offsetWidth：对象整体的实际宽度，包含滚动条等边线，会随对象显示大小的变化而改变。

		// 获取ImgFigure的大小
		let imgFigureDOM = ReactDOM.findDOMNode(this.refs.imgFigure0),
			imgW = imgFigureDOM.scrollWidth,
			imgH = imgFigureDOM.scrollHeight,
			halfImgW = Math.ceil(imgW / 2),
			halfImgH = Math.ceil(imgH / 2);

		// 计算各个Constant的值
		// 计算中心图片的位置点
		this.props.Constant.centerPos = {
			left: halfStageW - halfImgW,
			top: halfStageH - halfImgH
		};
		// 计算左右分区图片排布位置的取值范围
		this.props.Constant.hPosRange.leftSecX[0] = -halfImgW;
		this.props.Constant.hPosRange.leftSecX[1] = halfStageW - halfImgW * 3;
		this.props.Constant.hPosRange.rightSecX[0] = halfStageW + halfImgW;
		this.props.Constant.hPosRange.rightSecX[1] = stageW  - halfImgW;
		this.props.Constant.hPosRange.y[0] = -halfImgH;
		this.props.Constant.hPosRange.y[1] = stageH - halfImgH;
		// 计算上分区图片排布位置的取值范围
		this.props.Constant.vPosRange.x[0] = halfStageW - imgW;
		this.props.Constant.vPosRange.x[1] = halfStageW;
		this.props.Constant.vPosRange.topY[0] = -halfImgH;
		this.props.Constant.vPosRange.topY[1] = halfStageH - halfImgH * 3;

		// 指定图片数组中的第一张居中
		this.rearrange(0);
	}

	render() {
		// 两个list：包含一系列的图片和控制组件
		let controllerUnits = [],
			imgFigures = [];

		// 用图片数据来填充ImgFigure组件
		imageDatas.forEach(function(value, index){
			if(!this.state.imgsArrangeArr[index]){ // 如果当前没有这个状态对象
				this.state.imgsArrangeArr[index] = { // 初始化: 定位到左上角
					pos: {
						left: 0,
						top: 0
					},
					rotate: 0,
					isInverse: false,
					isCenter: false
				};
			}
			// 添加索引ref，方便定位不同的ImgFigure
			// arrange: 把每一个图片的状态信息传递给了这张图片对应的ImgFigure Component
			// inverse：具体到每个imgFigure，实际上他拿到的是inverse return的函数
			imgFigures.push(<ImgFigure key={index} data={value} ref={'imgFigure' + index} arrange={this.state.imgsArrangeArr[index]} inverse={this.inverse(index)} center={this.center(index)}/>);

			controllerUnits.push(<ControllerUnit key={index} arrange={this.state.imgsArrangeArr[index]} inverse={this.inverse(index)} center={this.center(index)}/>);
		}.bind(this));
		// bind(this): 把react component对象传递到function中，这样可以直接调用this

		return (
			// 使用ref属性给子组件添加命名
			<section className="stage" ref="stage">
				<section className="img-sec">
					{imgFigures}
				</section>
				<nav className="controller-nav">
					{controllerUnits}
				</nav>
			</section>
		);
	}
}

AppComponent.defaultProps = {
};

export default AppComponent;