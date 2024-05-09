<template>
	<view class="goods-list-container">
		<no-data v-if="isEmpty" description="暂无该类别数据~~" padding="100rpx 0"></no-data>
		<uni-grid v-show="!isEmpty" :column="3" :showBorder="false" :square="false" :highlight="false">
			<uni-grid-item v-for="(item,index) in dataList" :key="index" class="uni-grid-item-wrap">
				<view class="item">
					<view class="image-wrap">
						<image class="image" mode="scaleToFill" :src="item.img" />
					</view>
					<view class="title-wrap">{{item.title}}</view>
				</view>
			</uni-grid-item>
		</uni-grid>
	</view>
</template>

<script>
	import {
		isNull
	} from "@/common/uitls.js"

	import noData from "@/components/no-data/index"
	export default {
		// shared:表示页面 wxss 样式将影响到自定义组件
		options: {
			styleIsolation: 'shared'
		},
		components: {
			noData
		},
		props: {
			// 当前选中内容区域的下标
			activeIndex: {
				type: Number,
				default: 0
			}
		},
		data() {
			return {}
		},
		computed: {
			dataList() {
				return this.dataSource[this.activeIndex]
			},
			isEmpty() {
				return !this.dataList || this.dataList.length == 0
			},
			dataSource() {
				const res = [
					['坚果炒货', '糖果/巧克力', '休闲零食', '膨化食品', '肉干肉脯', '饼干蛋糕', '蜜饯果干', '低糖食品', '中华老字号'].map((title, i) => {
						return { title, img: `${i+1}` }
					}),
					['白酒', '葡萄酒', '洋酒', '啤酒', '黄酒/养生酒', '陈年老酒'].map((title, i) => {
						return { title, img: `${i+10}` }
					}),
					['新鲜水果', '海鲜特产', '精选肉类', '蛋类', '新鲜蔬菜', '速冻食品'].map((title, i) => {
						return { title, img: `${i+16}` }
					}),
					Array.from({ length: 6 }, (_, i) => {
						return { title: `类别${i+1}`, img: `${i+1}` }
					}),
					Array.from({ length: 6 }, (_, i) => {
						return { title: `类别${i+1}`, img: `${i+1}` }
					}),
					Array.from({ length: 6 }, (_, i) => {
						return { title: `类别${i+1}`, img: `${i+1}` }
					}),
					Array.from({ length: 6 }, (_, i) => {
						return { title: `类别${i+1}`, img: `${i+1}` }
					}),
					Array.from({ length: 6 }, (_, i) => {
						return { title: `类别${i+1}`, img: `${i+1}` }
					}),
					Array.from({ length: 6 }, (_, i) => {
						return { title: `类别${i+1}`, img: `${i+1}` }
					}),
					Array.from({ length: 6 }, (_, i) => {
						return { title: `类别${i+1}`, img: `${i+1}` }
					}),
					Array.from({ length: 6 }, (_, i) => {
						return { title: `类别${i+1}`, img: `${i+1}` }
					}),
					Array.from({ length: 6 }, (_, i) => {
						return { title: `类别${i+1}`, img: `${i+1}` }
					}),
				]

				return res.map(list => {
					list.forEach(item => {
						item.img = `${this.$imgUrl}jd/${item.img}.png`
					})
					return list
				})
			},
		},
		mounted() {},
		methods: {
			isNull
		}
	}
</script>

<style lang="scss" scoped>
	.goods-list-container {
		position: relative;
		display: block;
		// background-color: #fff;

		.item {
			margin-bottom: 24rpx;
			display: flex;
			position: relative;
			flex-direction: column;
			align-items: center;
			padding: 0 24rpx;
			box-sizing: border-box;

			.image-wrap {
				display: flex;
				align-items: center;
				justify-content: center;
				// background: #fafafa;
				width: 140rpx;
				height: 140rpx;
				border-radius: 6px;
				flex-shrink: 0;

				.image {
					will-change: transform;
					width: 84rpx;
					height: 84rpx;
				}
			}

			.title-wrap {
				margin-top: 8rpx;
				font-size: 24rpx;
				color: #787878;
				overflow: hidden;
				white-space: nowrap;
				text-overflow: ellipsis;
			}
		}
	}
</style>