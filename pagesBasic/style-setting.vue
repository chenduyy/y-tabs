<template>
	<view class="page-container">
		<view class="title-wrap">
			设置标签栏相关颜色、样式（tabs props）
			<view class="title-wrap__desc">1、自定义标签主题色(color)</view>
			<view class="title-wrap__desc">2、标题文字默认/选中颜色(titleInactiveColor/titleActiveColor)</view>
			<view class="title-wrap__desc">3、标签栏背景色(background)</view>
		</view>
		<y-tabs v-model="activeIndex" color="#ee0a24" background="#fff" titleActiveColor="#ee0a24"
			titleInactiveColor="#333">
			<y-tab class="y-tab-virtual" v-for="item in tabs" :key="item.key" :title="item.title">
				<view class="content-wrap"> 内容{{item.key}} </view>
			</y-tab>
		</y-tabs>

		<view class="title-wrap">
			设置标题项默认/选中样式（tabs props）
			<view class="title-wrap__desc">标题项默认样式: titleInactiveStyle </view>
			<view class="title-wrap__desc">标题项选中样式: titleActiveStyle </view>
		</view>
		<y-tabs v-model="activeIndex" color="#ee0a24" background="#fff" :titleInactiveStyle="titleInactiveStyle"
			:titleActiveStyle="titleActiveStyle">
			<y-tab class="y-tab-virtual" v-for="item in tabs" :key="item.key" :title="item.title">
				<view class="content-wrap"> 内容{{item.key}} </view>
			</y-tab>
		</y-tabs>

		<view class="title-wrap">
			设置单个标题项样式：titleStyle （tab props）
			<view class="title-wrap__desc" style="color: #ee0a24;">优先级：</view>
			<view class="title-wrap__desc" style="color: #666;">titleStyle > titleInactiveStyle、titleActiveStyle > titleInactiveColor、titleActiveColor</view>
		</view>
		<y-tabs v-model="activeIndex" color="#ee0a24" background="#fff">
			<y-tab class="y-tab-virtual" v-for="(item,index) in tabs" :key="item.key" :title="item.title"
				:titleStyle="titleStyle(index)">
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
				activeIndex: 0,
				titleActiveStyle: { color: '#ee0a24', fontWeight: '600', },
				titleInactiveStyle: { color: '#666' },
			}
		},
		methods: {
			titleStyle(index) {
				return index === this.activeIndex ? this.titleActiveStyle : {}
			}
		},
	}
</script>