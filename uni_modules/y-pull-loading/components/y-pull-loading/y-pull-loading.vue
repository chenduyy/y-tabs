<template>
	<view class="y-pull-loading">
		<view class="y-pull-loading__track" :style="[trackStyle]" @touchstart="onTouchStart" @touchmove="onTouchMove"
			@touchend="onTouchEnd" @touchcancel="onTouchEnd">
			<slot />
			<view class="y-pull-loading__head">
				<!-- 下拉提示 -->
				<view v-if="status==='pulling'" class="y-pull-loading--pulling">
					<slot name="pulling">
						<text class="y-pull-loading--text">{{statusText}}</text>
					</slot>
				</view>

				<!-- 释放提示 -->
				<view v-if="status==='loosing'" class="y-pull-loading--loosing">
					<slot name="loosing">
						<text class="y-pull-loading--text">{{statusText}}</text>
					</slot>
				</view>

				<!-- 加载提示 -->
				<template v-if="status==='loading'">
					<slot name="loading">
						<y-loading>{{statusText}}</y-loading>
					</slot>
				</template>

				<!-- 成功提示 -->
				<view v-if="status==='success'" class="y-pull-loading--success">
					<slot name="success">
						<text class="y-pull-loading--text">{{statusText}}</text>
					</slot>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	/**
	 * y-pull-loading  上拉加载
	 * @description 用于提供上拉加载的交互操作。
	 * 
	 * 类型 			                  参数	              说明					           默认值
	 * @property {Boolean}            v-model	          是否处于加载中状态		            -
	 * @property {String}             pulling-text	      下拉过程提示文案		           上拉即可加载...
	 * @property {String}             loosing-text	      释放过程提示文案		           释放即可加载...
	 * @property {String}             loading-text	      加载过程提示文案		           加载中...
	 * @property {String}             success-text	      加载成功提示文案		            -
	 * @property {Number | String}    success-duration	  加载成功提示展示时长(ms)           500
	 * @property {Number | String}    animation-duration  动画时长		                   300
	 * @property {Number | String}    pull-distance       触发下拉刷新的距离，只支持px		   50
	 * @property {Boolean}            disabled	          是否禁用上拉加载		           false
	 * @event {Function(index)} refresh 上拉加载时触发 
	 * 
	 * @example <y-pull-loading v-model="isLoading" @refresh="onRefresh" @reachBottom="reachBottom"></y-pull-loading>
	 * 如果是页面滚动，需在生命周期onReachBottom中发出事件：uni.$emit('reachBottom')
	 * 如果嵌入到scrollView中，则在scrolltolower中发出事件：uni.$emit('reachBottom')
	 * 
	 */
	import { TouchMixin, preventDefault } from '../js/touch';
	import { addUnit, getPx } from "../js/utils"
	export default {
		name: "y-pull-loading",
		mixins: [TouchMixin],
		emits: ['input', 'update:modelValue', 'refresh','reachBottom','scroll'],
		options: {
			styleIsolation: 'shared',
			virtualHost: true // [微信小程序、支付宝小程序（默认值为 true）] 将自定义节点设置成虚拟的，更加接近Vue组件的表现。我们不希望自定义组件的这个节点本身可以设置样式、响应 flex 布局等，而是希望自定义组件内部的第一层节点能够响应 flex 布局或者样式由自定义组件本身完全决定
		},
		props: {
			value: {
				type: Boolean,
				required: false
			},
			modelValue: {
				type: Boolean,
				required: false
			},
			successDuration: {
				type: Number,
				default: 500
			},
			animationDuration: {
				type: Number,
				default: 300
			},
			pullDistance: {
				type: Number,
				default: 50
			},
			disabled: Boolean,
			successText: String,
			pullingText: {
				type: String,
				default: "上拉即可加载..."
			},
			loosingText: {
				type: String,
				default: "释放即可加载..."
			},
			loadingText: {
				type: String,
				default: "加载中..."
			},
		},
		data() {
			return {
				isUnmounted: false, //标记组件是否卸载
				status: 'pulling',
				distance: 0,
				duration: 0,
				events: ['scroll', 'reachBottom'],
				scrollTop: 0,
				isBottom: false, //页面是否触底
			};
		},
		computed: {
			// 传入的实际值
			// #ifndef VUE3
			realValue() {
				return this.value;
			},
			// #endif
			// #ifdef VUE3
			realValue() {
				return this.modelValue;
			},
			// #endif
			// 不能触摸
			untouchable() {
				return this.status === 'loading' || this.status === 'success' || this.disabled;
			},
			statusText() {
				return this[`${this.status}Text`] || "";
			},
			trackStyle() {
				return {
					transition: `${this.duration}ms`,
					transform: this.distance ? `translate3d(0,-${this.distance}px, 0)` : ''
				}
			},
		},
		watch: {
			realValue(loading) {
				this.duration = this.animationDuration;

				// 加载完成且设置了成功文本
				if (!loading && this.successText) {
					this.status = 'success';

					// 大于0时，成功文本会显示指定时长后消失
					if (this.successDuration > 0) {
						setTimeout(() => {
							this.setStatus(0);
						}, this.successDuration);
					}
				} else {
					this.setStatus(0, loading);
				}
			}
		},
		mounted() {
			// 挂载时绑定页面滚动、页面触底事件
			this.events.forEach(name => uni.$on(name, this[name]))
		},
		// #ifndef VUE3
		destroyed() {
			if (this.isUnmounted) return;
			this.unInit();
		},
		// #endif
		// #ifdef VUE3
		unmounted() {
			this.isUnmounted = true;
			this.unInit();
		},
		// #endif
		methods: {
			// 卸载组件的处理
			unInit() {
				// 组件销毁时移除页面滚动事件监听
				this.events.forEach(name => uni.$off(name, this[name]))
			},
			// 页面滚动事件
			scroll(e) {
				// 滚动时也检测一下是否触底
				if (!this.untouchable) this.delayedFn(this.checkReachBottom, "checkReachBottomTimer")
			},
			// 页面触底事件
			reachBottom() {
				this.isBottom = true;
			},
			onTouchStart(event) {
				if (!this.untouchable && this.isBottom) {
					this.duration = 0;
					this.touchStart(event);
				}
			},
			onTouchMove(event) {
				if (this.untouchable) return;

				this.touchMove(event);

				// 如果未触底，则持续获取clientY
				if (!this.isBottom) {
					this.startY = event.touches[0].clientY;
				}

				if (this.isBottom && this.deltaY <= 0) {
					if (this.direction === 'vertical') {
						this.duration = 0;
						this.setStatus(this.ease(this.deltaY));
						preventDefault(event);
					}
				}
			},
			onTouchEnd() {
				if (!this.untouchable && this.isBottom && this.deltaY) {
					this.duration = this.animationDuration;
					if (this.status === 'loosing') {
						this.setStatus(0, true);
						this.$emit('input', true);
						this.$emit('update:modelValue', true);
						this.$emit('refresh');
					} else {
						this.setStatus(0);
					}
				}
			},
			ease(distance) {
				distance = Math.abs(distance)
				const pullDistance = Number(this.pullDistance);

				if (distance > pullDistance) {
					if (distance < pullDistance * 2) {
						distance = pullDistance + (distance - pullDistance) / 2;
					} else {
						distance = pullDistance * 1.5 + (distance - pullDistance * 2) / 4;
					}
				}

				return Math.round(distance);
			},
			setStatus(distance, isLoading) {
				let status;

				if (isLoading) {
					status = 'loading';
				} else if (distance === 0) {
					status = 'pulling';
				} else {
					status = distance < Number(this.pullDistance) ? 'pulling' : 'loosing';
				}

				this.distance = distance;

				if (status !== this.status) this.status = status;

				// 检查页面是否触底
				if (this.isBottom && distance === 0) this.checkReachBottom();

			},
			// 检查页面是否触底
			async checkReachBottom() {
				const rect = await this.getViewportRect();
				// 滚动到底后，如果scrollTop+height与scrollHeight有细微的偏差，可以考虑加1px
				this.isBottom = Math.ceil(rect.scrollTop + rect.height) >= rect.scrollHeight;
				// console.log("rect:", this.isBottom);
			},
			// 获取页面的滚动高度
			getViewportRect() {
				return new Promise((resolve, reject) => {
					// 页面级滚动，获取viewport的滚动距离
					let query = uni.createSelectorQuery().in(this);;
					// #ifdef MP-ALIPAY
					query = uni.createSelectorQuery();
					// #endif
					query.selectViewport().fields({ size: true, scrollOffset: true }, res => resolve(res || {}))
						.exec();
				});
			},
			// 延时执行函数，用于执行指定动画时长(duration)完成后需要触发的逻辑
			delayedFn(cb, name, ms = 20) {
				const self = this;

				function clear() {
					if (self[name]) {
						clearTimeout(self[name])
						self[name] = null;
					}
				}
				clear();
				this[name] = setTimeout(() => {
					cb && cb()
					clear();
				}, ms);
			},
		}
	}
</script>

<style lang="scss" scoped>
	.y-pull-loading {
		overflow: hidden;
		user-select: none;
		display: block;
		width: 100%;
		height: 100%;
		position: relative;

		&__track {
			position: relative;
			height: 100%;
			transition-property: transform;
		}

		&__head {
			// position: absolute;
			// left: 0;
			width: 100%;
			// height: 50px;
			overflow: hidden;
			color: #969799;
			font-size: 14px;
			line-height: 50px;
			text-align: center;
		}


		&--pulling,
		&--loosing,
		&--loading,
		&--success {
			display: flex;
			flex-direction: row;
			justify-content: center;
			align-items: center;
			width: 100%;
			color: #333;
		}


		&--text {
			color: #333;
			font-size: 14px;
			// font-weight: bold;
		}
	}
</style>