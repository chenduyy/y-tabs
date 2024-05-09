<template>
	<view class="container">
		<view class="banner-wrap">
			<banner />
		</view>
		<y-tabs v-model="activeIndex" background="rgba(255,255,255,0)" sticky :offsetTop="offsetTop" scrollspy transparent>
			<y-tab class="y-tab-virtual" v-for="(title, index) in tabs" :title="title" :key="index">
				<view>
					<view class="title-wrap">{{title}}</view>
					<goods-list :activeIndex="index" class="goods-item" />
				</view>
			</y-tab>
		</y-tabs>
		<view class="placeholder-block2"></view>
	</view>
</template>

<script>
	import banner from '@/components/banner-ad';
	import goodsList from '@/components/goods-list';
	export default {
		components: {
			banner,
			goodsList
		},
		data() {
			return {
				tabs: ['618返场', '颜值水杯', '家居日用', '冲调零食'],
				activeIndex: 0, // 标签页当前选择项的下标
				offsetTop: 0 //粘性定位布局下与顶部的最小距离
			};
		},
		created() {
			// #ifdef H5
			this.offsetTop = 44;
			// #endif
		},
	};
</script>

<style lang="scss" scoped>
	.container {

		.title-wrap {
			position: relative;
			font-size: 32rpx;
			font-weight: 620;
			padding: 16px 16px 10px;
		}

		.goods-item {
			position: relative;
		}

		::v-deep .banner-wrap {
			margin-bottom: 20px;
		}


		::v-deep .y-tabs {

			// 滑块内容
			.y-tabs__bar-inner {
				background-color: transparent;
				background-image: linear-gradient(to right, rgba(255, 0, 0, 0.8), rgba(255, 0, 0, 0.2));
			}
		}
	}
</style>