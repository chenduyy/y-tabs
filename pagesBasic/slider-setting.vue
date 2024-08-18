<template>
	<view class="page-container">
		<view class="title-wrap">
			滑块设置
			<view class="title-wrap__desc">bar-width：设置滑块宽度</view>
			<view class="title-wrap__desc">bar-height：设置滑块高度</view>
			<view class="title-wrap__desc">默认单位为px, 支持数字、rpx、vh、vw等单位及calc() 函数，也可传入'auto'值。 </view>
			<view class="title-wrap__desc">仅支持type为line、button、line-button。</view>
			<view class="title-wrap__desc">bar-style：设置滑块样式，优先级低于bar-width、bar-height</view>
		</view>

		<view class="title-wrap">
			bar-width、bar-height默认值
			<view class="title-wrap__desc">bar-width：签栏水平/垂直展示时,type为line,宽度默认为20px/3px,
				而type为button、line-button时,宽度默认为选中标签宽度-8px。 </view>
			<view class="title-wrap__desc">bar-width：标签栏水平/垂直展示时,type为line,高度默认为3px/20px,
				而type为button、line-button时,宽度默认为选中标签高度-8px。 。</view>
		</view>
		<y-tabs v-model="activeIndex" color="#ee0a24" bar-width="24" bar-height="4">
			<y-tab class="y-tab-virtual" v-for="item in tabs" :key="item.key" :title="item.title">
				<view class="content-wrap"> 内容{{item.key}} </view>
			</y-tab>
		</y-tabs>

		<view class="title-wrap">
			设置bar-width为auto，让底部条自适应标签宽度
		</view>
		<y-tabs v-model="activeIndex" color="#ee0a24" bar-width="auto" :ellipsis="false">
			<y-tab class="y-tab-virtual" v-for="item in tabs" :key="item.key"
				:title="item.key==2?'我是超长文本标签':item.title">
				<view class="content-wrap"> 内容{{item.key}} </view>
			</y-tab>
		</y-tabs>

		<view class="title-wrap">
			通过bar-style设置滑块背景图
		</view>
		<y-tabs v-model="activeIndex" color="#ee0a24" bar-width="20" bar-height="7" :bar-style="barStyle">
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
				barBg
			}
		},
		computed: {
			barStyle() {
				return {
					background: `url(${this.barBg}) 100% 100% `,
					backgroundSize: 'cover'
				}
			}
		}
	}
</script>