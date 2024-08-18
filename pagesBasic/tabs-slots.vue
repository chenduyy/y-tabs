<template>
	<view class="page-container">
		<view class="title-wrap">
			自定义标题
			<view class="title-wrap__desc">1、如果我们要自定义标题，可使用插槽的形式。</view>
			<view class="title-wrap__desc">
				2、标题插槽名默认为'title'+y-tab的下标（比如第一个y-tab，它的默认插槽名称就是'title0'）。也可以在y-tab上传入titleSlotName属性来设置标题插槽的name值
			</view>
			<view class="title-wrap__desc">3、需要注意的是，在vue3版本的小程序端中自定义标题插槽无效，给y-tab设置titleSlot属性就可解决该问题</view>
		</view>
		<y-tabs v-model="activeIndex2">
			<template #title0>
				自定义标题
			</template>
			<template #customSlotName>
				自定义标题插槽名
			</template>
			<y-tab class="y-tab-virtual" titleSlot>
				<view class="content-wrap"> 自定义标题文本..... </view>
			</y-tab>
			<y-tab class="y-tab-virtual" titleSlot titleSlotName="customSlotName">
				<view class="content-wrap"> 自定义标题插槽名... </view>
			</y-tab>
			<y-tab class="y-tab-virtual" title="标题3">
				<view class="content-wrap"> 标题3 </view>
			</y-tab>
		</y-tabs>

		<view class="title-wrap">
			自定义标签栏左侧、右侧内容
			<view class="title-wrap__desc">通过插槽navLeft、navRight自定义</view>
		</view>
		<y-tabs v-model="activeIndex">
			<!-- 标签栏右侧内容 -->
			<template #navRight>
				<uni-icons type="bars" size="20" />
			</template>
			<y-tab class="y-tab-virtual" v-for="item in tabs" :key="item.key" :title="item.title">
				<view class="content-wrap"> 内容{{item.key}} </view>
			</y-tab>
		</y-tabs>

		<view class="title-wrap">
			自定义滑块内容
			<view class="title-wrap__desc">通过插槽bar自定义滑块内容</view>
			<view class="title-wrap__desc">仅支持type为line、button、line-button。</view>
			<view class="title-wrap__desc">如果使用了插槽自定义内容，那么bar-width、bar-height设置就无效了。</view>
		</view>

		<y-tabs v-model="activeIndex" type="line" color="#000" bar-height="7px"
			:bar-style="{backgroundColor:'transparent'}">
			<template #bar>
				<view :style="[barInnerStyle]" />
			</template>
			<y-tab class="y-tab-virtual" v-for="item in tabs" :key="item.key" :title="item.title">
				<view class="content-wrap"> 内容{{item.key}} </view>
			</y-tab>
		</y-tabs>
	</view>
</template>

<script>
	const barBg =
		"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAOCAYAAABdC15GAAAACXBIWXMAABYlAAAWJQFJUiTwAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAFxSURBVHgBzZNRTsJAEIb/WTW+lpiY+FZPIDew3ABP4GJ8hxsI9zBpOYHeQDwBPQI+mRiRvpLojtPdYhCorQqF/6GdbGd2vvwzBXZcNAt4oj1ANeUoAT5iqkUjbEFLHNmhD1YPEvpZ3ghkGlVDCkc94/BmHMq998I5ONiY1ZBfpKAyuOtgAc5yOEDmYEWNh32BHF91sGHZHmwW4azciN9aQwnz3SJEgOmte+R2tdLprTYoa50mvuomlLpD4Y3oQZnov6D2RzCqI93bWOHaEmAGqQUyRBlZR1WfarcD/EJ2z8DtzDGvsMCwpm8XOCfDUsVOCYhiqRxI/CTQo4UOvjzO7Pow18vfywneuUHHUUxLn55lLw5JFpZ8bEUcY8oXdOLWiHLTxvoGpLqoUmy6dBT15o/ox3znpoycAmxUsiJTbs1cmxeVKp+0zmFIS7bGWiVghC7Vwse8jFKAX9eljh4ggKLLv7uaQvG9/F59Oo2SouxPu7OTCxN/s8wAAAAASUVORK5CYII=";
	export default {
		data() {
			return {
				tabs: this.$getTabs(),
				activeIndex: 0,
				activeIndex2: 0,
				barBg,
			}
		},
		computed: {
			barInnerStyle() {
				return {
					width: '100%',
					height: '100%',
					background: `url(${this.barBg}) 100% 100% `,
					backgroundSize: 'cover'
				}
			}
		}
	}
</script>
<style lang="scss" scoped>
	::v-deep .uni-icons {
		padding: 0 6px;
	}
</style>