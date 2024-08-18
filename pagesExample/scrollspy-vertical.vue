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
		
			侧边栏导航（页面级滚动）-仿奶茶点单：
				1.标签栏使用的scroll-view实现的局部滚动,但是非吸顶状态，不给定高度的话，是完全撑开的，无法滚动，吸顶时，使用了fixed的top、buttom后有了高度
				2.内容区域垂直铺开展示，跟随页面滚动;
				3.在这种模式下，可以设置sticky属性，在内容区域滚动时使侧边导航进行吸顶固定
				4.在H5端，由于有顶部导航栏的存在，需要设置一下offsetTop,让吸顶的导航栏减去这部分高度
		 
		 -->

		<y-tabs ref="yTabs" v-model="activeIndex" background="#f7f7f7" color="#0050c8" bar-height="64" scrollspy
			direction="vertical" sticky :offsetTop="offsetTop" :barStyle="barStyle">
			<y-tab v-for="(tab, index) in tabs" :title="tab.title" :key="index" :position="tab.position || 'right'"
				:imageSrc="tab.imageSrc || ''" :titleStyle="titleStyle" :titleClass="tab.titleClass || ''">
				<div class="content-wrap">
					<banner v-if="index === 0" />
					<view class="title-wrap">{{ tab.title }}</view>
					<tea-list :activeKey="index" />
				</div>
			</y-tab>
		</y-tabs>
	</view>
</template>

<script>
	import selectSwitch from '@/pagesExample/components/xuan-switch/xuan-switch';
	import banner from '@/pagesExample/components/banner';
	import teaList from '@/pagesExample/components/tea-list';
	import { getRect } from '@/common/uitls';

	export default {
		components: {
			selectSwitch,
			banner,
			teaList
		},
		data() {
			return {
				activeIndex: 0, // 标签页当前选择项的下标
				// 尽量避免在属性赋值时中使用对象字面量，否则会导致y-tab中的$props监听一直触发
				titleStyle: { fontSize: '24rpx' },
				barStyle: { left: 0, borderRadius: 0 }, // 滑块样式
				tabs: [{
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
					{ title: '类目6', imageSrc: '' },
					{ title: '类目7', imageSrc: '' },
					{ title: '类目8', imageSrc: '' },
					{ title: '类目9', imageSrc: '' },
					{ title: '类目10', imageSrc: '' }
				],
				offsetTop: 0, //粘性布局下导航栏与顶部的最小距离
			};
		},
		created() {
			// H5端导航栏高度为44px，吸顶时需要减去该高度
			// #ifdef H5
			this.offsetTop = 44;
			// #endif
		},
	};
</script>

<style lang="scss" scoped>
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
				background: #fff;
				font-size: 24rpx;
				font-weight: 520;
				color: #333;
				padding: 20rpx 0;
			}
		}

	}

	.flex-row {
		display: flex;
		align-items: center;
		justify-content: flex-start;
	}


	::v-deep .y-tabs {

		.y-tabs__nav {
			background: #fff;
		}

		.y-tab {
			height: 64px !important;
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