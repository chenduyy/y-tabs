<template>
	<view class="container">
		<!-- 
		    滚动导航(区域滚动) 模式下
			1.默认内容区域使用scroll-view组件实现区域滚动
			2.默认标签页容器高度为100vh
			3.内容区域高度为标签页容器高度 - 标签栏高度,直接样式设置标签页容器高度即可实现区域滚动
		 -->
		<y-tabs v-model="activeIndex" :color="' '" title-active-color="#333" title-inactive-color="#777" scrollspy :page-scroll="false" bar-height="5" :bar-style="barStyle">
			<y-tab v-for="(title, index) in tabs" :title="title" :key="index">
				<view class="title-wrap" v-if="index !== 0">{{ title }}</view>
				<card-list :activeIndex="index" />
			</y-tab>
		</y-tabs>
	</view>
</template>

<script>
	import cardList from '@/pagesExample/components/card-list';
	export default {
		components: {
			cardList
		},
		data() {
			return {
				tabs: ['最新上线', '任务中心', '新户专享礼', '月月有好礼', '推荐好友礼', '联名卡专区'],
				activeIndex: 0, // 标签页当前选择项的下标
				barStyle: {
					backgroundColor: 'transparent',
					backgroundImage: 'linear-gradient(to right, rgba(255, 0, 0, 0.8), rgba(255, 0, 0, 0.2))',
				}
			};
		},
	};
</script>
<style lang="scss" scoped>
	.container {
		background-color: #fff;
	}

	.title-wrap {
		font-size: 32rpx;
		font-weight: 620;
		padding: 16px 16px 10px;
	}

	::v-deep .y-tabs {

		// 区域滚动下的滚动导航: 设置标签容器高度,h5端减去导航栏,其他端默认为100vh
		&.is-areaScroll.is-scrollNav {
			/* #ifdef H5 */
			height: calc(100vh - 44px);
			/* #endif */
			/* #ifndef H5 */
			height: 100vh;
			/* #endif */
		}

		.y-tabs__wrap {
			border-bottom: 1px solid #eee;
		}

		.y-tab {
			padding: 0 20px !important;

			&.is-active {
				transform: scale(1.2);
				font-weight: 620;
			}
		}

		// 滑块内容
		// .y-tabs__bar-inner {
		// 	background-color: transparent;
		// 	background-image: linear-gradient(to right, rgba(255, 0, 0, 0.8), rgba(255, 0, 0, 0.2));
		// }
	}
</style>