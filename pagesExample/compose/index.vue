<template>
	<view class="container">
		<!-- <view class="gray-wrap"></view> -->
		<!-- 左侧导航区域：使用侧边栏导航+固定定位固定在左侧 -->
		<view class="left-wrap">
			<left-nav ref="leftNavRef" @change="onChange" @changeNextTitle="(value)=> nextTitle = value" />
		</view>
		<!-- 右侧内容区域：使用页面级滚动的滚动导航-->
		<view class="right-wrap">
			<y-pull-loading v-model="isLoading" :pullDistance="100" :disabled="pullDisabled" @refresh="onRefresh">
				<!-- 右侧导航 -->
				<right-scroll-nav ref="rightScrollNav" />


				<!-- 自定义上拉提示 -->
				<template #pulling>
					<view v-if="!pullDisabled" class="y-pull-loading__loosing-content">
						<uni-icons type="navigate" size="18" color="#F56C6C" />
						<text class="y-pull-loading__loosing-text">向上继续拉浏览 {{nextTitle}}</text>
					</view>
					<view v-else>
						<!-- 禁用时给个无内容的view -->
					</view>
				</template>
				<!-- 自定义释放提示 -->
				<template #loosing>
					<view class="y-pull-loading__loosing-content">
						<uni-icons type="navigate" size="18" color="#F56C6C" />
						<text class="y-pull-loading__loosing-text">释放即可浏览 {{nextTitle}}</text>
					</view>
				</template>
			</y-pull-loading>
		</view>
	</view>
</template>

<script>
	// 如何修改y-tabs的样式：
	// 1.使用 ::v-deep 在y-tabs所在的页面进行修改
	// 2.将要修改的样式放在全局样式中，但要给y-tabs赋予一个全局唯一的类名，避免全局样式污染
	// 3.如果仅在微信小程序端修改y-tabs的样式，可在使用y-tabs的自定义组件上添加options: {styleIsolation: 'shared'},使用 ::v-deep 修改样式

	import leftNav from '@/pagesExample/compose/leftNav';
	import rightScrollNav from '@/pagesExample/compose/rightScrollNav';

	export default {
		components: {
			leftNav,
			rightScrollNav,
		},
		data() {
			return {
				nextTitle: "",
				isLoading: false
			}
		},
		computed: {
			// 是否已经切换到最后一个tab了,是则禁用y-pull-loading
			pullDisabled() {
				return this.nextTitle?.length === 0
			}
		},
		// 发出scroll、reachBottom，y-pull-loading会监听这两个事件
		onPageScroll(e) {
			uni.$emit("scroll", e)
		},
		onReachBottom() {
			uni.$emit('reachBottom')
		},
		methods: {
			// 左侧导航点击事件
			onChange(index, title) {
				this.$refs.rightScrollNav.changeData(index, title)
			},
			onRefresh() {
				setTimeout(() => {
					this.isLoading = false;
					this.$refs?.leftNavRef?.changeActiveIndex();
					console.log("onRefresh");
				}, 1000);
			},
		}
	};
</script>

<style lang="scss" scoped>
	.container {
		background-color: #f1f1f1;
		box-sizing: border-box;
		display: flex;
		flex-wrap: nowrap;
		flex-direction: row;
		justify-content: flex-end;
		overflow: hidden;

		// 左侧导航区域
		.left-wrap {
			box-sizing: border-box;
			flex-shrink: 0;
			width: 110px;
			position: fixed;
			left: 0;
		}

		// 右侧滚动内容区域
		.right-wrap {
			box-sizing: border-box;
			flex-shrink: 0;
			width: calc(100vw - 110px);
			// background-color: #fff;
		}
	}

	// 上拉加载组件
	::v-deep .y-pull-loading {

		&--text,
		.y-loading__text,
		.y-pull-loading__loosing-text {
			font-size: 12px !important;
		}

		.y-pull-loading__loosing-content {
			display: flex;
			justify-content: center;
			align-items: center;
			flex-direction: row;
			height: 50px;
		}

		.y-pull-loading__loosing-text {
			margin-left: 4px;
		}

		.y-loading__spinner {
			width: 12px;
			height: 12px;
		}
	}


	// 左侧垂直导航
	::v-deep .left-wrap .y-tabs {

		// 区域滚动下的垂直标签栏模式
		&.is-areaScroll.is-vertical {
			/* #ifdef H5 */
			height: calc(100vh - 44px);
			/* #endif */
			/* #ifndef H5 */
			height: 100vh;
			/* #endif */
		}

		// 标签栏
		.y-tabs__wrap {
			width: 100% !important;
		}

		// 去掉内容页
		.y-tabs__content.is-vertical {
			width: 0 !important;
		}

		.y-tab {
			// background-color: #f1f1f1;
			height: 92rpx;

			&.is-active {
				.y-tab__title {
					overflow: unset;
				}

				.y-tab__text {
					transform: scale(1.2);
					font-weight: bold;
				}
			}

			// 图片
			&__image {
				width: 8px;
				height: 20px;
			}
		}

	}

	// 右侧滚动导航
	::v-deep .right-wrap .y-tabs {

		// 不让滚动导航的标签栏占满屏幕高度
		&__wrap {
			// padding-left: 8px;

			&.is-fixed {
				width: calc(100vw - 110px);
				right: 0;
				left: 110px !important;
			}
		}

		// 标签栏滚动容器
		&__scroll {
			width: calc(100% - 50px) !important;
		}

		// 标签
		.y-tab {
			padding: 0 4px 0 0;

			.y-tab__title {
				padding: 0 8px;
				border-radius: 26px;
				line-height: 26px;
				height: 26px;
				transition: all .2s;
				background: #fff;
				border: 2rpx solid #fff;
			}

			// 选中的标签
			&.is-active .y-tab__title {
				background: rgba(245, 108, 108, 0.1);
				border: 2rpx solid #F56C6C;
			}
		}
	}
</style>