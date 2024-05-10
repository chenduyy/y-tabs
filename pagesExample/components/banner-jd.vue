<template>
	<!-- 顶部轮播区域 -->
	<view class="banner-wrapper">
		<uni-swiper-dot :info="swiperList" :current="current" field="content" mode="round" :dots-styles="dotsStyles">
			<swiper class="swiper-box" :autoplay="autoplay" :interval="interval" :duration="duration"
				@change="handleChange">
				<swiper-item v-for="(img ,index) in swiperList" :key="index" class="swpier-item-wrap">
					<view class="swiper-item">
						<image class="swpier-item-img" :src="img" mode="scaleToFill" />
					</view>
				</swiper-item>
			</swiper>
		</uni-swiper-dot>
	</view>
</template>

<script>
	export default {
		// shared:表示页面 wxss 样式将影响到自定义组件
		options: {
			styleIsolation: 'shared'
		},
		data() {
			return { // 顶部轮播区域相关
				swiperList: Array.from({
					length: 2
				}, (o, i) => `${this.$imgUrl}jd/banner${i+1}.png`),
				current: 0,
				autoplay: false,
				interval: 3000,
				duration: 500,
				dotsStyles: {
					width: 8,
					height: 8,
					bottom: 10,
					backgroundColor: 'rgba(255, 255, 255, 0.75)',
					border: 'none',
					selectedBackgroundColor: '#f73420',
					selectedBorder: 'none'
				},
			}
		},
		mounted() {},
		methods: {
			handleChange(e) {
				this.current = e.detail.current
			}
		}
	}
</script>

<style lang="scss" scoped>
	// 顶部轮播banner区域
	.banner-wrapper {
		position: relative;
		margin: 20rpx 0;
		box-sizing: border-box;
	}
	
	.swpier-item-wrap {
		border-radius: 6px;
	}

	.swiper-item {
		margin: 0 10px 0 0;
	}

	// 轮播
	.swiper-box {
		height: 160rpx;

	}

	.swpier-item-img {
		width: 100%;
		height: 160rpx;
		border-radius: 12rpx;
	}
</style>