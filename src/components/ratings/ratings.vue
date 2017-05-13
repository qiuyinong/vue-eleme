<template>
  <!--
  better-scroll使用规则，滚动的不是ref绑定的元素，而是ref下面的第一个子元素
  同时这个子元素还需要有一个class，这个子元素需要包含需要滚动的内容
  -->
<div class="ratings" ref="ratingScroll">
  <div class="scroll">
    <div class="overview">
      <div class="overview-left">
        <p class="score">{{seller.score}}</p>
        <h1 class="title">综合评分</h1>
        <p class="rank">高于周边商家{{seller.rankRate}}%</p>
      </div>
      <div class="overview-right">
        <div class="server-wrapper">
          <span class="title">服务态度</span>
          <star :eval="seller.serviceScore" :size="36"></star>
          <span class="score">{{seller.serviceScore}}</span>
        </div>
        <div class="server-wrapper">
          <span class="title">服务态度</span>
          <star :eval="seller.foodScore" :size="36"></star>
          <span class="score">{{seller.foodScore}}</span>
        </div>
        <div class="delivery-wrapper">
          <span class="title">送达时间</span>
          <span class="delivery">{{seller.deliveryTime}}分钟</span>
        </div>
      </div>
    </div>
    <div class="ratings-content">
      <div class="split-wrapper">
        <split></split>
      </div>
      <div class="ratingSelect-wrapper">
        <rating-select :ratings="ratings" @onlyContent="chooseContent" @selectType="chooseType"></rating-select>
      </div>
    </div>
    <div class="rating-wrapper">
      <ul>
        <li class="rating-item" v-for="rating in ratings" v-show="chooseShow(rating.rateType, rating.text)">
          <div class="avatar">
            <img :src="rating.avatar" width="28" height="28">
          </div>
          <div class="content">
            <h1 class="userName">{{rating.username}}</h1>
            <div class="star-wrapper">
              <star :eval="rating.score" :size="24"></star>
              <span class="delivery" v-show="rating.deliveryTime">{{rating.deliveryTime}}分钟送达</span>
            </div>
            <p class="recommend" v-show="rating.recommend && rating.recommend.length">
              <i chass="icon-thumb_up"></i>
              <span class="recommend" v-for="item in rating.recommend">{{item}}</span>
            </p>
          </div>
          <div class="rating-info">{{rating.text}}</div>
          <div class="rating-time">
            <span class="time">{{formatDate(rating.rateTime)}}</span>
          </div>
        </li>
      </ul>
    </div>
  </div>
</div>
</template>

<script type="text/ecmascript-6">
  import {formatDate} from '../../common/js/formatDate.js';
  import data from '../../data.json';
  import BScroll from 'better-scroll';
  import star from '../star/star.vue';
  import split from '../split/split.vue';
  import ratingSelect from '../ratingSelect/ratingSelect.vue';
  
  export default {
    data() {
      return {
        seller: {},
        ratings: [],
        onlyContent: true,
        selectType: 2 // 这是全选中的状态数
      };
    },
    components: {
      star,
      split,
      ratingSelect
    },
    mounted() {
          this.seller = data.seller;
          this.ratings = data.ratings;
          this.$nextTick(() => {
            this.scroll = new BScroll(this.$refs.ratingScroll, {
              click: true
             });
          });
    },
    methods: {
      chooseShow(type, text) {
        if (this.onlyContent && !text) {
          return false;
        };
        if (this.selectType === 2) {
          return true;
        } else {
          return this.selectType === type;
        }
      },
      chooseContent(content) {
        this.onlyContent = content;
        console.log(this.onlyContent);
      },
      chooseType(type) {
        this.selectType = type;
      },
      formatDate(str) {
        let date = new Date(str);
        return formatDate(date, 'yyyy-MM-dd hh:mm');
      }
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import '../../common/stylus/mixin.stylus';
  
  .ratings
    position: absolute
    top: 174px
    left: 0
    bottom: 0
    width: 100%
    overflow: hidden
    .overview
      display: flex
      padding: 18px 0
      .overview-left
        flex: 0 0 138px
        width: 138px
        @media only screen and (max-width: 320px)
          flex: 0 0 116px
          width: 110px
        padding: 6px 0
        text-align: center
        border-right: 1px solid rgba(7, 17, 27, 0.1)
        .score
          margin-bottom: 6px
          font-size: 24px
          color: rgb(255, 153, 0)
          line-height: 28px
        .title
          font-size: 12px
          line-height: 12px
          color: rgb(7, 17, 27)
          margin-bottom: 8px
        .rank
          font-size: 10px
          line-height: 10px
          color: rgb(147, 153, 159)
      .overview-right
        flex: 1
        padding:6px 0 6px 24px
        @media only screen and (max-width: 320px)
          padding:6px 0 6px 10px
        .server-wrapper
          margin-bottom: 8px
          .title
            display: inline-block
            vertical-align: top
            font-size: 12px
            line-height: 18px
            color: rgb(7, 17, 27)
          .star
            display: inline-block
            vertical-align: top
            margin: 0 12px
            @media only screen and (max-width: 320px)
              margin: 0 6px
          .score
            display: inline-block
            vertical-align: top
            font-size: 12px
            color: rgb(255, 153, 0)
            line-height: 18px
        .delivery-wrapper
          font-size: 0
          .title
            font-size: 12px
            line-height: 18px
            color: rgb(7, 17, 27)
            margin-right: 12px
          .delivery
            font-size: 12px
            line-height: 18px
            color: rgb(147, 153, 159)
          
          
    
    .rating-wrapper
      padding: 0 18px 0 18px
      .rating-item
        position: relative
        padding: 18px 0
        border-1px(rgba(7, 17, 27, 0.1))
        .avatar
          display: inline-block
          vertical-align: top
          margin-right: 12px
          img
            width: 28px
            height: 28px
            border-radius: 50%
        .content
          display: inline-block
          vertical-align: top
          font-size: 0
          .userName
            font-size: 10px
            line-height: 12px
            color: rgb(7, 17, 27)
            margin-bottom: 4px
          .star-wrapper
            margin-bottom: 6px
            .star
              display: inline-block
              vertical-align: top
            .delivery
              display: inline-block
              vertical-align: top
              font-size: 10px
              line-height: 12px
              margin-left: 6px
              color: rgb(147, 157 159)
        .rating-info
          margin-left: 45px
          font-size: 12px
          color: rgb(7, 17, 27)
          line-height: 18px
        .rating-time
          position: absolute
          top: 18px
          right: 0
          font-size: 10px
          line-height: 12px
          z-index: -1
          color: rgb(147, 153, 159)
</style>
