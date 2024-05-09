// 不为空
export function isDef(val) {
	return val !== undefined && val !== null;
}

// 是否是一个数字
export function isNumeric(val) {
	return /^\d+(\.\d+)?$/.test(val);
}


/**
 * @description 添加单位，如果有rpx，upx，%，px等单位结尾或者值为auto，直接返回，否则加上px单位结尾
 * @param {string|number} value 需要添加单位的值
 * @param {string} unit 添加的单位名 比如px
 */
export function addUnit(value, unit = "px") {
	if (!isDef(value)) {
		return undefined;
	}

	value = String(value);
	return isNumeric(value) ? `${value}${unit}` : value;
}

/**
 * @description 用于获取用户传递值的px值  如果用户传递了"xxpx"或者"xxrpx"，取出其数值部分，如果是"xxxrpx"还需要用过uni.upx2px进行转换
 * @param {number|string} value 用户传递值的px值
 * @param {boolean} unit 
 * @returns {number|string}
 */
export function getPx(value, unit = false) {
	if (isNumeric(value)) {
		return unit ? `${value}px` : Number(value)
	}
	// 如果带有rpx，先取出其数值部分，再转为px值
	if (/(rpx|upx)$/.test(value)) {
		return unit ? `${uni.upx2px(parseInt(value))}px` : Number(uni.upx2px(parseInt(value)))
	}
	return unit ? `${parseInt(value)}px` : parseInt(value)
}