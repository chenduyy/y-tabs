<template>
	<view class="container">
		<view class="banner-wrap">
			<banner />
		</view>
		<!-- 
		 滚动导航(页面级滚动) :
			开启pageScroll属性，即为页面级的滚动导航模式:页面滚动时，如果设置了sticky，标题栏会跟随页面的滚动自动吸顶 
		-->
		<y-tabs v-model="activeIndex" :color="' '" bar-height="5" :bar-style="barStyle" title-active-color="#333" title-inactive-color="#777" sticky :offset-top="offsetTop"
			scrollspy page-scroll>
			<y-tab v-for="(title, index) in tabs" :title="title" :key="title">
				<view class="title-wrap" v-if="index!==0">{{title}}</view>
				<card-list :activeIndex="index" />
			</y-tab>
		</y-tabs>
	</view>
</template>

<script>
	import banner from '@/pagesExample/components/banner-zs'
	import cardList from '@/pagesExample/components/card-list'
	export default {
		components: {
			banner,
			cardList
		},
		data() {
			return {
				tabs: ['最新上线', '任务中心', '新户专享礼', '月月有好礼', '推荐好友礼', '联名卡专区'],
				activeIndex: 0, // 标签页当前选择项的下标
				offsetTop: 0, //粘性定位布局下与顶部的最小距离
				barStyle: {
					backgroundColor: 'transparent',
					backgroundImage: 'linear-gradient(to right, rgba(255, 0, 0, 0.8), rgba(255, 0, 0, 0.2))',
				}
			}
		},
		mounted() {
			// #ifdef H5
			this.offsetTop = 44
			// #endif
		},
	}
</script>

<style lang="scss" scoped>
	.container {
		background-color: #fff;


		.title-wrap {
			font-size: 32rpx;
			font-weight: 620;
			padding: 16px 16px 10px;
		}

	}

	::v-deep .banner-wrap {
		padding: 10px 16px;

		.banner-wrapper {
			background-color: transparent;
			box-shadow: 0px 0px 8px 4px rgba(0, 0, 0, 0.04);
		}

		.uni-swiper__warp,
		.banner-wrapper,
		.swiper-item,
		.swpier-item-wrap,
		.swiper-box .swpier-item-img {
			border-radius: 6px !important;
		}
	}

	::v-deep .y-tabs {
		.y-tabs__wrap {
			border-bottom: 1px solid #eee;
		}

		.y-tab {
			padding: 0 20px !important;

			&.is-active {
				transform: scale(1.2);
				font-weight: 620;
			}
		}
	}
</style>