<template>
	<view class="page-container">
		<view class="title-wrap" style="line-height: 30px;">
			<view style="font-size: 28rpx;padding-top: 20px;">通过 ref 可以获取到 Tabs 实例并调用实例方法</view>
			<view class="title-wrap__desc" style="color:red">注意: 如果是vue3的组合式API,请使用vue3的写法</view>
		</view>

		<view class="title-wrap" style="padding-top: 10px;">
			1.resize
			<view class="title-wrap__desc">外层元素大小或组件显示状态变化时，可以调用此方法来触发重绘。</view>
			<view class="title-wrap__desc">如果滑块错位、标签内容滚动时无法定位到正确的标签时，都可调用该方法。</view>
		</view>
		<button size="mini" type="primary" style="margin: 0 0 10rpx 30rpx;" @click="handleResize">调用resize</button>
		<view :style="{paddingLeft:paddingLeft+'px'}">
			<y-tabs ref="tabs" v-model="activeIndex">
				<y-tab class="y-tab-virtual" v-for="item in tabs" :key="item.key" :title="item.title">
					<view class="content-wrap">内容{{item.key}}</view>
				</y-tab>
			</y-tabs>
		</view>

		<view class="title-wrap">
			2.其他方法(在这里不做演示)
			<view class="title-wrap__desc">reset：重置组件的一些状态，并调用了resize方法进行数据初始化</view>
			<view class="title-wrap__desc">scrollTo：滚动到指定的标签页，在滚动导航模式下可用</view>
			<view class="title-wrap__desc">setDx：设置滑块的水平偏移量（结合swiper组件的@transition事件，设置滑块的位置）</view>
			<view class="title-wrap__desc">unlockDx：解除对setDx()的锁定（结合swiper组件的@animationfinish事件，在动画完成后不锁定setDx）</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				tabs: this.$getTabs(),
				activeIndex: 0,
				paddingLeft: 0,
			}
		},
		methods: {
			handleResize() {
				this.paddingLeft = this.paddingLeft === 20 ? 0 : 20
				this.$nextTick(() => {
					this.$refs.tabs.resize() //调用组件实例方法
				})
			},
		}
	}
</script>