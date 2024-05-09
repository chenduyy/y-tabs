<template>
	<view class="page-container">
		<view class="title-wrap">
			自定义标题
			<view class="title-wrap__desc">1、标题插槽名默认为title,是作用域插槽</view>
			<view class="title-wrap__desc">2、vue3中仅H5、app-vue有效，小程序端无效</view>
		</view>
		<y-tabs v-model="activeIndex">
			<template #title0>
				自定义标题
			</template>
			<y-tab class="y-tab-virtual" v-for="item in tabs" :key="item.key" :title="item.title">
				<view class="content-wrap"> 内容{{item.key}} </view>
			</y-tab>
		</y-tabs>

		<view class="title-wrap">
			自定义标签栏左侧、右侧内容
			<view class="title-wrap__desc">通过插槽nav-left、nav-right自定义</view>
		</view>
		<y-tabs v-model="activeIndex">
			<!-- 标签栏右侧内容 -->
			<template #nav-left>
				<uni-icons type="back" size="20" />
			</template>
			<template #nav-right>
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

		<y-tabs v-model="activeIndex" type="line" color="#000" bar-height="7px" :bar-style="{backgroundColor:'transparent'}">
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
	const barBg = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAOCAYAAABdC15GAAAACXBIWXMAABYlAAAWJQFJUiTwAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAFxSURBVHgBzZNRTsJAEIb/WTW+lpiY+FZPIDew3ABP4GJ8hxsI9zBpOYHeQDwBPQI+mRiRvpLojtPdYhCorQqF/6GdbGd2vvwzBXZcNAt4oj1ANeUoAT5iqkUjbEFLHNmhD1YPEvpZ3ghkGlVDCkc94/BmHMq998I5ONiY1ZBfpKAyuOtgAc5yOEDmYEWNh32BHF91sGHZHmwW4azciN9aQwnz3SJEgOmte+R2tdLprTYoa50mvuomlLpD4Y3oQZnov6D2RzCqI93bWOHaEmAGqQUyRBlZR1WfarcD/EJ2z8DtzDGvsMCwpm8XOCfDUsVOCYhiqRxI/CTQo4UOvjzO7Pow18vfywneuUHHUUxLn55lLw5JFpZ8bEUcY8oXdOLWiHLTxvoGpLqoUmy6dBT15o/ox3znpoycAmxUsiJTbs1cmxeVKp+0zmFIS7bGWiVghC7Vwse8jFKAX9eljh4ggKLLv7uaQvG9/F59Oo2SouxPu7OTCxN/s8wAAAAASUVORK5CYII=";
	export default {
		data() {
			return {
				tabs: this.$getTabs(),
				activeIndex: 0,
				barBg,
			}
		},
		computed:{
			barInnerStyle(){
				return {
					width:'100%',
					height:'100%',
					background:`url(${this.barBg}) 100% 100% `,
					backgroundSize:'cover'
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