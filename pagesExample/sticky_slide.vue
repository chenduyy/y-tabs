<template>
	<view class="page-container">
		<view class="info-wrap">
			<h4 v-for="item in 20" :key="item">滚动吸顶+左右滑动</h4>
		</view>
		<y-tabs ref="yTabs" v-model="activeIndex" :background="'#fff'" swipeable >
			<y-tab class="y-tab-virtual" v-for="(tab, index) in tabs" :title="tab.title" :key="index">
				<scroll-view class="scroll-wrap" :scroll-y="scrollY" @scrolltoupper="scrolltoupper" :upper-threshold="0">
					<goods-list :activeIndex="index" />
				</scroll-view>
			</y-tab>
		</y-tabs>
	</view>
</template>

<script>
	import goodsList from '@/pagesExample/components/goods-list'

	// 需要将scroll-view的upper-threshold与页面的onReachBottomDistance都设置为0
	export default {
		// shared:表示页面 wxss 样式将影响到自定义组件
		options: {
			styleIsolation: 'shared'
		},
		components: {
			goodsList
		},
		data() {
			return {
				tabs: [
					{ title: "618返场", scrollTop: 0 },
					{ title: "颜值水杯", scrollTop: 0 },
					{ title: "家居日用", scrollTop: 0 },
					{ title: "冲调零食", scrollTop: 0 },
				],
				activeIndex: 0, // 标签页当前选择项的下标
				scrollY: false,
			}
		},
		// 页面滚动到底
		onReachBottom() {
			this.scrollY = true //开启scroll-view竖向滚动
		},
		methods: {
			// scroll-view滚动到顶部时触发
			scrolltoupper() {
				this.scrollY = false //关闭scroll-view竖向滚动
			},
		}
	}
</script>
<style lang="scss" scoped>
	.page-container {
		.info-wrap {
			padding: 24rpx;
			font-size: 26rpx;

		}

		.extra-wrapper {
			padding: 0 12rpx;
			font-size: 24rpx;
			height: 80rpx;
			display: flex;
			align-items: center;
		}

		::v-deep.fab-circle-icon {
			transform: rotate(135deg);
		}

		.collapse-content {
			padding-left: 10rpx;
		}
	}

	.scroll-wrap {
		/* #ifndef H5 */
		height: calc(100vh - 40px); //非H5端只需要减去标题栏高度
		/* #endif */
		/* #ifdef H5 */
		height: calc(100vh - 40px - 44px); //H5端看是否有导航栏减去44px
		/* #endif */
	}
</style>
