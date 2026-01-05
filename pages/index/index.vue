<script setup>
import { reactive, ref } from 'vue'
import { onShow } from '@dcloudio/uni-app'

let chatList = reactive([])
	
function onJump(index) {
	let url = '/pages/chat/chat'
	
	if(typeof index === 'number') {
		url += `?index=${index}`
	}
	uni.navigateTo({
		url
	})
}

onShow(() => {
	const res = uni.getStorageSync("chat-list")
	console.log('res',res)
	if(res) {
		chatList = res
	}
	
	console.log('chatList',chatList)
}) 
</script>

<template>
	<view class="page">
		<view class="chat-list">
			<view class="chat-item" v-for="(chat, index) in chatList" :key="index" @click="onJump(index)">
				{{chat.length}}条对话
			</view>
		</view>
		
		<view class="footer">
			<view class="send-btn" @click="onJump">
				<view class="icon send"></view>
				<view class="text">新的聊天</view>
			</view>
		</view>
	</view>
</template>

<style scoped>
	.page {
		height: 100vh;
		display: flex;
		flex-direction: column;
		background-color: #e7f8ff;
	}
	
	.chat-list {
		flex: 1;
		padding: 40rpx;
	}
	
	.chat-item {
		background-color: #fff;
		font-size: 28rpx;
		font-weight: 600;
		line-height: 3;
		padding: 20rpx 28rpx;
		border: 2rpx solid #dedede;
		margin-bottom: 20rpx;
		border-radius: 20rpx;
	}
	
	.footer {
		padding: 40rpx;
		display: flex;
		justify-content: flex-end;
	}
	
	.send-btn {
		padding: 32rpx;
		border-radius: 20rpx;
		display: flex;
		align-items: center;
		gap: 8rpx;
		background-color: #fff;
	}
	
	.send {
		width: 32rpx;
		height: 32rpx;
		background-image: url(/static/new.svg);
	}
</style>
