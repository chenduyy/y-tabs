<template>
	<view class="page-container">
		<view class="title-wrap">
			滚动吸顶
			<view class="title-wrap__desc">使用sticky属性开启</view>
			<view class="title-wrap__desc">示例中模拟了透明或者非透明导航栏下的滚动吸顶</view>
		</view>
		<y-tabs v-model="activeIndex" sticky :offsetTop="offsetTop">
			<y-tab class="y-tab-virtual" v-for="item in tabs" :key="item.key" :title="item.title">
				<view class="content-wrap" v-for="(idx) in 20" :key="idx">内容{{item.key}}</view>
			</y-tab>
		</y-tabs>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				tabs: this.$getTabs(),
				activeIndex: 0,
				offsetTop: 0, //粘性定位布局下与顶部的最小距离
			}
		},
		created() {
			// H5端的导航栏需处理一下
			// #ifdef H5
			this.offsetTop = 44;
			// #endif
		},
	}
</script>