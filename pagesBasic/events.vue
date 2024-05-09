<template>
	<view class="page-container">
		<view class="title-wrap">
			事件 【请查看控制台打印】
			<view class="title-wrap__desc">click：点击标签时触发</view>
			<view class="title-wrap__desc">change：当前激活的标签改变时触发</view>
			<view class="title-wrap__desc">disabled：点击禁用的标签时触发</view>
			<view class="title-wrap__desc">rendered：标签内容首次渲染时触发（仅在开启延迟渲染isLazyRender后触发）</view>
			<view class="title-wrap__desc">loaded：组件内部初始化完成后调用（场景：在等待数据加载并且组件渲染出来前显示骨架屏，等组件初始化完成后在loaded中隐藏）</view>
			<view class="title-wrap__desc">slide-change：内容页滑动时触发，仅barAnimateMode为linear、worm、worm-ease时有效（场景：可用于滑动过程中改变标题样式）</view>
			<view class="title-wrap__desc">slide-end：内容页滑动结束时触发，仅barAnimateMode为linear、worm、worm-ease时有效</view>
		</view>
		<y-tabs v-model="activeIndex" is-lazy-render swipeable @click="handleClick" @change="handleChange" @rendered="handleRendered" @disabled="tabDislabled"
			@slide-change="slideChange" @slide-end="slideEnd">
			<y-tab class="y-tab-virtual" v-for="item in tabs" :key="item.key" :title="item.title" :disabled="item.key==4">
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
			handleClick(index) {
				console.log("click：", index);
			},
			handleChange(index) {
				console.log("change：", index);
			},
			handleRendered(index) {
				console.log("rendered：", index);
			},
			// 标签禁用触发的事件
			tabDislabled(index, title) {
				uni.showToast({
					icon: "none",
					title: "禁用：" + title
				})
			},
			// { dx：滑动距离； rate：当前滑动长度占滑动区域的比例；targetIndex：目标下标；} 
			slideChange({ dx, rate, targetIndex }) {
				console.log('slide-change', dx, rate, targetIndex);
			},
			slideEnd({ targetIndex }) {
				console.log('slide-end', targetIndex);
			}
		}
	}
</script>