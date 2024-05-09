<template>
  <view class="switch-container" :style="[{ background: bj_color}]">
    <view class="switch_view">
      <view 
        class="switch-item" 
        :class="{'checked_switch':isSwitch}"
        :style="isSwitch?`color:${checked_color}`:''"
        @click.prevent.stop="changeSwitch(true)"
        :animation="animationData2"
      >
        {{switchList[0]}}
      </view>
      <view 
        class="switch-item"
        :class="{'checked_switch':!isSwitch}"
        :style="!isSwitch?`color:${checked_color}`:''"
        @click.prevent.stop="changeSwitch(false)"
        :animation="animationData3"
      >
        {{switchList[1]}}
      </view>
    </view>
    <view class="disabled" v-if="disabled"></view>
    <view 
      class="position_view" :animation="animationData1"
      :style="[{ background: checked_bj_color}]"
    ></view>
  </view>
</template>

<script>
export default {
  props: {
    switchList: {
      type: Array,
      default: ()=>{
        return ['开','关'];
      }
    },
    defaultSwitch:{ // 默认值
      type:Boolean,
      default:true
    },
    isShowModal:{//改变开关时，是否弹框提醒
      type:Boolean,
      default:false
    },
    disabled:{
      type:Boolean,
      default:false
    },
    bj_color:{
      type:String,
      default:'#fff'
    },
    checked_bj_color:{
      type:String,
      default:'#1989fa'
    },
    checked_color:{
      type:String,
      default:'#fff'
    },
    id:{
      type:null,
      default:null
    }
  },
  watch:{
    // 监听默认值
    defaultSwitch(){
      if(this.isSwitch != this.defaultSwitch){
        this.isSwitch = this.defaultSwitch;
        this.changeAnimation();
      }
    }
  },
  data () {
    return {
      isSwitch:true,
      initAnimation:{},
      animationData1: {},
      animationData2: {},
      animationData3: {}
    };
  },
  created () {
    this.initAnimation = uni.createAnimation({
      duration: 500,
      timingFunction: 'ease'
    });
    this.isSwitch = this.defaultSwitch;
    this.changeAnimation();
  },
  methods: {
    changeSwitch(isSwitch) {
      if(isSwitch == this.isSwitch || this.disabled){
        return;
      }
      if(this.isShowModal){
        let index = isSwitch?0:1;
        let text =  this.switchList[index];
        uni.showModal({
          title: '提示',
          content: `您确定要将其调整为${text}吗？`,
          success: (res) => {
            if(res.confirm){
              this.isSwitch = isSwitch;
              this.changeAnimation();
              this.callParentEvent(isSwitch);
            }
          }
        });
      }else{
        this.isSwitch = isSwitch;
        this.changeAnimation();
        this.callParentEvent(isSwitch);
      }
    },
    // 动画效果
    changeAnimation(){
      if(this.isSwitch){
        this.animationData1 = this.initAnimation.left(0).width('50%').step().export();
        this.animationData2 = this.initAnimation.width('50%').step().export();
        this.animationData3 = this.initAnimation.width('50%').step().export();
      }else{
        this.animationData1 = this.initAnimation.left('50%').width('50%').step().export();
        this.animationData2 = this.initAnimation.width('50%').step().export();
        this.animationData3 = this.initAnimation.width('50%').step().export();
      }
    },
    // change回调
    callParentEvent(){
      this.$emit('change',this.isSwitch,this.id);
    }
  }
};
</script>

<style lang="scss" scoped>
  .switch-container {
    display: flex;
    flex-direction: row;
    width: 180upx;
    height: 60upx;
    border-radius: 100upx;
    border: 1upx solid #ccc;
    position: relative;
    .switch_view{
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 1;
      display: flex;
      border-radius: 100upx;
      .switch-item {
        color: #666;
        font-size: 24upx;
        height: 100%;
        width: 40%;
        border-radius: 100upx;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
    .position_view{
      position: absolute;
      top: 0;
      left: 0;
      width: 60%;
      height: 100%;
      border-radius: 100upx;
      background: $uni-primary;
    }
    .disabled{
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 99;
      background: #fff;
      opacity: 0.6;
      border-radius: 100upx;
    }
  }
</style>
