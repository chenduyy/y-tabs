<template>
	<!-- 顶部轮播区域 -->
	<view class="banner-wrapper">
		<uni-swiper-dot :info="swiperList" :current="current" field="content" mode="round" :dots-styles="dotsStyles">
			<swiper class="swiper-box" :autoplay="autoplay" :interval="interval" :duration="duration" @change="handleChange">
				<swiper-item v-for="(img ,index) in swiperList" :key="index" class="swpier-item-wrap">
					<view class="swiper-item">
						<image class="swpier-item-img" :src="img" />
					</view>
				</swiper-item>
			</swiper>
		</uni-swiper-dot>
	</view>
</template>

<script>
	export default {
		data() {
			return { // 顶部轮播区域相关
				swiperList: Array.from({
					length: 2
				}, (o, i) => `${this.$imgUrl}zs/banner${i+1}.png`),
				current: 0,
				autoplay: true,
				interval: 3000,
				duration: 500,
				dotsStyles: {
					width: 4,
					height: 4,
					bottom: 10,
					backgroundColor: '#C1C1C1',
					border: 'none',
					selectedBackgroundColor: '#fff',
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

		// 轮播
		.swiper-box {
			height: 280rpx;

			.swpier-item-img {
				width: 100%;
				height: 280rpx;
				border-radius: 12rpx;
			}
		}

	}
	
	// 指示点样式
	::v-deep .uni-swiper__dots-box {
		.uni-swiper__dots-long {
			width: 34rpx !important;
		}
	
		.uni-swiper__dots-item {
			margin-left: 24rpx;
	
			&:nth-child(1) {
				margin-left: 0;
			}
		}
	}
</style>
