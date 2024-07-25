<template>
	<view class="page-container">
		<y-tabs v-model="activeIndex" :background="'#fff'" swipeable :offsetTop="offsetTop" @slide-change="slideChange" @slide-end="slideEnd">
			<y-tab class="y-tab-virtual" v-for="(title, index) in tabs" :title="title" :key="index">
				<!-- 内容页滑动时锁住scroll-view的竖向滚动 -->
				<scroll-view class="scroll-wrap" :scroll-y="!locked && activeIndex===index?false:true"><goods-list :activeIndex="index" /></scroll-view>
			</y-tab>
		</y-tabs>
	</view>
</template>

<script>
	import goodsList from '@/components/goods-list';
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
				tabs: ['618返场', '颜值水杯', '家居日用', '冲调零食'],
				activeIndex: 0, // 标签页当前选择项的下标
				offsetTop: 0, //粘性定位布局下与顶部的最小距离
				locked: false 
			};
		},
		created() {
			// #ifdef H5
			this.offsetTop = 43;
			// #endif
		},
		methods:{
			// 内容滑动中触发
			slideChange() {
				this.locked = true
			},
			// 内容页滑动结束时触发
			slideEnd(){
				this.locked = false
			}
		}
	};
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
		height: calc(100vh - 44px);
		/* #endif */
		/* #ifdef H5 */
		height: calc(100vh - 88px);
		/* #endif */
	}
</style>