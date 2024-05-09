<template>
	<view class="y-no-data" :style="innerStyle">
		<image class="image-wrapper" mode="widthFix" :src="imgUrl" />
		<view class="desc-wrapper">{{description}}</view>
	</view>
</template>

<script>
	export default {
		props: {
			// 图片下方的描述文字
			description: {
				type: String,
				default: "暂无数据"
			},
			// 容器内边距
			padding: {
				type: String,
				default: "40rpx 0"
			}
		},
		computed: {
			innerStyle() {
				return {
					padding: this.padding
				}
			}
		},
		data() {
			return {
				imgUrl: this.$imgUrl + 'public/no-data.png',
			}
		}
	}
</script>

<style lang="scss" scoped>
	.y-no-data {
		text-align: center;

		.image-wrapper {
			width: 300rpx;
		}

		.desc-wrapper {
			font-size: 12px;
			padding: 12rpx 32rpx;
			color: #666;
			text-align: center;
		}
	}
</style>
