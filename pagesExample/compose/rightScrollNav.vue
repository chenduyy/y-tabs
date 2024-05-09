<template>
	<!-- 在 微信小程序/App 平台可使用 page-meta 组件动态修改页面样式 来禁止滚动穿透 -->
	<!-- <page-meta :page-style="'overflow:'+(show?'hidden':'visible')"></page-meta> -->
	<view class="comp-wrap">
		<banner-jd />
		<y-tabs ref="tabsRef" v-model="activeIndex" type="text" color="#F56C6C" background="#f1f1f1" sticky scrollspy
			:scrollThreshold="2" :offsetTop="offsetTop">
			<y-tab v-for="(title, index) in tabs" :title="title" :key="index">
				<view class="content-wrap">
					<view class="title-wrap" :id="`title${index}`">{{title}}</view>
					<category-list :activeIndex="index" />
				</view>
			</y-tab>

			<!-- 标签栏右侧内容 -->
			<template #nav-right>
				<view class="nav-right-wrap" @click.stop="showPopup">
					<uni-icons class="nav-right-wrap__icon" type="bottom" :color="'#5e6d82'" size="14" />
				</view>
			</template>
		</y-tabs>

		<!-- 标签选择弹出层 -->
		<uni-popup ref="popup" background-color="#fff" @change="change" type="top">
			<scroll-view scroll-y="true" class="popup__scrollview">
				<view class="popup-content">
					<view class="popup__title">
						<view class="popup__title-text">{{popupTitle}}</view>
					</view>
					<uni-row class="popup__row-tags" :gutter="36">
						<uni-col :span="6" v-for="(title,index) in tabs" :key="index">
							<view @click="handleClickByPopup(index)">
								<view class="popup-tag" :class="[ index===activeIndex && 'is-active']">
									<text>{{title}}</text>
								</view>
							</view>
						</uni-col>
					</uni-row>
				</view>
			</scroll-view>

		</uni-popup>
	</view>
</template>

<script>
	import bannerJd from '@/pagesExample/components/banner-jd';
	import categoryList from '@/pagesExample/components/category-list';

	export default {
		name: "rightScrollNav",
		// 微信小程序端：自定义组件需要styleIsolation: 'shared',否则无法在当前文件中修改y-tabs组件的样式
		options: {
			styleIsolation: 'shared'
		},
		components: {
			bannerJd,
			categoryList
		},
		data() {
			return {
				activeIndex: 0,
				tabs: ['休闲零食', '中外名酒', '京东生鲜', '粮油调味', '水饮茗茶', '进口食品', '营养保健', '母婴玩具', '家居用品', '个护清洁'],
				show: false,
			}
		},
		computed: {
			// 粘性布局下标签栏与屏幕顶部的最小距离
			offsetTop() {
				// H5端需要减去顶部导航栏高度
				let height = 0;
				// H5端导航栏高度
				// #ifdef H5
				height = 44;
				// #endif

				return height
			},
			popupTitle() {
				return this.tabs[this.activeIndex] || ""
			},
		},
		methods: {
			// 改变tabs数据
			changeData(index, title) {
				uni.pageScrollTo({ scrollTop: 0, duration: 0 }); //页面回滚至顶部
				setTimeout(() => {
					const length = Math.floor(Math.random() * 10) + 5;
					this.tabs = index === 0 ? this.$options.data().tabs : Array.from({ length }, (_, i) => title +
						`${i+1}`)
					this.activeIndex = 0
					this.$refs.tabsRef && this.$refs.tabsRef.reset()
				}, 200)

			},
			change(e) {
				this.show = e.show;
			},
			// 显示弹出层
			showPopup() {
				this.$refs.popup.open()
			},
			// 关闭弹出层
			closePopup() {
				this.$refs.popup.close()
			},
			handleClickByPopup(index) {
				// 切换标签页组件的 v-model 并关闭弹出层
				this.$refs.tabsRef.scrollTo(index); //滚动到指定的标签页
				this.closePopup();
			},
		}
	}
</script>
<style lang="scss" scoped>
	.content-wrap {
		margin: 0 10px 10px 0;
		background-color: #fff;
		border-radius: 10px;

		.title-wrap {
			font-size: 28rpx;
			font-weight: 640;
			color: #333;
			padding: 20rpx 0 16rpx 20rpx;
		}

	}

	.nav-right-wrap {
		font-size: 12px;
		width: 50px;
		display: flex;
		align-items: center;
		justify-content: center;

		&__icon {
			display: flex;
			align-items: center;
			justify-content: center;
			white-space: nowrap;
			height: 30px;
			width: 30px;
			border-radius: 100px;
			background: #fff;
		}
	}

	::v-deep .popup__scrollview {
		height: 40vh;

		.popup-content {
			padding: 0 24rpx;
		}

		// 标题
		.popup__title {
			display: flex;
			flex-direction: row;
			padding: 24rpx 0;
			align-items: center;
			line-height: 1;

			&-text {
				font-size: 30rpx;
				font-weight: 560;
			}

			&-subtext {
				font-size: 24rpx;
				color: #777;
				padding-left: 20rpx;
			}

			&-tools {
				flex: 1;
				text-align: right;
			}

			&-button {
				display: inline-block;
				background-color: #eee;
				padding: 10rpx 28rpx;
				font-size: 24rpx;
				border-radius: 60rpx;
				color: #1989fa;
			}

			.close-popup-icon {
				margin-left: 32rpx;
			}
		}

		.uni-col {
			position: relative;
		}

		// 清除图标
		.uni-icons.uniui-clear {
			position: absolute;
			top: -10px;
			right: 4px;
		}

		// 添加图标
		.uni-icons.uniui-plusempty {
			margin-right: 2px;
		}

		// 标签
		.popup-tag {
			display: flex;
			flex-direction: row;
			align-items: center;
			justify-content: center;
			text-align: center;
			padding: 18rpx 0;
			margin-bottom: 32rpx;
			color: #666;
			font-size: 24rpx;
			font-weight: 560;
			line-height: 1;
			border: 1rpx solid #e6e6e6;
			border-radius: 8rpx;

			&.is-disabled {
				background-color: #e6e6e6;
			}

			&.is-active {
				color: #EE0A24;
				border-color: #EE0A24;
				background-color: #fff;
			}
		}
	}
</style>