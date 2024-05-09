<template>
	<view class="page-container">
		<uni-list>
			<uni-list-item title="基础用法" showArrow clickable @click="onClick('params')" />
			<uni-list-item title="设置标签栏相关颜色、样式" showArrow clickable @click="onClick('style-setting')" />
			<uni-list-item title="滑块设置" showArrow clickable @click="onClick('slider-setting')" />
			<uni-list-item title="滑动切换" showArrow clickable @click="onClick('sliding-switch')" />
			<uni-list-item title="滑动切换时改变标题样式" showArrow clickable @click="onClick('sliding-title-style-change')" />
			<uni-list-item title="滚动吸顶" showArrow clickable @click="onClick('sticky')" />
			<uni-list-item title="滚动导航" showArrow clickable @click="onClick('scrollspy')" />
			<uni-list-item title="标签异步切换" showArrow clickable @click="onClick('sync-switch')" />
			<uni-list-item title="标签宽高动态变化" showArrow clickable @click="onClick('dynamic-tab')" />
			<uni-list-item title="插槽" showArrow clickable @click="onClick('tabs-slots')" />
			<uni-list-item title="事件" showArrow clickable @click="onClick('events')" />
			<uni-list-item title="实例方法" showArrow clickable @click="onClick('instance-method')" />
			<uni-list-item title="与swiper组件联动" showArrow clickable @click="onClick('linkage-with-swiper')" />
			<uni-list-item title="模拟异步请求渲染标签页" showArrow clickable @click="onClick('sync-request')" />
			<uni-list-item title="自定义navbar下的标签页" showArrow clickable @click="onClick('custom-navbar')" />
		</uni-list>
	</view>
</template>

<script>
	export default {
		data() {
			return {}
		},
		methods: {
			onClick(name) {
				const url = `/pagesBasic/${name}`
				console.log("页面路径：", url);
				uni.navigateTo({
					url,
				});
			}
		}
	}
</script>
<style lang="scss" scoped>

</style>
