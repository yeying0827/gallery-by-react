require('normalize.css/normalize.css');
require('styles/App.scss');

import React from 'react';

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
// 利用自执行函数，将图片名信息转成图片URL路径信息
// 入参和结果的说明...
imageDatas = (
	function genImageURL(imageDatasArr){ // 参数：包含imageData的一个数据
		for (var i = 0, j = imageDatasArr.length; i < j; i++) {
			// 拿到单个的图片数据
			var singleImageData = imageDatasArr[i];
			singleImageData.imageURL = require('../images/' + singleImageData.fileName);
			imageDatasArr[i] = singleImageData;
		}

		return imageDatasArr;
	}
)(imageDatas);

class AppComponent extends React.Component {
  render() {
    return (
      <section className="stage">
        <section className="img-sec">
        </section>
        <nav className="controller-nav">
        </nav>
      </section>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
