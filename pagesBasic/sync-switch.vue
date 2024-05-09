<template>
	<view class="page-container">
		<view class="title-wrap">
			异步切换
			<view class="title-wrap__desc">通过 before-change 属性可以在切换标签前执行特定的逻辑。</view>
			<view class="title-wrap__desc">返回 false 可阻止切换，支持返回 Promise。</view>
			<view class="title-wrap__desc">如下示例通过before-change阻止第2、4个标签切换。</view>
		</view>
		<y-tabs v-model="activeIndex" :before-change="beforeChange">
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
				tabs: this.$getTabs(),
				activeIndex: 0,
			}
		},
		methods: {
			beforeChange(index) {
				console.log("beforeChange：", index);
				// 返回 false 表示阻止此次切换
				if (index === 1) {
					uni.showToast({
						title: "已阻止",
						duration: 1000
					})
					return false;
				}
			
				// 返回 Promise 来执行异步逻辑
				return new Promise((resolve) => {
					// 在 resolve 函数中返回 true 或 false
					if (index === 3) {
						uni.showToast({
							title: "已阻止",
							duration: 1000
						})
					}
					resolve(index !== 3);
				});
			},
		}
	}
</script>