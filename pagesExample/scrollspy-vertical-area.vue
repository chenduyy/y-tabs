<template>
	<view class="container">
		<!-- 信息区域 -->
		<view class="info-panel">
			<view class="info-panel__postion flex-row">
				<view class="postion flex-row">
					<text>茶百道长沙潇湘奥园店</text>
					<uni-icons type="right" size="10" color="#7e7e7e" />
				</view>
				<selectSwitch :switchList="['自提', '外送']" bj_color="#f8f8f8" checked_bj_color="#0050c8" />
			</view>
			<view class="distance">距离您0.86km</view>
			<view class="address">湖南省长沙市岳麓区潇湘奥林匹克花园13栋-15栋一层120号</view>
		</view>
		<!-- 
			 侧边栏导航(区域滚动)模式下
			    1.标签栏与内容区域都是使用的scroll-view实现的局部滚动
				2.默认标签页容器高度为100vh
				3.标签栏和内容区域的高度为等于标签页容器高度,直接样式设置标签页容器高度即可
		 -->
		<view :style="[tabsStyle]">
			<y-tabs ref="yTabs" v-model="activeIndex" background="#f7f7f7" color="#0050c8" bar-height="auto" scrollspy direction="vertical" :pageScroll="false">
				<y-tab v-for="(tab, index) in tabs" :title="tab.title" :key="index" :position="tab.position || 'right'" :imageSrc="tab.imageSrc || ''"
					:titleStyle="{ fontSize: '24rpx' }" :titleClass="tab.titleClass || ''">
					<div class="content-wrap">
						<banner v-if="index === 0" />
						<view class="title-wrap">{{ tab.title }}</view>
						<tea-list :activeIndex="index" />
					</div>
				</y-tab>
			</y-tabs>
		</view>
	</view>
</template>

<script>
	import selectSwitch from '@/pagesExample/components/xuan-switch/xuan-switch';
	import banner from '@/pagesExample/components/banner';
	import teaList from '@/pagesExample/components/tea-list';
	import { getRect } from '@/common/uitls'
	export default {
		components: {
			selectSwitch,
			banner,
			teaList
		},
		// shared:表示页面 wxss 样式将影响到自定义组件
		options: {
			styleIsolation: 'shared'
		},
		data() {
			return {
				infoHeight: 109,
				activeIndex: 0, // 标签页当前选择项的下标
				tabs: [
					{ title: '新品推荐', imageSrc: `${this.$imgUrl}tea/hot2.png`, titleClass: 'first-tab', position: 'left' },
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
					{ title: '类目6', imageSrc: '' },
					{ title: '类目7', imageSrc: '' },
					{ title: '类目8', imageSrc: '' },
					{ title: '类目9', imageSrc: '' },
					{ title: '类目10', imageSrc: '' }
				],
			};
		},
		computed: {
			tabsStyle() {
				// 区域滚动下的侧边栏导航: 设置标签容器高度,h5端减去导航栏+头部信息高度,其他端只减去头部信息高度
				let navHeight = 0;
				// #ifdef H5
				navHeight = 44;
				// #endif

				return {
					height: `calc(100vh - ${navHeight}px - ${this.infoHeight}px) !important`
				}
			}
		},
		mounted() {
			this.$nextTick(async () => {
				const rect = await getRect('.info-panel', this)
				this.infoHeight = rect?.height;
			})
		}
	};
</script>

<style lang="scss" scoped>
	.flex-row {
		display: flex;
		align-items: center;
		justify-content: flex-start;
	}

	.container {
		background-color: #fff;

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

	::v-deep .y-tabs {
		height: 100% !important;

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
</style>