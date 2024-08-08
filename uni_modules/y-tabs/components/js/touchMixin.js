import { getDirection, now } from "./uitls"

export const touchMixin = function() {
	return {
		data() {
			return {
				tonchOpt: {
					direction: '', //滑动方向
					startX: '', //开始滑动的x坐标
					startY: '', //开始滑动的y坐标
					nextIndex: -1, //下一个切换的标签下标
					moved: false, //是否为一次水平滑动
					deltaX: 0,
					deltaY: 0,
					startTimestamp: 0,
					nestedSwipeable: true, //对于嵌套的上级tabs，是否允许水平滑动（下级tabs滑动边界时才允许上级tabs滑动）
				},
				windowWidth: 414, //可使用窗口宽度
			};
		},
		computed: {
			// 是否允许水平滑动
			horizontalSwipe() {
				return this.swipeable && this.tonchOpt.nestedSwipeable
			}
		},
		created() {

			this.nestedTabs = this.getNestedTabs();

			// 获取可使用窗口宽度
			this.windowWidth = uni.getSystemInfoSync()?.windowWidth || 414;

		},
		methods: {
			//获取嵌套的上级tabs实例
			getNestedTabs(name = 'y-tabs') {
				let parent = this.$parent;
				let parentName = parent.$options.name;
				while (parentName !== name) {
					parent = parent.$parent;
					if (!parent) return false;
					parentName = parent.$options.name;
				}

				return parent;
			},
			touchStart(event) {
				this.releaseScrollspyLock(); //释放滚动锁
				if (!this.horizontalSwipe) return;
				this.resetTouchStatus();
				this.tonchOpt.startX = event.touches[0].clientX;
				this.tonchOpt.startY = event.touches[0].clientY;
				this.tonchOpt.startTimestamp = now();
			},
			touchMove(event) {
				if (!this.horizontalSwipe) return;
				const touch = event.touches[0];
				// fix: ‘touch.clientX < 0’ 返回0时会导致用户划出屏幕边界后横向滑动位置一直是0，使底部条动画计算错误
				// this.tonchOpt.deltaX = touch.clientX < 0 ? 0 : this.tonchOpt.startX - touch.clientX;
				// this.tonchOpt.deltaX = this.tonchOpt.startX - touch.clientX;

				// 避免左右滑动超出屏幕
				const clientX = touch.clientX < 0 ? 0 : touch.clientX > this.windowWidth ? this.windowWidth :
					touch.clientX;
				this.tonchOpt.deltaX = this.tonchOpt.startX - clientX;
				this.tonchOpt.deltaY = this.tonchOpt.startY - touch.clientY;

				const offsetX = Math.abs(this.tonchOpt.deltaX);
				const offsetY = Math.abs(this.tonchOpt.deltaY);

				// 当距离大于某个值时锁定方向
				if (!this.tonchOpt.direction || (offsetX < 10 && offsetY < 10)) {
					this.tonchOpt.direction = getDirection(offsetX, offsetY);
				}

				if (this.tonchOpt.direction === "horizontal") { //水平滑动

					const { dataLen, contentWidth, currentIndex, tabs, swipeAnimated } = this;
					const isRight = this.tonchOpt.deltaX < 0; //判断是否向右滑动

					// 如果为第一页，则不允许向右滑；为最后一页，则不允许左滑
					if ((isRight && currentIndex === 0) || (!isRight && currentIndex === dataLen - 1)) {
						this.setNestTabsSwipe(true)
						return;
					} else {
						this.setNestTabsSwipe(false)
					}

					this.tonchOpt.nextIndex = currentIndex + (isRight ? -1 : 1); //下一个标签
					if (tabs[this.tonchOpt.nextIndex]?.disabled) return; //禁用的标签不允许滑动

					this.tonchOpt.moved = true; //标记为一次水平滑动

					// 改变标签内容滑动轨道样式，模拟拖动动画效果
					if (swipeAnimated) {
						const offsetWidth = contentWidth * currentIndex * -1 + offsetX * (isRight ? 1 : -1);
						this.changeTrackStyle(true, 0, offsetWidth);
						this.setDx(this.tonchOpt.deltaX, false);
					}

					event.preventDefault(); // 左右滑动时阻止事件继续向上传递,避免触发上下滑动（H5端生效）
				}
			},
			touchEnd() {
				if (this.tonchOpt.moved) {
					// 何时可切换标签,当横向滑动距离大于设定阈值，或快速滑动(300ms内)切滑动距离大于18px时
					const deltaTime = now() - this.tonchOpt.startTimestamp;
					const distance = Math.abs(this.tonchOpt.deltaX);
					const speed = (distance / deltaTime).toFixed(4);
					const isChange = speed > 0.25 || distance >= Number(this.swipeThreshold); //是否切换
					const currIndex = this.currentIndex; //当前选中下标
					const targetIndex = isChange ? this.tonchOpt.nextIndex : currIndex; //目标标签的下标
					this.touchEndForPane(this.tonchOpt.deltaX, currIndex, targetIndex, isChange);
				}
			},
			// 重置触摸状态
			resetTouchStatus() {
				this.tonchOpt.direction = '';
				this.tonchOpt.deltaX = 0;
				this.tonchOpt.deltaY = 0;
				this.tonchOpt.nextIndex = -1;
				this.tonchOpt.moved = false;
				this.tonchOpt.startTimestamp = 0;
				this.setNestTabsSwipe(true)
			},
			// 设置嵌套的上级tabs是否可水平滑动
			setNestTabsSwipe(value) {
				if (!this.nestedTabs) return;
				this.nestedTabs.tonchOpt.nestedSwipeable = value
			}
		}
	}
}