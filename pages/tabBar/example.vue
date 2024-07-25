<template>
	<view class="page-container">
		<uni-list>
			<uni-list-item title="滑动切换" showArrow clickable @click="onClick('slide_switch')" />
			<uni-list-item title="滚动吸顶" showArrow clickable @click="onClick('sticky')" />
			<uni-list-item title="透明渐变标题栏" showArrow clickable @click="onClick('transparent-title-bar')" />
			<uni-list-item title="透明导航栏下的滚动吸顶" showArrow clickable @click="onClick('transparent_sticky')" />
			<uni-list-item title="在Popup中的标签页" showArrow clickable @click="onClick('in-the-popup')" />
			<uni-list-item title="与swiper组件联动-新闻列表" showArrow clickable @click="onClick('news/index')" />
			<uni-list-item title="滚动导航(页面级滚动)-仿招行热门活动" showArrow clickable @click="onClick('scrollspy')" />
			<uni-list-item title="滚动导航(区域滚动)-仿招行热门活动" showArrow clickable @click="onClick('scrollspy-area')" />
			<uni-list-item title="侧边栏导航(页面级滚动)-仿奶茶点单" showArrow clickable @click="onClick('scrollspy-vertical')" />
			<uni-list-item title="侧边栏导航(区域滚动)-仿奶茶点单" showArrow clickable @click="onClick('scrollspy-vertical-area')" />
			<uni-list-item title="组合导航(侧边栏导航+滚动导航)-仿京东商品分类" showArrow clickable @click="onClick('compose/index')" />
			<uni-list-item title="可收起标签页-防小红书标签栏(标签动态变化)" showArrow clickable @click="onClick('collapsible-tabs')" />
			<uni-list-item title="嵌套标签页" showArrow clickable @click="onClick('nested-tabs')" />
			<uni-list-item title="结合瀑布流" showArrow clickable @click="onClick('waterfall')" />
			<!-- <uni-list-item title="点击标签栏显示下拉popup" showArrow clickable @click="onClick('title-bar-click-popup')" /> -->
			<!-- <uni-list-item title="滚动吸顶+滑动切换" showArrow clickable @click="onClick('sticky_slide')" /> -->
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
				const url = `/pagesExample/${name}`
				console.log("页面路径：", url);
				uni.navigateTo({
					url,
				});
			}
		}
	}
</script>
