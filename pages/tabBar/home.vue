<template>
	<view class="page-container">
		<!-- 固定在顶部的用于遮住状态栏+透明导航栏的遮罩区域（吸顶时才给定高度显示出来） -->
		<view class="fixed-mask" :style="[fixedMaskStyle]"></view>
		<banner />
		<y-tabs v-model="activeIndex" :background="background" animated sticky :closeCssSticky="false"
			:offsetTop="navHeight" @sticky-change="stickyChange" swipeable>
			<!-- 标签栏右侧内容 -->
			<template #navRight>
				<view class="nav-right-wrap">
					<text class="text">更多</text>
					<uni-icons type="right" :color="'#5e6d82'" size="14" />
				</view>
			</template>

			<y-tab class="y-tab-virtual" v-for="(title, index) in tabs" :title="title" :key="index">
				<goods-list :activeIndex="index" />
			</y-tab>
		</y-tabs>
	</view>
</template>

<script>
	import banner from '@/components/banner-ad';
	import goodsList from '@/components/goods-list';
	import { getHeaderHeight } from "@/common/uitls"

	export default {
		// shared:表示页面 wxss 样式将影响到自定义组件
		options: {
			styleIsolation: 'shared'
		},
		components: {
			banner,
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
		}
	}
</script>
<style lang="scss" scoped>
	.nav-right-wrap {
		padding: 0 12rpx;
		font-size: 22rpx;
		height: 80rpx;
		display: flex;
		align-items: center;

		.text {
			display: inline-block;
			white-space: nowrap;
			color: #5e6d82;
		}
	}
</style>