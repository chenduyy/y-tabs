<template>
	<view class="container">
		<view class="gray-wrap"></view>
		<!-- 左侧导航区域：使用侧边栏导航+固定定位固定在左侧 -->
		<view class="left-wrap">
			<left-nav @change="onChange" />
		</view>
		<!-- 右侧内容区域：使用页面级滚动的滚动导航-->
		<view class="right-wrap">
			<right-scroll-nav ref="rightScrollNav" />
		</view>
	</view>
</template>

<script>
	import leftNav from '@/pagesExample/compose/leftNav';
	import rightScrollNav from '@/pagesExample/compose/rightScrollNav';
	export default {
		components: {
			leftNav,
			rightScrollNav
		},
		methods: {
			// 左侧导航点击事件
			onChange(index, title) {
				this.$refs.rightScrollNav.changeData(index, title)
			}
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
		padding-top: 6px;

		// 左侧导航区域
		.left-wrap {
			box-sizing: border-box;
			flex-shrink: 0;
			width: 120px;
			position: fixed;
			left: 0;
		}

		// 右侧滚动内容区域
		.right-wrap {
			box-sizing: border-box;
			flex-shrink: 0;
			width: calc(100vw - 120px);
			background-color: #fff;
		}
	}

	.gray-wrap {
		height: 6px;
		background-color: #f1f1f1;
		position: fixed;
		top: var(--window-top);
		left: 0;
		width: 100%;
		z-index: 10;
	}


	// 左侧垂直导航区域
	::v-deep.left-wrap .y-tabs {

		// 区域滚动下的垂直标签栏模式
		&.is-areaScroll.is-vertical {
			/* #ifdef H5 */
			height: calc(100vh - 44px - 6px);
			/* #endif */
			/* #ifndef H5 */
			height: calc(100vh - 6px);
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
			background-color: #f1f1f1;
			height: 92rpx;

			&.is-active {
				font-size: 32rpx !important;
				font-weight: 640;

				&::before {
					content: " ";
					position: absolute;
					background-color: #fff;
					width: 100%;
					height: 100%;
					border-top-left-radius: 20rpx;
					border-bottom-left-radius: 20rpx;
				}
			}

			&__prev {
				border-bottom-right-radius: 6px;
			}

			&__next {
				border-top-right-radius: 6px;
			}

			// 图片
			&__image {
				width: 8px;
				height: 20px;
			}
		}

	}

	// 右侧滚动导航区域
	::v-deep.right-wrap .y-tabs {

		// 不让滚动导航的标签栏占满屏幕高度
		&__wrap.is-fixed {
			width: calc(100vw - 120px);
			right: 0;
			left: 120px !important;
		}
		
		// 标签栏滚动容器
		&__scroll{
			width: calc(100% - 16px) !important;
			margin-left: 8px;
		}

		// 标签
		.y-tab {
			.y-tab__title {
				padding: 0 8px;
				border-radius: 26px;
				line-height: 26px;
				height: 26px;
				transition: all .2s;
			}

			// 选中的标签
			&.is-active .y-tab__title {
				background: rgba(245, 108, 108, 0.1);
				border: 2rpx solid #F56C6C;
			}
		}
	}
</style>