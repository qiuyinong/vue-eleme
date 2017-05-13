<template>
  <!--
  关于动画
  1.v-enter,v-leave-active 规定运动的初始值和结束值
  同时也是规定运动过程中那些状态发生变化，translate，background等等
  在规定v-show的元素中规定opacity:0然后在规定运动的时间就可以实现过度的效果
  2.v-enter-active， v-leave-active是规定过渡的时间和形式ease linear等等
  关于钩子
  beforeEnter(el)： 也就是运动前的初始值，
  enter(el, done): 这是规定运动过程，注意done不能少，要不然介个钩子就一起运动
  el.addEventListener('transitionend', done);这个是不能少的
  -->
  <div class="shopCart">
    <div class="content" @click="toggle()">
      <div class="content-left">
        <div class="logoWrapper">
          <div class="logo" :class="{'highLight':totalCount>0}">
              <i class="icon-shopping_cart"></i>
              <div class="count" v-show="totalCount>0">{{totalCount}}</div>
          </div>
        </div>
      <div class="price" :class="{highLight: totalPrice>0}">
      ￥{{totalPrice}}
      </div>
      <div class="desc">
      需配送配￥{{deliveryPrice}}元
      </div>
      </div>
      <div class="content-right">
        <div class="pay" :class="{highLight:payDesc}">
         {{pay}}
        </div>
      </div>
    </div >
    <div class="ball-container">
      <div v-for="ball in balls">
        <transition name="drop"  v-on:before-enter="beforeEnter" v-on:enter="enter" v-on:after-enter="afterEnter">
          <div v-show="ball.show" class="ball">
            <div class="inner inner-hook"></div>
          </div>
        </transition>
      </div>
    </div>
    <transition name="up">
      <div class="shopCart-list" v-show="listShow">
        <div class="list-header">
          <h1 class="title">购物车</h1>
          <span class="empty" @click="empty()">清空</span>
        </div>
        <div class="list-content" ref="scrollCart">
          <ul>
            <li v-for="food in selectFoods" class="list-item">
              <span class="item-name">{{food.name}}</span>
              <div class="item-price">
                ￥<span class="price">{{food.price*food.count}}</span>
              </div>
              <div class="cartControl-wrapper">
                <cart-control :food="food"></cart-control>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </transition>
  </div>
</template>

<script type="text/ecmascript-6">
  import cartControl from '../cartControl/cartControl.vue';
  import BScroll from 'better-scroll';
  
  export default {
    data() {
      return {
        balls: [ // 在这里定义五个小球，并且状态为FALSE
          {
            show: false
          },
          {
            show: false
          },
          {
            show: false
          },
          {
            show: false
          },
          {
            show: false
          }
        ],
        dropBall: [], // 这是判断已经是掉落的小球
        fold: true// 定义是否是折叠的，初始为真
      };
    },
    props: {
      minPrice: {
        type: Number
      },
      deliveryPrice: {
        type: Number
      },
      selectFoods: {
        type: Array
      }
    },
    computed: {
      totalCount() {
        let count = 0;
        this.selectFoods.forEach((food) => {
          count += food.count;
        });
        return count;
      },
      totalPrice() {
        let price = 0;
        this.selectFoods.forEach((food) => {
          price += food.count * food.price;
        });
        return price;
      },
      pay() {
        if (this.totalPrice === 0) {
          return `￥${this.minPrice} 起送`;
        } else if (this.totalPrice - this.minPrice < 0) {
          let diff = this.minPrice - this.totalPrice;
          return `还差￥${diff} 起送`;
        } else {
          return `去结算`;
        }
      },
      payDesc() {
        if (this.totalPrice - this.minPrice >= 0) {
          return true;
        };
      },
      listShow() {
        if (!this.totalCount) {
          this.fold = true;
          // 没有数量的时候永远是折叠的
          return false;
        };
        let show = !this.fold;
        if (show) {
          this.$nextTick(() => {
            if (!this.scroll) {
              this.scroll = new BScroll(this.$refs.scrollCart, {
                click: true
              });
            } else {
              this.scroll.refresh();
            }
          });
        }
        return show;
        // 有数量的时候show的变化和fold值相反
      }
    },
    methods: {
      empty() {
        this.selectFoods.forEach((food) => {
          food.count = 0;
        });
      },
      toggle() {
        if (!this.totalCount) {
          return;
        };
        this.fold = !this.fold;
        // fold的变化和点击有关
      },
      drop(el) { // 这是来自cartControl的元素
        for (let i = 0; i < this.balls.length; i++) {
          let ball = this.balls[i];
          if (!ball.show) {
            ball.show = true;
            ball.el = el;
            // 这是存放找到点击按钮
            this.dropBall.push(ball);
            // 这是已经跳落的小球
            return;
          };
        };
      },
      beforeEnter(el) {
        // 这是动画开始前需要做什么事
        for (let i = 0; i < this.balls.length; i++) {
          // 遍历balls找出show为TRUE的小球
          let ball = this.balls[i];
          if (ball.show) {
            let rect = ball.el.getBoundingClientRect();
            // 当前元素相对于视口的偏僻,返回left和top是相对于视口的偏移
            let x = rect.left - 32;
            // left是正的减去偏移32就是x落下的位置
            let y = -(window.innerHeight - rect.top - 22);
            // window.innerHeight是窗口的高度
            el.style.display = '';
            el.style.webkitTransform = `translate3d(0, ${y}px, 0)`;
            // 注意在vue中的函数要使用变量形式为${}
            el.style.transform = `translate3d(0, ${y}px, 0)`;
            let inner = el.getElementsByClassName('inner-hook')[0];
            inner.style.webkitTransform = `translate3d(${x}px, 0, 0)`;
            inner.style.transform = `translate3d(${x}px, 0, 0)`;
          };
        }
      },
      enter(el, done) {
        // 这是动画开始过程中
        /* eslint-disable no-unused-vars */
        let rf = el.offsetHeight;
        // 清除第一次点击没有消失的小球
        this.$nextTick(() => {
          el.style.webkitTransform = 'translate3d(0,0,0)';
          el.style.transform = 'translate3d(0,0,0)';
          let inner = el.getElementsByClassName('inner-hook')[0];
          inner.style.webkitTransform = 'translate3d(0,0,0)';
          inner.style.transform = 'translate3d(0,0,0)';
          el.addEventListener('transitionend', done);
        });
      },
      afterEnter(el) {
        let ball = this.dropBall.shift();
        if (ball) {
          ball.show = 0;
          el.style.display = 'none';
        };
      }
    },
    components: {
      cartControl
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin.stylus"
  
  .shopCart
    position: fixed
    left: 0
    bottom: 0
    z-index: 50
    height: 48px
    width: 100%
    background: #141d27
    .content
      display: flex
      .content-left
        flex: 1
        .logoWrapper
          display: inline-block
          vertical-align: top
          font-size: 0px
          position: relative
          z-index: 15
          top: -10px
          padding: 6px
          margin: 0 12px
          box-sizing: border-box
          width: 56px
          height: 56px
          border-radius: 50%
          background: #141d27
          @media only screen and (max-width: 320px)
            margin: 0 8px
          .logo
            margin-bottom: 2px
            border-sizing: border-box
            width: 44px
            height: 44px
            border-radius: 50%
            background: rgba(255, 255, 255, 0.2)
            text-align: center
            &.highLight
              background: rgb(0, 160, 220)
            .icon-shopping_cart
              font-size: 24px
              color: rgb(255, 255, 255, 0.4)
              line-height: 44px
              &.highLight
                color: rgb(255, 255, 255)
            .count
              position: absolute
              top: 0
              right: 0
              height: 16px
              width: 24px
              border-radius: 12px
              font-size: 9px
              font-weight: 700
              color: rgb(255, 255, 255)
              line-height: 16px
              text-align: center
              background: rgb(240, 20, 20)
              box-show: 0 4px 8px 0 rgba(0, 0, 0, 0.4)
        .price
          display: inline-block
          vertical-align: top
          margin: 12px 0
          padding-right: 12px
          height: 24px
          border-sizing: border-box
          line-height: 24px
          border-right: 1px solid rgba(255, 255, 255, 0.1)
          font-size: 16px
          font-weight: 700
          color: rgba(255, 255, 255, 0.4)
          &.highLight
            color: rgb(255, 255, 255)
        .desc
          display: inline-block
          vertical-align: top
          padding-left: 8px
          @media only screen and (max-width: 320px)
            padding-left: 4px
          font-size: 14px
          color: rgba(255, 255, 255, 0.4)
          line-height: 48px
      .content-right
        flex: 0 0 105px
        width: 105px
        @media only screen and (max-width: 320px)
          flex:0 0 90px
          width: 90px
        .pay
          height  100%
          font-size: 12px
          font-weight: 700
          line-height: 48px
          text-align: center
          background: rgba(255, 255, 255, 0.2)
          color: rgba(255, 255, 255, 0.4)
          &.highLight
            background: #00b43c
            color: #fff
    .ball-container
      .ball
        position: fixed
        left: 32px
        bottom: 22px
        z-index: 200
        &.drop-enter-active
          transition: all 0.4s cubic-bezier(0.49, -0.29, 0.75, 0.41)
          .inner
            width: 16px
            height: 16px
            border-radius: 50%
            background: rgb(0, 160, 220)
            transition: all 0.4s linear
    .shopCart-list
      position: absolute
      bottom: 48px
      left: 0
      z-index: 10
      width: 100%
      background: #fff
      &.up-enter, &.up-leave-active
        transform: translate3d(0, 100%, 0)
      &.up-enter-active, &.up-leave-active
        transition: all 0.5s
      .list-header
        height: 40px
        line-height: 40px
        border-bottom: 2px solid rgba(7, 17, 27, 0.1)
        padding: 0 18px
        background: #f3f5f7
        font-size: 0
        .title
          float: left
          font-size: 14px
          color: rgb(7, 17, 27)
        .empty
          float: right
          font-size: 12px
          color: rgb(0, 160, 220)
      .list-content
        padding: 0 18px
        max-height: 217px
        overflow: hidden
        .list-item
          position: relative
          padding: 12px 0
          box-sizing: border-box
          line-height: 24px
          border-1px(rgba(7, 17, 27, 0.1))
          .item-name
            font-size: 14px
            color: rgb(7, 17, 17)
          .item-price
            position: absolute
            right: 90px
            bottom: 12px
            color: rgb(240, 20, 20)
            font-size: 10px
            font-weight: normal
            .price
              font-size: 14px
              font-weight: 700
          .cartControl-wrapper
            position: absolute
            right: 0
            bottom: 3px
</style>
