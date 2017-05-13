<template>
  <div class="header">
    <div class="content-wrapper">
      <div class="content-left">
        <img width='64' height='64' :src="seller.avatar"/>
      </div>
      <div class="content-mid">
        <div class="title">
          <span class="brand"></span>
          <span class="name">{{seller.name}}</span>
        </div>
        <div class="description">
          {{seller.description}}/{{seller.deliveryTime}}分钟送达
        </div>
        <div class="support" v-if="seller.supports">
          <span class="icon" :class="classMap[seller.supports[0].type]"></span>
          <span class="text">{{seller.supports[0].description}}</span>
        </div>
      </div>
      <div class="content-right">
        <span class="count" @click="show()">5个</span>
        <i class="icon-keyboard_arrow_right"></i>
      </div>
    </div>
    <div class="bulletin-wrapper" @click="show()">
      <span class="bulletin-title"></span><span class="bulletin-text">{{seller.bulletin}}</span>
      <i class="icon-keyboard_arrow_right"></i>
    </div>
    <div class="background">
      <img :src="seller.avatar" width="100%" height="100%"/>
    </div>
    <transition name="fade">
      <div class="detail" v-show="detailShow">
        <!--
        在这里使用sticky footers进行布局
        套路
        有两个div 一个包裹内容，另一个是页面底部的内容close
        在第一个div中需要有clearfix
        -->
        <div class="detail-wrapper clearfix">
          <div class="detail-main">
            <h1 class="name">{{seller.name}}</h1>
            <div class="star-detail">
              <star :eval="seller.score" :size="48"></star>
            </div>
            <div class="title">
              <div class="line"></div>
              <h2 class="text">优惠信息</h2>
              <div class="line"></div>
            </div>
            <ul class="supports" v-if="seller.supports">
              <li v-for="(item, index) in seller.supports" class="support-item">
                <span :class="classMap[seller.supports[index].type]" class="icon"></span>
                <span class="text">{{seller.supports[index].description}}</span>
              </li>
            </ul>
            <div class="inform">
              <div class="line"></div>
              <div class="text">商家公告</div>
              <div class="line"></div>
            </div>
            <div class="bulletin">
              {{seller.bulletin}}
            </div>
          </div>
        </div>
        <div class="detail-close" @click="close">
          <i class="icon-close"></i>
        </div>
      </div>
    </transition>
  </div>
</template>

<script type="text/ecmascript-6">
  import star from '../star/star.vue';
  import data from '../../data.json';
  
  export default {
    data() {
      return {
        seller: {},
        classMap: ['decrease', 'discount', 'special', 'invoice', 'guarantee'],
        detailShow: false
      };
    },
    mounted() {
      this.seller = data.seller;
    },
    methods: {
      show() {
        this.detailShow = true;
      },
      close() {
        this.detailShow = false;
      }
    },
    components: {
      star
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin.stylus"
  
  .header
    position: relative
    overflow: hidden
    color: #fff
    width: 100%
    background:rgba(0, 0, 0, 0.5)
    .content-wrapper
      postion: relative
      padding: 24px 12px 18px 24px
      font-size: 0
      .content-left
        display: inline-block
        margin-right: 16px
        vertical-align: top
        & > img
          border-radius: 2px
      .content-mid
        display: inline-block
        .title
          margin: 2px 0 8px 0
          .brand
            display: inline-block
            vertical-align: top
            width: 30px
            height: 18px
            bg-image('./brand')
            background-size: 30px 18px
            backgroung-repeat: no-repeat
          .name
            margin-left: 6px
            font-size: 16px
            line-height: 18px
            font-weight: bold
          
        .description
          font-size: 12px
          line-height: 12px
          margin-bottom: 10px
          
        .support
          .icon
            display: inline-block
            vertical-align: top
            width: 12px
            height: 12px
            margin-right: 4px
            margin-bottom: 2px
            background-size: 12px 12px
            background-repeat: no-repeat
            &.decrease
              bg-image('decrease_1')
            &.discount
              bg-image('discount_1')
            &.guarantee
              bg-image('guarantee_1')
            &.invoice
              bg-image('invoice_1')
            &.special
              bg-image('special_1')
          .text
            font-size: 10px
            line-height: 12px
      .content-right
        position: absolute
        right: 12px
        bottom: 37px
        border-radius: 14px
        padding: 0 8px
        font-size: 10px
        line-height: 24px
        height: 24px
        text-align: center
        background-color: rgba(0, 0, 0, 0.2)
        .count
          vertical-align: top
    .bulletin-wrapper
      position: relative
      height: 28px
      line-height: 28px
      padding: 0 22px 0 12px
      background-color: rgba(7, 17, 27, 0.2)
      white-space: nowrap
      overflow: hidden
      text-overflow: ellipsis
      .bulletin-title
        display: inline-block
        vertical-align: top
        width: 22px
        height: 12px
        margin-top: 8px
        bg-image('bulletin')
        background-size: 22px 12px
        background-repeat: no-repeat
      .bulletin-text
        margin: 0 4px 0 4px
        vertical-align: top
        fon-size: 10px
      .icon-keyboard_arrow_right
        position: absolute
        top: 8px
        right: 12px
        font-size: 10px
    .background
      position: absolute
      width: 100%
      height: 100%
      z-index: -1
      top: 0px
      bottom: 0px
      filter: blur(5px)
    
    .detail
      position: fixed
      width: 100%
      height: 100%
      top: 0
      bottom: 0
      z-index: 100
      overflow: auto
      background: rgba(7, 17, 27, 0.8)
      .detail-wrapper
        min-height: 100%
        width: 100%
        .detail-main
          margin-top: 64px
          padding-bottom: 64px
          .name
            line-height: 16px
            text-align: center
            font-size: 16px
            font-weight: 700
          .star-detail
            margin-top: 16px
            padding: 2px 0
            text-align: center
          .title
            display: flex
            width: 80%
            margin: 28px auto 24px auto
            .line
              flex: 1
              position: relative
              top: -7px
              border-bottom: 1px solid rgba(255, 255, 255, 0.2)
            .text
              padding: 0 12px
              font-weight: 700
              font-size: 14px
          .supports
            width: 80%
            margin: 0 auto
            .support-item
              padding: 0 12px
              margin-bottom: 12px
              font-size: 0
              &:last-child
                margin-bottom: 0
              .icon
                display: inline-block
                width: 16px
                height: 16px
                margin-right: 6px
                vertical-align: top
                background-size: 16px 16px
                background-repeat: no-repeat
                &.decrease
                  bg-image('decrease_2')
                &.discount
                  bg-image('discount_2')
                &.guarantee
                  bg-image('guarantee_2')
                &.invoice
                  bg-image('invoice_2')
                &.special
                  bg-image('special_2')
              .text
                  font-size: 12px
                  line-height: 16px
                
          .inform
            display: flex
            width: 80%
            margin: 28px auto 24px auto
            .line
              position: relative
              top: -7px
              flex: 1
              border-bottom: 1px solid rgba(255, 255, 255, 0.2)
            .text
              padding: 0 12px
              font-size: 16px
              font-weight: 700
          .bulletin
            padding: 0 12px
            font-size: 12px
            line-height: 24px
      .detail-close
        position: relative
        width: 32px
        height: 32px
        margin: -50px auto auto
      &.fade-enter-active, &.fade-leave-active
        transition: opacity .5s
      &.fade-enter, &.fade-leave-active
        opacity: 0
</style>
