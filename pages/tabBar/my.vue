4<template>
	<view class="container">
		<!-- <button size="mini" type="primary" style="margin: 10rpx;" @click="()={}">toPage</button> -->
		<y-tabs ref="tabs" v-model="activeIndex" scroll-threshold="3" swipeable :ellipsis="false" barWidth="auto" direction="vertical">
			<!-- <y-tab class="y-tab-virtual" v-for="(tab,index) in tabs" :key="index"
				:title="tab.title+(index==2?'哈哈哈哈哈哈哈哈哈哈哈哈哈哈':'')">
				<view class="content-wrap" :style="{backgroundColor: tab.color}"> {{tab.title}}</view>
			</y-tab> -->
		<!-- 	<y-tab class="y-tab-virtual" v-for="(tab,index) in tabs" :key="index"
				:title="tab.title">
				<view class="content-wrap" :style="{backgroundColor: tab.color}"> {{tab.title}}</view>
			</y-tab> -->
			<!-- <y-tab class="y-tab-virtual" title="1111111">
				<view class="content-wrap"> 1111</view>
			</y-tab>
			<y-tab class="y-tab-virtual" title="2222222">
				<view class="content-wrap">
					<uni-datetime-picker type="date"  start="2021-3-20" end="2021-6-20" />
				</view>
			</y-tab> -->
		</y-tabs>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				tabs: this.$getTabs(5),
				activeIndex: 0,
			};
		},
		methods: {}
	};
</script>

<style lang="scss" scoped>
	.content-wrap {
		/* #ifndef H5 */
		min-height: calc(100vh - var(--window-top));
		/* #endif */
		/* #ifdef H5 */
		min-height: calc(100vh - 40px - var(--window-top) - var(--window-bottom));
		/* #endif */
		// display: flex;
		// justify-content: center;
		// align-items: center;
		// color: white;
		font-size: 50rpx;
		background-color: #fff;
	}
</style>