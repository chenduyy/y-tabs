<template>
	<view class="page-container">
		<view class="title-wrap">
			滑动切换
			<view class="title-wrap__desc">1.通过swipeable开启手势滑动切换</view>
			<view class="title-wrap__desc">2.默认开启标签内容的拖动动画（swipeAnimated），建议将isLazyRender设为false效果更好一点</view>
			<view class="title-wrap__desc">3.该方式会和上下滑动有部分冲突，可将swipe-threshold设大一点</view>
			<view class="title-wrap__desc">
				4.如果无法接受与上下滑动有部分冲突，可使用swiper组件进行左右滑动切换，并结合scroll-view实现标签内容局部滚动，目前示例中的新闻列表就是采用此方式</view>
		</view>
		<y-tabs v-model="activeIndex" swipeable :barAnimateMode="barAnimateMode">
			<y-tab class="y-tab-virtual" v-for="(item,index) in tabs" :key="item.key" :title="item.title">
				<view class="content-wrap" :style="{backgroundColor: item.color,height:'30vh',color:'#fff'}">
					内容{{item.key}}
				</view>
			</y-tab>
		</y-tabs>

		<view class="title-wrap">
			滑动切换时滑块的动画效果
			<view class="title-wrap__desc">使用barAnimateMode设置，默认为linear(线性运动动画)。</view>
			<view class="title-wrap__desc">可选值为worm(毛毛虫蠕动)、worm-ease(毛毛虫缓动效果)、none(不设置)。</view>
		</view>
		<radio-group class="uni-list" @change="styleChange">
			<view v-for="(item, index) in styles" :key="index" class="uni-list-item">
				<view class="uni-list-item__container">
					<view class="uni-list-item__content">
						<text class="uni-list-item__content-title">{{ item.text }}</text>
					</view>
					<view class="uni-list-item__extra">
						<radio :value="item.value" :checked="barAnimateMode===item.value" />
					</view>
				</view>
			</view>
		</radio-group>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				tabs: this.$getTabs(15),
				activeIndex: 0,
				barAnimateMode: 'worm',
				styles: [{
						value: 'linear',
						text: '线性运动（默认）',
					},
					{
						value: 'worm',
						text: '毛毛虫'
					},
					{
						value: 'worm-worm',
						text: '毛毛虫缓动'
					},
					{
						value: 'none',
						text: '不需要动效'
					},
				],
			}
		},
		methods: {
			styleChange(e) {
				if (this.barAnimateMode !== e.detail.value) this.barAnimateMode = e.detail.value
			},
		}
	}
</script>
<style lang="scss" scoped>
	.page-container {

		.uni-list {
			flex: 1;
			margin-top: 15px;
		}

		.uni-list-item {
			display: flex;
			flex: 1;
			flex-direction: row;
			background-color: #FFFFFF;
		}


		.uni-list-item__container {
			padding: 12px 15px;
			width: 100%;
			flex: 1;
			position: relative;
			display: flex;
			box-sizing: border-box;
			flex-direction: row;
			justify-content: space-between;
			align-items: center;
			border-bottom-style: solid;
			border-bottom-width: 1px;
			border-bottom-color: #eee;
		}

		.uni-list-item__content-title {
			font-size: 14px;
		}
	}
</style>