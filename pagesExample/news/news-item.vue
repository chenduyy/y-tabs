<template>
	<view class="media-item view" @click="click">
		<view class="view" :style="{flexDirection: (newsItem.article_type === 1 || newsItem.article_type === 2)?(newsItem.article_type === 2 ?'row':'row-reverse'):'column' }">
			<text class="media-title" :class="{'media-title2': newsItem.article_type === 1 || newsItem.article_type === 2}">{{newsItem.title}}</text>
			<view v-if="newsItem.image_list || newsItem.image_url" class="image-section flex-row"
				:class="{'image-section-right': newsItem.article_type === 2, 'image-section-left': newsItem.article_type === 1}">
				<image :fade-show="false" class="image-list1" :class="{'image-list2': newsItem.article_type === 1 || newsItem.article_type === 2}" v-if="newsItem.image_url"
					:src="newsItem.image_url">
				</image>
				<template v-if="newsItem.image_list">
					<image :fade-show="false" class="image-list3" :src="source.url" v-for="(source, i) in newsItem.image_list" :key="i" />
				</template>
			</view>
		</view>
		<view class="media-foot flex-row">
			<view class="media-info flex-row">
				<text class="info-text">{{newsItem.source}}</text>
				<text class="info-text">{{newsItem.comment_count}}条评论</text>
				<text class="info-text">{{newsItem.datetime}}</text>
			</view>
			<view class="close-view" @click.stop="close">
				<view class="close-l close-h"></view>
				<view class="close-l close-v"></view>
			</view>
		</view>
		<view class="media-item-line" style="position: absolute;"></view>
	</view>
</template>

<script>
	export default {
		props: {
			newsItem: {
				type: Object,
				default: () => {}
			}
		},
		methods: {
			click() {
				this.$emit('click');
			},
			close(e) {
				e.stopPropagation();
				this.$emit('close');
			}
		}
	}
</script>

<style scoped>
	.view {
		display: flex;
		flex-direction: column;
	}

	.flex-row {
		flex-direction: row;
	}

	.flex-col {
		flex-direction: column;
	}

	.list-cell {
		padding: 0 15px;
	}

	.uni-list-cell-hover {
		background-color: #eeeeee;
	}

	.media-item {
		position: relative;
		flex: 1;
		flex-direction: column;
		padding: 10px 15px 10px 15px;
		background: #fff;
		margin: 6px;
		border-radius: 6px;
	}

	.media-item-line {
		position: absolute;
		left: 15px;
		right: 15px;
		bottom: 0;
		height: 1px;
		background-color: #ebebeb;
	}

	.media-image-right {
		flex-direction: row;
	}

	.media-image-left {
		flex-direction: row-reverse;
	}

	.media-title {
		flex: 1;
	}

	.media-title {
		/* #ifndef MP-KUAISHOU */
		lines: 3;
		/* #endif */
		text-overflow: ellipsis;
		font-size: 15px;
		color: #555555;
	}

	.media-title2 {
		flex: 1;
		margin-top: 3px;
		line-height: 20px;
	}

	.image-section {
		margin-top: 10px;
		flex-direction: row;
		justify-content: space-between;
	}

	.image-section-right {
		margin-top: 0;
		margin-left: 5px;
		width: 112px;
		height: 73px;
	}

	.image-section-left {
		margin-top: 0;
		margin-right: 5px;
		width: 112px;
		height: 73px;
	}

	.image-list1 {
		height: 240px;
	}

	.image-list2 {
		width: 112px;
		height: 73px;
	}

	.image-list3 {
		width: 112px;
		height: 73px;
	}

	.media-info {
		flex-direction: row;
		align-items: center;
	}

	.info-text {
		margin-right: 10px;
		color: #999999;
		font-size: 12px;
	}

	.media-foot {
		margin-top: 12px;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		flex-wrap: nowrap;
		display: flex;
	}

	.close-view {
		display: flex;
		position: relative;
		align-items: center;
		flex-direction: row;
		width: 20px;
		height: 15px;
		line-height: 15px;
		border-width: 1upx;
		border-style: solid;
		border-color: #aaaaaa;
		border-radius: 4px;
		justify-content: center;
		text-align: center;
	}

	.close-l {
		position: absolute;
		width: 9px;
		height: 1px;
		background-color: #aaaaaa;
	}

	.close-h {
		transform: rotate(45deg);
	}

	.close-v {
		transform: rotate(-45deg);
	}
</style>