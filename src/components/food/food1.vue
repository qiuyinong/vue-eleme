<template>
  <div class="food-detail">
    <transition name="moveLeft">
      <div class="food" v-show="showFlag" ref="foodDetail">
        <div class="food-content">
          <div class="food-title">
            <img :src="selectedFood.image"/>
            <div class="back">
              <i class="icon-arrow_lift" @click="hide()"></i>
            </div>
          </div>
          <div class="main-content">
            <div class="title">{{selectedFood.name}}</div>
            <div class="detail">
              <span class="sell-count">月售{{selectedFood.sellCount}}份</span>
              <span class="rating">好评率{{selectedFood.rating}}%</span>
            </div>
            <div class="price">
              ￥<span class="now">{{selectedFood.price}}</span><s class="old" v-show="selectedFood.oldPrice">￥{{selectedFood.oldPrice}}</s>
            </div>
            <div class="cartControl-wrapper">
              <cart-control :food="selectedFood" v-on:cartAdd="AddMore"></cart-control>
            </div>
            <transition name="add-fade">
              <div class="addCart" v-show="!selectedFood.count || selectedFood.count===0" @click.stop.prevent="addFood($event)">
                加入购物车
              </div>
            </transition>
          </div>
          <split v-show="selectedFood.info"></split>
          <div class="info" v-show="selectedFood.info">
            <h1 class="title">商品介绍</h1>
            <div class="rating">
              {{selectedFood.info}}
            </div>
          </div>
          <split></split>
          <div class="food-ratings">
            <h1 class="title">商品评价</h1>
            <rating-select :desc="desc" :ratings="selectedFood.ratings" @onlyContent="chooseContent" @selectType="selectNum">
            </rating-select>
          </div>
          <div class="rating-block">
            <ul v-show="selectedFood.ratings && selectedFood.ratings.length">
              <li v-for="(rating, index) in selectedFood.ratings" class="rating-item" v-show="chooseShow(rating.rateType,rating.text)">
                <div class="user">
                  <span class="userName">{{rating.username}}</span>
                  <img class="avatar" width="12" height="12" :src="rating.avatar">
                </div>
                <div class="rating-content">
                  <p class="time">{{formatDate(rating.rateTime)}}</p>
                  <p>
                    <span :class="{'icon-thumb_down':rating.rateType===1,'icon-thumb_up':rating.rateType===0}"></span>
                    <span class="text">{{rating.text}}</span>
                  </p>
                </div>
              </li>
            </ul>
            <div class="no-rating" v-show="!selectedFood.ratings || selectedFood.ratings.length===0">
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script type="text/ecmascript-6">
  import Vue from 'vue';
  import {formatDate} from '../../common/js/formatDate.js';
  import cartControl from '../cartControl/cartControl.vue';
  import BScroll from 'better-scroll';
  import split from '../split/split.vue';
  import ratingSelect from '../ratingSelect/ratingSelect.vue';
  
  const ALL = 2;
  
  export default {
    props: {
      selectedFood: {
        type: Object
      },
      shopCartData: {
        type: Object
      }
    },
    data() {
      return {
        showFlag: false,
        onlyContent: true,
        selectType: ALL,
        desc: {
          all: '全部',
          positive: '推荐',
          negative: '吐槽'
        }
      };
    },
    methods: {
      chooseShow(type, text) {
        if (this.onlyContent && !text) {
          return false;
          /* 这个逻辑今天没有想通，反正记住 */
        };
        if (this.selectType === ALL) {
          return true;
        } else {
          return type === this.selectType;
        }
      },
      chooseContent(content) {
        this.onlyContent = content;// 接收子元素专递过来的数据
        this.$nextTick(() => {
          /* 这里是要数据全部加载完成之后才去更新scroll，固定套路 */
          /* 这里为什么要更新scroll呢，主要是滚动的元素长度发生变化，需要实时的更新 */
          this.scroll.refresh();
        });
      },
      selectNum(type) {
        this.selectType = type;// 接收子元素专递过来的数据
        this.$nextTick(() => {
          this.scroll.refresh();
        });
      },
      AddMore(target) {
        this.shopCartData.drop(target);
      },
      addFood(event) {
        if (!event._constructed) {
          return;
        };
        Vue.set(this.selectedFood, 'count', 1);
        this.$emit('cartAdd', event.target);
      },
      show() {
        this.showFlag = true;
        // 每次浮层展示的时候初始化
        this.onlyContent = true;
        this.selectType = ALL;
        this.$nextTick(() => { // 也就是在展示状态才发生滚动事件
          if (!this.scroll) {
            this.scroll = new BScroll(this.$refs.foodDetail, {
              click: true
            });
          } else {
            this.scroll.refresh();
          }
        });
      },
      hide() {
        this.showFlag = false;
      },
      formatDate(time) {
        // 自定义过滤器
        let date = new Date(time);
        // 将转进来的数据生成时间的形式
        return formatDate(date, 'yyyy-MM-dd hh:mm');
        // 这个函数是从外部导入，date是要处理的时间毫秒数，第二参数是需要处理的成的显示形式
      }
    },
    components: {
      cartControl,
      split,
      ratingSelect
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import '../../common/stylus/mixin.stylus'
  
  .food-detail
    .food
      position: fixed
      top: 0
      left: 0
      bottom: 48px
      z-index: 20
      background: #fff
      width: 100%
      overflow: hidden
      &.moveLeft-enter
        transform: translate3d(100%, 0, 0)
      &.moveLeft-leave-active
        transform: translate3d(-100%, 0, 0)
      &.moveLeft-enter-active, &.moveLeft-leave-active
        transition: all 0.5s linear
      .food-content
        .food-title
          position: relative
          top: 0
          left: 0
          width: 100%
          height: 0
          padding-top: 100%
          img
            position: absolute
            top: 0
            left: 0
            width: 100%
            height: 100%
          .back
            position: absolute
            top: 10px
            left: 0
            .icon-arrow_lift
              display: block
              padding: 10px
              font-size: 20px
              color: #fff
        .main-content
          position: relative
          padding: 18px
          .title
            margin-bottom: 8px
            font-size: 14px
            font-weight: 700
            color: rgb(7, 17, 27)
            line-height: 14px
          .detail
            margin-bottom: 18px
            font-size: 0
            .sell-count, .rating
              font-size: 10px
              line-height: 10px
              color: rgb(147, 153, 159)
            .sell-count
              margin-right: 12px
          .price
            font-size: 10px
            line-height: 24px
            font-weight: normal
            color: rgb(240, 20, 20)
            .now
              font-weight: 700
              font-size: 14px
              margin-right: 6px
            .old
              color: rgb(147, 153, 159)
          .cartControl-wrapper
            position: absolute
            right: 12px
            bottom: 12px
          .addCart
            position: absolute
            right: 18px
            bottom: 18px
            z-index: 10
            font-size: 10px
            color: rgb(255, 255, 255)
            line-height: 12px
            box-sizing: border-box
            padding: 6px 12px
            height: 24px
            border-radius: 12px
            background: rgb(0, 160, 220)
            &.add-fade-enter, &.add-fade-leave-active
              opacity: 0
            &.add-fade-enter-active, &.add-fade-leave-active
              transition: all 0.6s
        .info
          padding: 18px
          .title
            font-size: 14px
            line-height: 14px
            color: rgb(77, 85, 93)
            margin-bottom: 6px
          .rating
            font-size: 14px
            line-height: 24px
            color: rgb(147, 153, 159)
            margin: 0 8px
        .food-ratings
          padding-top: 18px
          .title
            margin-left: 18px
            font-size: 14px
            line-height: 14px
            color: rgb(77, 85, 93)
        .rating-block
          padding: 0 18px
          .rating-item
            position: relative
            padding: 16px 0
            border-1px(rgba(7, 17, 27, 0.1))
            .user
              position: absolute
              top: 16px
              font-size: 0
              right: 0
              .userName
                display: inline-block
                vertical-align: top
                margin-top: 3px
                padding-right: 6px
                font-size: 10px
                color: rgb(147, 153, 159)
                line-height: 12px
              .avatar
                width: 12px
                height: 12px
                border-radius: 50%
            .rating-content
              font-size: 0
              .time
                margin-bottom: 6px
                font-size: 10px
                line-height: 12px
                color: rgb(147, 153, 159)
              .icon-thumb_down, .icon-thumb_up
                font-size: 12px
                color: rgb(147, 153, 159)
                line-height: 24px
              .icon-thumb_up
                color: rgb(0, 160, 220)
              .text
                padding-left: 4px
                font-size: 12px
                color: rgb(7, 17, 27)
                line-height: 16px
</style>
