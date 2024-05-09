<template>
	<view class="page-container">
		<view class="title-wrap">
			使用setTimeout模拟异步请求渲染标签页
		</view>
		<y-tabs v-model="activeIndex">
			<y-tab class="y-tab-virtual" v-for="item in tabs" :key="item.key" :title="item.title">
				<view class="content-wrap">内容{{item.key}}</view>
			</y-tab>
		</y-tabs>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				tabs: [],
				activeIndex: 0,
			}
		},
		created() {
			this.getTabs();
		},
		methods: {
			getTabs() {
				uni.showLoading({ title: '加载中...' })
				setTimeout(() => {
					this.tabs = Array.from({ length: 5 }, (o, i) => ({ key: i + 1, title: '标签' + (i + 1) }));
					uni.hideLoading();
				}, 500);
			},
		}
	}
</script>