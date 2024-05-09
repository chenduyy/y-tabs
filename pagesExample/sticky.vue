<template>
	<view class="page-container">
		<view class="info-wrap">
			<h3>滚动吸顶</h3>
			<view>使用sticky属性开启粘性定位布局,使标签栏吸顶</view>
			<view>可以监听@sticky-change事件，知道标签栏是否吸顶</view>
		</view>
		<y-tabs v-model="activeIndex" :background="'#fff'"  sticky :offsetTop="offsetTop">
			<y-tab class="y-tab-virtual" v-for="(title, index) in tabs" :title="title" :key="index">
				<goods-list :activeIndex="index" />
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
			}
		},
		created() {
			// #ifdef H5
			this.offsetTop = 43;
			// #endif
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
</style>
