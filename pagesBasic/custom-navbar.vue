<template>
	<view class="page-container">
		<uni-nav-bar class="navBar" shadow fixed statusBar :border="false" title="自定义导航栏" :left-icon="leftIcon" @clickLeft="clickLeft"></uni-nav-bar>
		<view class="title-wrap">
			自定义导航栏下的标签页滚动吸顶
			<view class="title-wrap__desc">使用sticky属性开启吸顶</view>
			<view class="title-wrap__desc">通过设置offsetTop避免标签栏被自定义导航栏遮挡</view>
		</view>
		<y-tabs v-model="activeIndex" sticky :offsetTop="offsetTop">
			<y-tab class="y-tab-virtual" v-for="item in tabs" :key="item.key" :title="item.title">
				<view class="content-wrap" :style="{backgroundColor: item.color,height:'auto',color:'#fff'}">
					<view> 内容{{item.key}}</view>
					<view v-for="num in numList" :key="num">{{num}}</view>
				</view>
			</y-tab>
		</y-tabs>
	</view>
</template>

<script>
	import { getRect, getHeaderHeight } from "@/common/uitls"
	export default {
		data() {
			return {
				tabs: this.$getTabs(),
				activeIndex: 0,
				offsetTop: 0, //粘性定位布局下与顶部的最小距离
				numList: Array.from({ length: 20 }, (_, i) => i + 1)
			}
		},
		computed: {
			// 自定义导航栏返回箭头
			leftIcon() {
				// 支付宝即便设置了自定义导航栏，目前无法去掉原生导航栏的返回箭头，因此nav-bar在支付宝小程序中无需设置箭头
				// #ifdef MP-ALIPAY
				return ""
				// #endif
				// #ifndef MP-ALIPAY
				return "left"
				// #endif
			},
		},
		onReady() {
			this.setOffsetTop();
		},
		methods: {
			clickLeft() {
				uni.navigateBack();
			},
			async setOffsetTop() {
				// H5端通过查询节点信息获取导航栏高度作为吸顶距离
				// #ifdef H5
				const rect = await getRect('.navBar', this)
				this.offsetTop = rect?.height || 0;
				// #endif

				// 非H5端通过状态栏+导航栏高度计算offset
				// #ifndef H5
				this.offsetTop = getHeaderHeight().navHeight;
				// #endif


			},
		}
	}
</script>