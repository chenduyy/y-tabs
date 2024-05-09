<template>
	<view class="component-container">
		<no-data v-if="isEmpty" description="抱歉,没有您想要的商品~~" padding="100rpx 0"></no-data>
		<uni-grid v-show="!isEmpty" :column="1" :showBorder="false" :square="false" :highlight="false">
			<uni-grid-item v-for="(item,index) in dataList" :key="index" class="uni-grid-item-wrap">
				<view class="item">
					<image class="left-wrap" mode="scaleToFill" :src="item.img" />
					<view class="right-wrap">
						<view class="header-wrap">
							<view class="title">{{item.title}}</view>
							<view class="desc">{{item.desc || ""}}</view>
						</view>
						<view class="price-wrap">
							<text>￥{{item.price}}</text>
							<text class="iconfont icon-tianjia" />
						</view>
					</view>
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
					[{
							title: '青喜葡萄冻冻',
							img: '1',
							desc: '精选当季阳光玫瑰脆甜鲜爽，经手捣后果香盈盈',
							price: 16
						},
						{
							title: '青喜葡萄芝士',
							img: '2',
							desc: '精选当季阳光玫瑰脆甜鲜爽，辅以采用全程低温锁鲜技术榨取的青提原汁',
							price: 20
						},
						{
							title: '红艳艳(树莓)',
							img: '3',
							desc: "茶百道树莓系列全新升级！特别选用的尚志红树莓，获得了'国家农产品地理标志'称号",
							price: 14
						},
						{
							title: '芝士红艳艳(树莓)',
							img: '4',
							desc: '精选当季阳光玫瑰脆甜鲜爽，辅以采用全程低温锁鲜技术榨取的青提原汁',
							price: 18
						},
						{
							title: '手捣芋头红茶',
							img: '5',
							desc: '甄选优质宇宙制成的微带颗粒感的芋泥铺于茶底',
							price: 13
						},
						{
							title: '手捣芋头绿茶',
							img: '6',
							desc: '花香馥郁的龙芽茉绿底制成的奶茶',
							price: 13
						},
						{
							title: '招牌芋圆奶茶',
							img: '7',
							desc: '精选优质芋头制成的软萌小芋圆，沙糯香甜',
							price: 13
						},
						{
							title: '豆乳玉麒麟',
							img: '8',
							desc: '精选武夷山名丛玉麒麟奶茶底与特磨黄豆粉迸发出加倍的豆香',
							price: 14
						},
						{
							title: '生椰西瓜',
							img: '9',
							desc: '严选当季鲜脆西瓜搭配清甜生打椰，汇入五窖茉莉花茶茶底中，口口多汁',
							price: 13
						},
						{
							title: '百香脆啵啵',
							img: '10',
							desc: '浓郁百香果搭配清新龙芽茶茉绿茶底，满口酸甜沁爽',
							price: 13
						}
					],
					[{
							title: '青喜葡萄冻冻',
							img: '1',
							desc: '精选当季阳光玫瑰脆甜鲜爽，经手捣后果香盈盈',
							price: 16
						},
						{
							title: '青喜葡萄芝士',
							img: '2',
							desc: '精选当季阳光玫瑰脆甜鲜爽，辅以采用全程低温锁鲜技术榨取的青提原汁',
							price: 20
						},
						{
							title: '紫喜葡萄冻冻',
							img: '11',
							desc: '低温锁鲜技术，口感更升级！严选当季新鲜葡萄，颗颗手捣爆汁',
							price: 14
						},
						{
							title: '紫喜葡萄芝士',
							img: '12',
							desc: '低温锁鲜技术，口感更升级！严选当季新鲜葡萄，颗颗手捣爆汁',
							price: 18
						}
					],
					[{
							title: '红艳艳(树莓)',
							img: '3',
							desc: "茶百道树莓系列全新升级！特别选用的尚志红树莓，获得了'国家农产品地理标志'称号",
							price: 14
						},
						{
							title: '芝士红艳艳(树莓)',
							img: '4',
							desc: '精选当季阳光玫瑰脆甜鲜爽，辅以采用全程低温锁鲜技术榨取的青提原汁',
							price: 18
						},
					],
					[{
							title: '手捣芋头红茶',
							img: '5',
							desc: '甄选优质宇宙制成的微带颗粒感的芋泥铺于茶底',
							price: 13
						},
						{
							title: '手捣芋头绿茶',
							img: '6',
							desc: '花香馥郁的龙芽茉绿底制成的奶茶',
							price: 13
						},
					],
					[{
							title: '招牌芋圆奶茶',
							img: '7',
							desc: '精选优质芋头制成的软萌小芋圆，沙糯香甜',
							price: 13
						},
						{
							title: '豆乳玉麒麟',
							img: '8',
							desc: '精选武夷山名丛玉麒麟奶茶底与特磨黄豆粉迸发出加倍的豆香',
							price: 14
						},
					],
					[{
							title: '生椰西瓜',
							img: '9',
							desc: '严选当季鲜脆西瓜搭配清甜生打椰，汇入五窖茉莉花茶茶底中，口口多汁',
							price: 13
						},
						{
							title: '百香脆啵啵',
							img: '10',
							desc: '浓郁百香果搭配清新龙芽茶茉绿茶底，满口酸甜沁爽',
							price: 13
						}
					],
				]

				return res.map(list => {
					list.forEach(item => {
						item.img = `${this.$imgUrl}tea/${item.img}.png`
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
	.component-container {
		position: relative;
		display: block;
		background-color: #fff;

		.item {
			display: flex;
			position: relative;
			flex-direction: row;
			flex-wrap: nowrap;
			justify-content: flex-start;
			align-items: center;
			margin-bottom: 20px;

			.left-wrap {
				width: 160rpx;
				height: 160rpx;
				will-change: transform;
				border-radius: 12rpx;
				flex-shrink: 0;
			}


			.right-wrap {
				flex: 1;
				box-sizing: border-box;
				padding-left: 20rpx;
				padding-right: 20rpx;
				overflow: hidden;
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				height: 160rpx;

				.header-wrap {
					width: 100%;

					// 标题
					.title {
						overflow: hidden;
						white-space: nowrap;
						text-overflow: ellipsis;
						font-size: 28rpx;
						font-weight: 634;
					}

					// 描述
					.desc {
						font-size: 20rpx;
						color: #aeaeae;
						overflow: hidden;
						white-space: nowrap;
						text-overflow: ellipsis;
						margin-top: 8rpx;
					}
				}

				// 价格
				.price-wrap {
					display: flex;
					align-items: center;
					justify-content: space-between;
					color: #212121;
					font-size: 28rpx;
					font-weight: 640;
				}

				// 添加图标
				.iconfont {
					font-size: 22rpx;
					height: 36rpx;
					width: 36rpx;
					background-color: #0050c8;
					color: #fff;
					border-radius: 50%;
					line-height: 36rpx;
					text-align: center;
				}

			}
		}
	}
</style>