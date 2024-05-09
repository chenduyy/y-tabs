<template>
    <view class="tabs-wrap">
        <y-tabs v-model="activeIndex" color="#ff9900">
            <y-tab class="y-tab-virtual" v-for="tab in tabs" :key="tab.key" :title="tab.title">
                <view class="content-wrap"> 内容{{ tab.key }} </view>
            </y-tab>
        </y-tabs>
    </view>
</template>

<script>
export default {
	// 微信小程序端：自定义组件需要styleIsolation: 'shared',否则无法在当前文件中修改y-tabs组件的样式
    options: {
        styleIsolation: 'shared'
    },
    data() {
        return {
            title: 'Hello',
            activeIndex: 3,
            tabs: Array.from({ length: 4 }, (_, i) => {
                return {
                    key: i + 1,
                    title: '标签' + (i + 1),
                }
            })
        }
    },
}
</script>

<style lang="scss" scoped>
.tabs-wrap {
    position: relative;
    width: 100%;
}


::v-deep .y-tabs .y-tab.is-active {
    font-weight: 600;
}

.content-wrap {
    width: 100%;
    font-size: 28rpx;
    background-color: #fff;
    height: 160rpx;
    line-height: 160rpx;
    padding-left: 32rpx;
}
</style>
