<template>
	<view class="page-container" :style="{paddingTop:navHeight+'px'}">
		<uni-fab ref="fab" :pattern="pattern" horizontal="right" :popMenu="false" @fabClick="fabClick" />
		<view class="info-wrap">
			<h3>透明导航栏下的滚动吸顶</h3>
			<view>在导航栏+状态栏透明的场景下的标签栏吸顶。</view>
			<view>本案例在微信小程序中，未吸顶时，标签栏背景色为灰色；吸顶时，标签栏背景色为白色，显示一个固定在顶部的白色遮罩层，用于遮挡透明的状态栏+导航栏区域</view>
		</view>

		<!-- 固定在顶部的用于遮住状态栏+透明导航栏的遮罩区域（吸顶时才给定高度显示出来） -->
		<view class="fixed-mask" :style="[fixedMaskStyle]"></view>

		<y-tabs v-model="activeIndex" :background="background" sticky :offsetTop="navHeight"
			@sticky-change="stickyChange">
			<y-tab class="y-tab-virtual" v-for="(title, index) in tabs" :title="title" :key="index">
				<goods-list :activeIndex="index" />
			</y-tab>
		</y-tabs>
	</view>
</template>

<script>
	import goodsList from '@/components/goods-list';
	import { getHeaderHeight } from "@/common/uitls"

	export default {
		options: {
			styleIsolation: 'shared' // shared:表示页面 wxss 样式将影响到自定义组件
		},
		components: {
			goodsList
		},
		data() {
			return {
				tabs: ['618返场', '颜值水杯', '家居日用', '冲调零食'],
				activeIndex: 0, // 标签页当前选择项的下标
				// 标签页滚动吸顶相关
				offsetTop: 0, //粘性定位布局下与顶部的最小距离
				navHeight: 0, //顶部导航区域高度
				isFixed: false, //标签栏是否滚动吸顶
				// fab按钮相关
				pattern: {
					color: '#7A7E83',
					backgroundColor: '#fff',
					selectedColor: '#007AFF',
					buttonColor: '#007AFF',
					iconColor: '#fff'
				},
			}
		},
		computed: {
			// 标签栏背景色
			background() {
				// 吸顶时标签栏背景色为白色，否则为灰色
				return this.isFixed ? "#FFF" : "#F5F5F5"
			},
			// 固定在顶部的用于遮住状态栏+透明导航栏的遮罩区域（吸顶时才给定高度显示出来）
			fixedMaskStyle() {
				return {
					position: this.isFixed ? 'fixed' : 'static',
					height: this.isFixed ? this.navHeight + 'px' : 0,
					top: 0,
					left: 0,
					right: 0,
					background: "#fff",
					zIndex: 99,
				}
			},
		},
		mounted() {
			// 由于设置了"navigationStyle": "custom",窗口为沉浸式,因此导航区域高度为导航栏高度+状态栏高度
			// #ifndef H5
			this.navHeight = getHeaderHeight().navHeight;
			// #endif
			// app需要减去44px的导航栏高度
			// #ifdef APP-PLUS
			this.navHeight -= 44;
			// #endif
		},
		methods: {
			// 吸顶时触发，仅在 sticky 模式下生效
			stickyChange(res) {
				this.isFixed = res.isFixed
			},
			fabClick() {
				uni.navigateBack({ delta: 1 });
			},
		}
	}
</script>
<style lang="scss" scoped>
	.page-container {

		.extra-wrapper {
			padding: 0 12rpx;
			font-size: 24rpx;
			height: 80rpx;
			display: flex;
			align-items: center;
		}


		.info-wrap {
			padding: 24rpx;
			font-size: 24rpx;
			line-height: 40rpx;

			.collapse-content {
				padding-left: 20rpx;
				font-size: 24rpx;
			}
		}

		::v-deep .uni-fab__circle {
			transform: rotate(135deg);
		}
	}
</style>