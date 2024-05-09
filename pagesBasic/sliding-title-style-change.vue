<template>
	<view class="page-container">
		<view class="title-wrap">
			滑动切换时改变标题颜色
			<view class="title-wrap__desc">1.通过swipeable开启手势滑动切换,并开启标签内容的拖动动画（swipeAnimated）</view>
			<view class="title-wrap__desc">2.监听slide-change,获取内容滑动的距离,在达到预设阈值时改变标签样式</view>
			<view class="title-wrap__desc">2.本案例演示在拖动内容页时滑动距离达到阈值(slidingThreshold)时改变标题颜色</view>
		</view>
		<y-tabs v-model="activeIndex" swipeable @slide-change="slideChange" color="#ff9900" @change="onChange">
			<y-tab class="y-tab-virtual" v-for="(item,index) in tabs" :key="item.key" :title="item.title" :titleStyle="getTitleStyle(index)">
				<view class="content-wrap" :style="{backgroundColor: item.color,height:'40vh',color:'#fff'}"> 内容{{item.key}} </view>
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
				slideIndex: 0, //达到滑动阈值的下标,在当前案例中用于设置标题颜色
			}
		},
		methods: {
			// 内容页滑动时触发（仅barAnimateMode为linear、worm、worm-ease时有效）
			slideChange({ dx, rate, targetIndex }) {
				// barAnimateMode默认为linear，滑动距离dx大于预设的阈值slidingThreshold=120 时，表示目标下标为切换的下标
				// barAnimateMode为worm、worm-ease时，一半的内容区域宽度才是预设的切换阈值，可以通过rate大于0.5表示目标下标为切换的下标
				this.slideIndex = Math.abs(dx) > 120 ? targetIndex : this.activeIndex;
			},
			getTitleStyle(index) {
				return { color: this.slideIndex === index ? "#ff9900" : "#323233" }
			},
			// 当前激活的标签改变时触发
			onChange(index) {
				// 触发change时把slideIndex设为当前下标,避免样式不改变
				this.slideIndex = index;
			}
		}
	}
</script>