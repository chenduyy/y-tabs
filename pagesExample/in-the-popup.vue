<template>
	<view class="container">
		<view class="tip-wrap">设定延时器，等待popup完全打开后，再加载tabs数据，存在tabs数据时y-tabs组件内部才会进行初始化</view>
		<button @click="open">点击打开弹出层显示标签页</button>
		<uni-popup ref="popup" type="bottom">
			<view class="pop-header">
				<text>请选择</text>
				<uni-icons type="close" @click="close" color="#999" size="28"></uni-icons>
			</view>
			<view class="pop-content">
				<y-tabs ref="yTabs" v-model="activeIndex" background="#f7f7f7" color="#0050c8" bar-height="64" scrollspy direction="vertical" :pageScroll="false"
					@loaded="onLoaded">
					<y-tab v-for="(tab, index) in tabs" :title="tab.title" :key="index" :position="tab.position || 'right'" :imageSrc="tab.imageSrc || ''"
						:titleStyle="{ fontSize: '24rpx' }" :titleClass="tab.titleClass || ''">
						<div class="content-wrap">
							<view class="title-wrap">{{ tab.title }}</view>
							<tea-list :activeIndex="index" />
						</div>
					</y-tab>
				</y-tabs>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import teaList from '@/pagesExample/components/tea-list';
	export default {
		components: {
			teaList
		},
		// shared:表示页面 wxss 样式将影响到自定义组件
		options: {
			styleIsolation: 'shared'
		},
		data() {
			return {
				show: false,
				activeIndex: 0, // 标签页当前选择项的下标
				tabs: [],
			};
		},
		methods: {
			close() {
				this.$refs.popup.close();
			},
			open() {
				this.$refs.popup.open();
				this.activeIndex = 0;
				setTimeout(() => {
					uni.showLoading({ title: '加载中...', mask: true })
					this.tabs = [{
							title: '新品推荐',
							imageSrc: `${this.$imgUrl}tea/hot2.png`,
							titleClass: 'first-tab',
							position: 'left'
						},
						{ title: '双喜葡萄', imageSrc: '' },
						{ title: '特选红树莓', imageSrc: '' },
						{ title: '现蒸芋头', imageSrc: '' },
						{ title: '超人气奶茶', imageSrc: `${this.$imgUrl}tea/hot.png` },
						{ title: '时令水果茶', imageSrc: '' },
						{ title: '暴打柠檬茶', imageSrc: '' },
						{ title: '冷萃茶', imageSrc: '' },
						{ title: '限定回顾', imageSrc: '' },
						{ title: '加料', imageSrc: '' },
						{ title: '保温袋', imageSrc: '' },
						{ title: '类目1', imageSrc: '' },
						{ title: '类目2', imageSrc: '' },
						{ title: '类目3', imageSrc: '' },
						{ title: '类目4', imageSrc: '' },
						{ title: '类目5', imageSrc: '' },
					]
				}, 500)
			},
			// 组件内部初始化完成后调用
			onLoaded() {
				setTimeout(() => uni.hideLoading(), 500); //关闭loading
			}
		},
	};
</script>

<style lang="scss" scoped>
	.container {
		padding: 32rpx;

		.tip-wrap {
			color: rgba(69, 90, 100, 0.6);
			font-size: 24rpx;
			line-height: 40rpx;
			padding-bottom: 32rpx;
		}

		.pop-header {
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 12px 16px;
			border-radius: 10px 10px 0 0;
			background-color: #fff;
			box-shadow: 0 1px 6px #ccc;
		}

		.pop-content {
			height: 60vh;
			overflow: hidden;
			background-color: #fff;
		}

		::v-deep .y-tabs {

			// 区域滚动下的侧边栏导航
			&.is-areaScroll.is-sidebarNav {
				height: 100%;
			}

			// 滑块
			&__bar.is-vertical.is-line {
				left: 0 !important;
			}

			// 滑块内容
			&__bar-inner {
				border-radius: 0 !important;
			}

			.y-tabs__nav {
				background: #fff;
			}

			.y-tab {
				height: 64px;
				background-color: #f7f7f7;

				&.first-tab {
					.y-tab__image {
						position: absolute;
						top: 14px;
						right: 10px;
					}
				}

				// 标签选中态
				&.is-active {
					background-color: #fff;
				}

				&__prev {
					border-bottom-right-radius: 6px;
				}

				&__next {
					border-top-right-radius: 6px;
				}

				// 图片
				&__image {
					width: 32rpx;
					height: 32rpx;
					border-radius: 50%;
					margin-right: 4rpx;
				}
			}
		}


		.info-panel {
			padding: 20rpx;

			.info-panel__postion {
				justify-content: space-between;
			}

			.postion {
				font-size: 36rpx;
				font-weight: 600;
				color: #333;
				flex-shrink: 0;
				width: 70%;
			}

			.uni-icons {
				margin-left: 20rpx;
			}

			.switch-container {
				width: 176rpx;
				height: 50rpx;
				border-radius: 50rpx;
				border: none;
			}

			.distance,
			.address {
				font-size: 22rpx;
				color: #aeaeae;
				flex-shrink: 0;
				width: 70%;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
				padding: 8rpx 0;
			}
		}

		.content-wrap {
			padding-left: 24rpx;

			.title-wrap {
				font-size: 24rpx;
				font-weight: 520;
				color: #333;
				padding: 20rpx 0;
			}
		}

	}
</style>