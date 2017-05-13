<template>
  <!--
  注意vue中的过渡用到enter、leave-active这是规定运动的形式
                  enter-active、leave-active离开的时间
                  没有用到leave
  -->
  <div class="Control">
    <div class="cartContent">
      <transition name="move">
        <div class="decrease" v-show="food.count>0" @click.stop.prevent="decreaseFood($event)">
          <i class="icon-remove_circle_outline inner"></i>
        </div>
      </transition>
      <div class="count" v-show="food.count>0">{{food.count}}</div>
      <div class="add icon-add_circle" @click.stop.prevent="addFood($event)"></div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import Vue from 'vue';
  // 引入vue模块设置vue对象的新属性count
  
  export default {
    props: {
      food: {
        type: Object
      }
    },
    methods: {
      addFood(event) {
        if (!event._constructed) {
          return;
        };
        if (!this.food.count) { // 如果this.food.count不存在为真
          Vue.set(this.food, 'count', 1);
        } else {
          this.food.count++;
        }
        // 同时派发一个事件cart.add,这是父元素获得子元素数据的方法
        this.$emit('cartAdd', event.target);
        // 向外发出carAdd事件并且发出事件源
      },
      decreaseFood(event) {
        if (!event._constructed) {
          return;
        }
        if (this.food.count !== 0) {
          this.food.count--;
        }
        return;
      }
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .cartContent
    font-size: 0
    .count
      display: inline-block
      vertical-align: top
      padding-top: 6px
      width: 12px
      font-size: 10px
      color: rgb(147, 153, 159)
      line-height: 24px
      text-align: center
    .decrease
      display: inline-block
      vertical-align: top
      .inner
        display: inline-block
        padding: 6px
        font-size: 24px
        line-height: 24px
        color: rgb(0, 160, 220)
        transition: all 0.2s linear//在这里定义运动的时间
        transform: rotate(0)//在这里旋转的最后的值
      &.move-enter, &.move-leave-active
        // 这里定义动画的初始值和结束结束后的值
        // v-enter只是一帧
        opacity: 0
        transform: translate3d(24px, 0, 0)
        .inner
          transform: rotate(180deg)//在进去和离开的时候运动形式
      &.move-enter-active
        transition: all .3s linear//直线进去的时间
      &.move-leave-active
        transition: all .3s linear//直线离开的时间，这里是复合运动
    .add
      display: inline-block
      vertical-align: top
      padding: 6px
      font-size: 24px
      line-height: 24px
      color: rgb(0, 160, 220)
</style>
