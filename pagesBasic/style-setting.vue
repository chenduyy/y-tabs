<template>
	<view class="page-container">
		<view class="title-wrap">
			设置标签栏相关颜色、样式
			<view class="title-wrap__desc">1、自定义标签主题色(color)</view>
			<view class="title-wrap__desc">2、标题文字默认/选中颜色(titleInactiveColor/titleActiveColor)</view>
			<view class="title-wrap__desc">3、标签栏背景色(background)</view>
			<view class="title-wrap__desc">4、底部线条宽度/高度(barWidth/barHeight)</view>
		</view>
		<y-tabs v-model="activeIndex" color="#ee0a24" background="#fff" titleActiveColor="#ee0a24" titleInactiveColor="#333">
			<y-tab class="y-tab-virtual" v-for="item in tabs" :key="item.key" :title="item.title">
				<view class="content-wrap"> 内容{{item.key}} </view>
			</y-tab>
		</y-tabs>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				tabs: this.$getTabs(),
				activeIndex: 0
			}
		},
	}
</script>