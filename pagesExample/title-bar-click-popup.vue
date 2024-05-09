<template>
	<view class="page-container">
		<y-tabs ref="tabs" v-model="activeIndex" sticky type="text" color="#f2f2f2" title-active-color="#333" @click="handleClick">
			<y-tab class="y-tab-virtual" v-for="item in tabs" :key="item.key" :title="item.title" :icon-type="item.$show?'top':'bottom'" icon-size="12" position="left">
				<!-- <view class="content-wrap" :style="{backgroundColor: item.color,height:'60vh',color:'#fff'}"> 内容{{item.key}} </view> -->
			</y-tab>
		</y-tabs>
		<uni-popup ref="popup" type="top" :is-mask-click="false" mask-background-color="rgba(0,0,0,0)">
			<view class="pop-content" @tap.stop="maskClick">
				<!-- 阻止点击穿透 @tap.stop.prevent -->
				<view class="pop-content__wrap" @tap.stop.prevent="() => {}">
					<view class="pop-content-item" v-for="(title,index) in categoryList" :key="index">{{title}}</view>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				tabs: this.$getTabs(10).map(o => {
					const length = Math.round(Math.random() * 2 + 3)
					const $children = Array.from({ length }, (_, i) => o.title + "----" + '类别' + (i + 1))
					return { ...o, $show: false, $children }
				}),
				activeIndex: 0,
			}
		},
		computed: {
			categoryList() {
				return this.tabs[this.activeIndex]?.$children;
			}
		},
		methods: {
			handleClick(index) {
				//选中和点击的标题项不相等时才设置上次的index为false
				if (this.activeIndex !== index) this.tabs[this.activeIndex].$show = false;
				const $show = !this.tabs[index].$show;
				console.log(this.activeIndex, index, $show, $show ? "open" : "close");
				this.tabs[index].$show = $show;
				// this.$refs.popup.open();
				this.$refs.popup[$show ? "open" : "close"]();
			},
			// 点击自定义遮罩层触发
			maskClick() {
				console.log("maskClick");
				this.$refs.popup.close();
				// 将选择的下标的$show改为false
				this.tabs[this.activeIndex].$show = false;
			}
		}
	}
</script>

<style lang="scss" scoped>
	::v-deep .y-tabs {

		// 标题栏z-index设置大于popup，避免popup出现时在y-tabs上面
		.y-tabs__wrap {
			z-index: 100;
		}

		.y-tab__icons {
			margin-left: 8rpx;
		}

		.y-tab__title {
			box-sizing: border-box;
			font-size: 24rpx;
			padding: 0 24rpx;
			transition: all 0.2s linear 0s;
			background-color: rgba(242, 242, 242, 0.8);
			border-radius: 52rpx;
			height: 52rpx;
			border: 1px solid rgba(242, 242, 242, 0.8);


			.y-tab__icons .uni-icons {
				color: inherit !important;
			}
		}

		.y-tab.is-active .y-tab__title {
			color: #F40;
			border-color: #F40;
			background-color: rgba(255, 68, 0, 0.1);
		}
	}


	::v-deep .uni-popup {
		top: calc(var(--window-top) + 40px) !important;
	}

	.pop-content {
		// margin-top: 40px;
		background-color: rgba(0, 0, 0, 0.4);
		height: calc(100vh - var(--window-top));
	}


	.pop-content__wrap {
		background-color: #fff;
		border-bottom-left-radius: 20rpx;
		border-bottom-right-radius: 20rpx;
		padding: 24rpx 0;
		transition: all 0.2s;
	}

	.pop-content-item {
		line-height: 40px;
		padding: 0 24rpx;

		&:active,
		&:hover {
			background-color: rgba(242, 242, 242, 0.8);
		}
	}
</style>