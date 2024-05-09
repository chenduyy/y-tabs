<template>
	<view class="component-container">
		<no-data v-if="isEmpty" description="暂无相关活动~~" padding="100rpx 0"></no-data>
		<uni-grid v-show="!isEmpty" :column="1" :showBorder="false" :square="false" :highlight="false">
			<uni-grid-item v-for="(item,index) in dataList" :key="index">
				<view class="item">
					<view class="image-wrap">
						<image class="image-content" mode="scaleToFill" :src="item.img" />
					</view>
					<view class="content-wrap">
						<view class="title">{{item.title}}</view>
						<view class="desc">{{item.desc}}</view>
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
		options: {
			styleIsolation: 'shared' //微信小程序，解除样式隔离
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
							title: '10月15~17日，温暖家纺49元起',
							img: '5',
							desc: '每天10点抢福利，深秋睡暖觉',
						}, {
							title: '玩航海学投资 瓜分40万份好礼',
							img: '6',
							desc: '抽至高188元现金红包',
						}, {
							title: '高颜值信用卡榜单',
							img: '7',
							desc: '新户达标好礼多选',
						}, {
							title: '升级金葵花卡有礼',
							img: '8',
							desc: '线上升级金葵花卡领猫爪灯',
						}, {
							title: '贷款福利社',
							img: '9',
							desc: '宠粉大礼包，好礼抽不停',
						}, {
							title: '赢188元红包',
							img: '1',
							desc: '金秋美食季',
						},
						{
							title: '轻松看账',
							img: '2',
							desc: '明白花钱，开启存钱第一步',
						},
						{
							title: '城市保藏 体验有礼',
							img: '3',
							desc: "专属定制 普惠全民",
						},
						{
							title: '关注好品赢礼包',
							img: '4',
							desc: '基金也能享稳又享赢',
						},
					],
					[{
							title: '送你一颗财富树',
							img: '10',
							desc: '提升资产配置，抽iPhone 13 Pro',
						},
						{
							title: '生活有招 缴费有礼',
							img: '11',
							desc: "抽88元缴费券",
						},
						{
							title: '大学生专享绑卡支付领好礼',
							img: '12',
							desc: '抽199元消费返现券',
						},
					],
					[{
							title: '招商银行App新户专享',
							img: '13',
							desc: '新人大礼包，马上领好礼',
						},
						{
							title: '智能手表、蓝牙耳机等好礼',
							img: '14',
							desc: "推荐亲友办信用卡达标立享",
						},
						{
							title: '3000份美食红包免费领',
							img: '15',
							desc: '饭票新户专享',
						},
					]
				]

				return res.map(list => {
					list.forEach(item => {
						item.img = `${this.$imgUrl}zs/${item.img}.png`
					})
					return list
				})
			},
		},
		methods: {
			isNull,
		}
	}
</script>

<style lang="scss" scoped>
	.component-container {
		position: relative;
		display: block;
		padding-top: 12rpx;
	}


	.item {
		margin: 0px 0 20px 0;
		box-sizing: border-box;
		box-shadow: 0px 0px 8px 4px rgba(0, 0, 0, 0.04);
		border-radius: 6px;
	}

	// 图片区域
	.image-wrap {
		display: block;
		width: calc(100% - 32px);
		height: 160rpx;
		margin-left: 16px;

		.image-content {
			border-radius: 6px 6px 0 0;
			width: 100%;
			height: 160rpx;
			background-color: #fff;
		}
	}

	.content-wrap {
		padding: 12px 20px;

		.title {
			font-size: 30rpx;
			font-weight: 620;
		}

		.desc {
			padding-top: 6px;
			font-size: 24rpx;
			color: #777;
		}
	}
</style>