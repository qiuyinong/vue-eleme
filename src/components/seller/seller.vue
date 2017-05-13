<template>
  <!--
  better-scroll滚动的条件是子元素的width或者height超过父元素
  -->
<div class="seller" ref="scrollSeller">
  <div class="scroll">
    <div class="overview">
      <h1 class="seller-name">{{seller.name}}</h1>
      <div class="star-wrapper">
        <star :size="36" :eval="seller.score"></star>
        <span class="ratingCount">({{seller.ratingCount}})</span>
        <span class="sellCount">月售{{seller.sellCount}}单</span>
        <i class="icon-favorite"></i>
      </div>
      <ul class="detail-wrapper">
        <li class="detail-item">
          <p class="title">起送价</p>
          <p class="price">
            <span class="price-num">{{seller.minPrice}}</span>元
          </p>
        </li>
        <li class="detail-item">
          <p class="title">商家配送</p>
          <p class="price">
            <span class="price-num">{{seller.deliveryPrice}}</span>元
          </p>
        </li>
        <li class="detail-item no-border-right">
          <p class="title">平均配送时间</p>
          <p class="price">
            <span class="price-num">{{seller.deliveryTime}}</span>分钟
          </p>
        </li>
      </ul>
    </div>
    <div class="split-wrapper">
      <split></split>
    </div>
    <div class="support-wrapper">
      <h1 class="support-title">商家公告</h1>
      <p class="support-text">
        {{seller.bulletin}}
      </p>
      <ul>
        <li class="support-item" v-for="(support, index) in seller.supports">
          <span :class="classMap[support.type]" class="icon"></span>
          <span class="text">{{support.description}}</span>
        </li>
      </ul>
    </div>
    <split></split>
    <div class="pics">
      <h1 class="title">商家实景图</h1>
      <div class="pics-wrapper" ref="scrollPic">
        <ul ref="ulWidth">
          <li v-for="pic in seller.pics" class="pic-item">
            <img :src="pic" width="120" height="90"/>
          </li>
        </ul>
      </div>
    </div>
    <split></split>
    <div class="seller-detail">
      <h1 class="title">商家信息</h1>
      <ul>
        <li class="detail-item" v-for="info in seller.infos">{{info}}</li>
      </ul>
    </div>
  </div>
</div>
</template>

<script type="text/ecmascript-6">
  import BScroll from 'better-scroll';
  import data from '../../data.json';
  import star from '../star/star.vue';
  import split from '../split/split.vue';
  
  export default {
    components: {
      star,
      split
    },
    data() {
      return {
        seller: {},
        classMap: ['decrease', 'discount', 'special', 'invoice', 'guarantee']
      };
    },
    mounted() {
      this.seller = data.seller;
      this.$nextTick(() => {
        this.scroll = new BScroll(this.$refs.scrollSeller, {
          click: true
        });
        if (this.seller.pics) {
          let picWidth = 120;
          let margin = 6;
          this.$refs.ulWidth.style.width = (picWidth + margin) * this.seller.pics.length - margin + 'px';
        };
        if (!this.picScroll) {
          this.picScroll = new BScroll(this.$refs.scrollPic, {
            scrollX: true,
            eventPassthrough: 'vertical'// 这是只允许横向滚动
          });
        } else {
          this.picScroll.refresh();
        }
      });
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import '../../common/stylus/mixin.stylus';
  
  .seller
    position: absolute
    top: 174px
    left: 0
    bottom: 0
    width: 100%
    overflow: hidden
    .overview
      position: relative
      padding: 18px 18px 0 18px
      .seller-name
        font-size: 14px
        line-height: 14px
        color: rgb(7, 17, 27)
        margin-bottom: 8px
      .star-wrapper
        padding-bottom: 18px
        border-1px(rgba(7, 17, 27, 0.1))
        .star
          display: inline-block
          vertical-align: top
        .ratingCount
          margin: 0 12px 0 8px
        .ratingCount, .sellCount
          display: inline-block
          vertical-align: top
          line-height: 18px
          font-size: 10px
          color: rgb(77, 85, 93)
        .icon-favorite
          position: absolute
          display: inline-block
          top: -23px
          right: 0
          font-size: 24px
          line-height: 24px
          color: rgb(240, 20, 20)
      .detail-wrapper
        padding: 18px 0
        .detail-item
          width: 33%
          padding: 2px 0
          text-align: center
          border-right: 1px solid rgba(7, 17, 27, 0.1)
          float: left
        .no-border-right
          border-right: none
        .title
          font-size: 10px
          color: rgb(147, 153, 159)
          line-height: 10px
          margin-bottom: 4px
        .price
          font-size: 10px
          color: rgb(7, 17, 27)
          line-height: 24px
          .price-num
            font-size: 24px
  
    .split-wrapper
      clear: both
      padding: 18px 0
    .support-wrapper
      padding: 0 18px
      .support-title
        font-size: 12px
        line-height: 12px
        color: rgb(7, 17, 27)
        margin-bottom: 12px
      .support-text
        padding: 0 12px 16px 12px
        font-size: 12px
        line-height: 24px
        color: rgb(240, 20, 20)
      .support-item
        height: 48px
        line-height: 48px
        padding: 0 12px
        border-top: 1px solid rgba(7, 17, 27, 0.1)
        .icon
          display: inline-block
          vertical-align: top
          margin-top: 16px
          height: 16px
          width: 16px
          border-radius: 2px
          background-size: 16px
          background-repeat: no-repeat
          &.decrease
            bg-image('decrease_4')
          &.discount
            bg-image('discount_4')
          &.guarantee
            bg-image('guarantee_4')
          &.invoice
            bg-image('invoice_4')
          &.special
            bg-image('special_4')
        .text
          margin-left: 6px
          font-size: 12px
          color: rgb(7, 17, 27)
    .pics
      position: relative
      padding: 18px
      .title
        margin-bottom: 12px
        font-size: 12px
        line-height: 12px
        color: rgb(7, 17, 27)
      .pics-wrapper
        width: 100%
        overflow: hidden
        white-space: nowrap
        .pic-item
          display: inline-block
          width: 120px
          height: 90px
          margin-right: 6px
          &:last-child
            margin: 0
    .seller-detail
      padding: 0 18px
      .title
        padding: 18px 0 12px 0
        font-size: 12px
        font-weight: 700
        color: rgb(7, 17, 27)
      .detail-item
        padding: 16px 12px
        border-top: 1px solid rgba(7, 17, 27, 0.1)
        font-size: 12px
        line-height: 16px
        color: rgb(7, 17, 27)
</style>
