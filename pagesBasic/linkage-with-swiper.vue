<template>
	<view class="page-container">
		<view class="title-wrap">
			与swiper组件联动
			<view class="title-wrap__desc">在swiper的@transition中调用setDx(), 通知y-tabs底部条位置的变化。</view>
			<view class="title-wrap__desc">在swiper的@animationfinish中调用unlockDx(),通知y-tabs放开对setDx()的锁定。</view>
			<view class="title-wrap__desc">需开启animated属性，如果需要毛毛虫蠕动的效果，设置barAnimateMode="worm"。</view>
			<view class="title-wrap__desc">请注意swiper组件的@transition、@animationfinish的支持平台。</view>
			<view class="title-wrap__desc">经过测试，仅支持App、H5、微信、支付宝、字节跳动、QQ、快手小程序。</view>
		</view>
		<y-tabs ref="tabs" v-model="activeIndex" animated :barAnimateMode="barAnimateMode">
			<y-tab v-for="(item, index) in tabs" :title="item.title" :key="index" />
		</y-tabs>

		<!-- 
			支持平台
			1. @transition: 支持App、H5、微信、支付宝、字节跳动、飞书、QQ、快手
			2. @animationfinish: 字节跳动、飞书小程序不支持(在change事件中unlockDx)
		 -->
		<swiper class="swiper" :current="activeIndex" @transition="onTransition" @animationfinish="onAnimationfinish" @change="onChange">
			<swiper-item v-for="(item, index) in tabs" :key="index" class="custom-swiper-item">
				<view class="swiper-item-view" :style="{backgroundColor: item.color}">
					<view>{{item.title}}</view>
				</view>
			</swiper-item>
		</swiper>
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
	import goodsList from '@/components/goods-list';
	export default {
		// shared:表示页面 wxss 样式将影响到自定义组件
		options: {
			styleIsolation: 'shared'
		},
		components: {
			goodsList
		},
		data() {
			return {
				tabs: this.$getTabs(),
				activeIndex: 0, // 标签页当前选择项的下标
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
			//swiper-item的位置发生改变时
			onTransition(e) {
				// 注意：
				// swiper组件的current初始化时一定要保证是第一项的下标，否则在微信小程序中dx会异常
				// 飞书的dx变化规律难以与微信小程序统一，因此暂无法实现
				this.$refs.tabs.setDx(e?.detail?.dx);
			},
			//swiper滑动动画结束时
			onAnimationfinish(e) {
				this.activeIndex = e.detail.current;
				setTimeout(() => this.$refs.tabs.unlockDx(), 0) //通知y-tabs解除对setDx()的锁定
			},
			// 当前激活的标签改变时触发
			onChange(index) {
				//  由于字节跳动、飞书不支持@animationfinish，因此在change事件中unlockDx
				// #ifdef MP-TOUTIAO || MP-LARK
				this.onAnimationfinish({ detail: { current: index } })
				// #endif
			},
			styleChange(e) {
				if (this.barAnimateMode !== e.detail.value) this.barAnimateMode = e.detail.value
			},
		},
	}
</script>
<style lang="scss" scoped>
	.page-container {

		.swiper {
			height: 300rpx;
		}

		.swiper-item-view {
			background-color: #007AFF;
			height: 300rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			color: white;
			font-size: 50rpx;
		}


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
	
	::v-deep .custom-swiper-item{
		// display: inline-flex;
		// position: relative !important;
	}
</style>