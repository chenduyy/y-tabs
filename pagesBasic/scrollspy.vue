<template>
	<view class="page-container">
		<view class="title-wrap">
			滚动导航
			<view class="title-wrap__desc">通过 scrollspy 属性可以开启滚动导航模式，该模式下，内容将会平铺展示</view>
			<view class="title-wrap__desc">默认该模式下，内容区域是页面级的滚动，而非scroll-view实现的局部滚动</view>
			<view class="title-wrap__desc">可通过组件的实例方法scrollTo进行标签内容的滚动定位</view>
			<view class="title-wrap__desc">当滚动到页面底部，最后一个内容高度不够时，可以设置activeLast定位到最后一个标签项</view>
			<button size="mini" type="primary" style="margin: 10rpx;" @click="handleScrollTo">滚动到第三个标签</button>
		</view>

		<y-tabs ref="tabs" v-model="activeIndex" sticky :offsetTop="offsetTop" scrollspy>
			<y-tab class="y-tab-virtual" v-for="item in tabs" :key="item.key" :title="item.title">
				<view class="content-wrap" :style="{backgroundColor: item.color,height:'60vh',color:'#fff'}"> 内容{{item.key}} </view>
			</y-tab>
		</y-tabs>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				tabs: this.$getTabs(10),
				activeIndex: 0,
				offsetTop: 0, //粘性定位布局下与顶部的最小距离
			}
		},
		created() {
			// #ifdef H5
			this.offsetTop = 44;
			// #endif
		},
		methods: {
			handleScrollTo() {
				this.$refs.tabs.scrollTo(2)
			}
		}
	}
</script>