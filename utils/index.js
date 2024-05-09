// 腾讯云图片基础路径
export const imgUrl = 'https://file-resource-1312729391.cos.ap-guangzhou.myqcloud.com/';

export function getTabs(length = 5) {
	return Array.from({ length }, (o, i) => {
		return {
			key: i + 1,
			title: '标签' + (i + 1),
			color: getRandomColor()
		}
	});
}

// 生成随机颜色
export function getRandomColor() {
	const rgb = [];
	for (let i = 0; i < 3; ++i) {
		let color = Math.floor(Math.random() * 256).toString(16)
		color = color.length === 1 ? '0' + color : color
		rgb.push(color)
	}
	return '#' + rgb.join('');
}