/**
 * 判断传入的值是否为空
 * @param {*} val 
 * @returns 
 */
export function isNull(val) {
	if (typeof val == "boolean") {
		return false;
	}
	if (typeof val == "number") {
		return false;
	}
	if (val instanceof Array) {
		if (val.length == 0) return true;
	} else if (val instanceof Object) {
		if (JSON.stringify(val) === "{}") return true;
	} else {
		if (
			val == "null" ||
			val == null ||
			val == "undefined" ||
			val == undefined ||
			val == ""
		)
			return true;
		return false;
	}
	return false;
}

// 不为空
export function isDef(val) {
	return val !== undefined && val !== null;
}

// 是否是一个数字
export function isNumeric(val) {
	return /^\d+(\.\d+)?$/.test(val);
}

// 是一个对象
export function isObject(val) {
	return Object.prototype.toString.call(val) === "[object Object]"
}

// 是一个字符串
export function isString(val) {
	return Object.prototype.toString.call(val) === "[object String]"
}




// 添加单位
export function addUnit(value) {
	if (!isDef(value)) {
		return undefined;
	}

	value = String(value);
	return isNumeric(value) ? `${value}px` : value;
}

// 获得角度
export function getAngle(angx, angy) {
	return Math.atan2(angy, angx) * 180 / Math.PI;
};

// 根据起点终点返回方向 1向上 2向下 3向左 4向右 0未滑动
export function getDirection(startx, starty, endx, endy) {
	var angx = endx - startx;
	var angy = endy - starty;
	var result = 0;

	// 如果滑动距离太短
	if (Math.abs(angx) < 5 && Math.abs(angy) < 5) {
		return result;
	}

	var angle = getAngle(angx, angy);
	if (angle >= -160 && angle <= -20) {
		result = 1;
	} else if (angle > 20 && angle < 160) {
		result = 2;
	} else if ((angle >= 160 && angle <= 180) || (angle >= -180 && angle < -160)) {
		result = 3;
	} else if (angle >= -20 && angle <= 20) {
		result = 4;
	}

	return result;
}

export function friendlyDate(timestamp) {
	var formats = {
		'year': '%n% 年前',
		'month': '%n% 月前',
		'day': '%n% 天前',
		'hour': '%n% 小时前',
		'minute': '%n% 分钟前',
		'second': '%n% 秒前',
	};

	var now = Date.now();
	var seconds = Math.floor((now - timestamp) / 1000);
	var minutes = Math.floor(seconds / 60);
	var hours = Math.floor(minutes / 60);
	var days = Math.floor(hours / 24);
	var months = Math.floor(days / 30);
	var years = Math.floor(months / 12);

	var diffType = '';
	var diffValue = 0;
	if (years > 0) {
		diffType = 'year';
		diffValue = years;
	} else {
		if (months > 0) {
			diffType = 'month';
			diffValue = months;
		} else {
			if (days > 0) {
				diffType = 'day';
				diffValue = days;
			} else {
				if (hours > 0) {
					diffType = 'hour';
					diffValue = hours;
				} else {
					if (minutes > 0) {
						diffType = 'minute';
						diffValue = minutes;
					} else {
						diffType = 'second';
						diffValue = seconds === 0 ? (seconds = 1) : seconds;
					}
				}
			}
		}
	}
	return formats[diffType].replace('%n%', diffValue);
}

// 获取元素的节点信息
export function getRect(selector, vm) {
	return new Promise((resolve, reject) => {
		if (!selector) reject('Parameter is empty');
		let query = null;
		// #ifdef MP-ALIPAY
		query = uni.createSelectorQuery();
		// #endif
		// #ifndef MP-ALIPAY
		query = uni.createSelectorQuery().in(vm);
		// #endif
		query.select(selector).boundingClientRect()
		query.exec(data => resolve(Array.isArray(data) ? data[0] : data));
	})
}


// 获取头部区域高度(状态栏+标签栏)
export function getHeaderHeight() {
	// 微信小程序 7.0+、百度小程序、H5、App（2.0.3+）支持navigationStyle设为custom，取消默认的原生导航栏
	const info = uni.getSystemInfoSync();
	let navHeight = 0;
	// console.log("info:", JSON.stringify(info));

	// App、微信小程序、支付宝小程序、百度小程序、抖音小程序、QQ小程序、快手小程序、京东小程序
	// #ifdef MP-WEIXIN || MP-ALIPAY || MP-BAIDU || MP-TOUTIAO || MP-QQ || MP-KUAISHOU || MP-JD
	const btnInfo = uni.getMenuButtonBoundingClientRect()
	// #endif

	// 微信/百度/快手/字节跳动/京东小程序
	// #ifdef MP-WEIXIN || MP-ALIPAY || MP-BAIDU || MP-KUAISHOU || MP-TOUTIAO || MP-JD
	// console.log("btnInfo:", JSON.stringify(btnInfo), info?.statusBarHeight);
	navHeight = btnInfo?.bottom + btnInfo?.top - info?.statusBarHeight;
	// #endif

	// APP
	// #ifdef APP-PLUS
	navHeight = (info?.statusBarHeight || 0) + 45
	// #endif

	// 支付宝小程序导航栏不支持自定义，但是可以通过改变透明度，使其隐藏，且不占据文档流
	// 支付宝的titleBarHeight为标题栏高度,statusBarHeight为状态栏高度
	// #ifdef MP-ALIPAY
	navHeight = info?.titleBarHeight + info?.statusBarHeight;
	// #endif
	
	// QQ在开发者工具中测试是根据top+buttom才能正确计算出高度
	// #ifdef MP-QQ 
	navHeight = btnInfo?.bottom + btnInfo?.top;
	// #endif

	// 飞书
	// #ifdef MP-LARK
	navHeight = info?.navigationBarSafeArea?.height + info?.navigationBarSafeArea?.top;
	// #endif
	return { navHeight }
}