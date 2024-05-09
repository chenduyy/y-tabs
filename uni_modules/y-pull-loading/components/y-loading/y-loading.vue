<template>
	<view class="y-loading">
		<view class="y-loading__spinner y-loading__spinner--circular" />
		<view class="y-loading__text">
			<slot />
		</view>
	</view>
</template>

<script>
	export default {
		name: 'y-loading',
		options: {
			styleIsolation: 'shared',
			virtualHost: true // [微信小程序、支付宝小程序（默认值为 true）] 将自定义节点设置成虚拟的，更加接近Vue组件的表现。我们不希望自定义组件的这个节点本身可以设置样式、响应 flex 布局等，而是希望自定义组件内部的第一层节点能够响应 flex 布局或者样式由自定义组件本身完全决定
		},
	}
</script>

<style lang="scss" scoped>
	@keyframes y-rotate {
		from {
			transform: rotate(0deg);
		}

		to {
			transform: rotate(360deg);
		}
	}

	.y-loading {
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		position: relative;

		&__spinner,
		&__text {
			display: inline-flex;
		}

		&__spinner {
			position: relative;
			display: inline-block;
			width: 14px;
			height: 14px;
			max-width: 100%;
			max-height: 100%;
			vertical-align: middle;
			animation: y-rotate .8s linear infinite;
			border-radius: 100px;
			border: 2px solid #e5e5e5;

		}

		&__spinner--circular {
			border-color: rgb(144, 147, 153) rgb(233, 233, 235) rgb(233, 233, 235);
		}


		&__text {
			color: #333;
			font-size: 14px;
			padding-left: 6px;
		}
	}
</style>