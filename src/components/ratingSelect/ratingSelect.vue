<template>
  <div class="ratingSelect">
    <div class="rating-type">
      <span class="block positive" :class="{'active':selectType===2}" @click="select(2, $event)">{{desc.all}}<span class="count">{{ratings.length}}</span></span>
      <span class="block positive" :class="{'active':selectType===0}" @click="select(0, $event)">{{desc.positive}}<span class="count">{{positives}}</span></span>
      <span class="block negative" :class="{'active':selectType===1}" @click="select(1, $event)">{{desc.negative}}<span class="count">{{negatives}}</span></span>
    </div>
    <div class="switch" :class="{'on':onlyContent}" @click="selectContent($event)">
      <i class="icon-check_circle"></i>
      <span class="desc">只看有内容的评价</span>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  const POSITIVE = 0;// 这是标明选择的状态，和后台的rateType有关
  const NEGATIVE = 1;
  const ALL = 2;
  // 定义几个变量记录所选择的的状态
  
  export default {
    props: {
      ratings: {
        type: Array,
        default() {
          return [];
        }
      },
      desc: {
        type: Object,
        default() {
          return {
            all: '全部',
            positive: '满意',
            negative: '不满意'
          };
        }
      }
    },
    methods: {
      selectContent(event) {
        if (!event._constructed) {
          return;
        };
        this.onlyContent = !this.onlyContent;
        this.$emit('onlyContent', this.onlyContent);
      },
      select(type, event) {
        if (!event._constructed) {
          return;
        };
        this.selectType = type;
        this.$emit('selectType', type);
        // this.selectType这个数据只从父组件转过过来的，所以其发生改变需通过派发一个事件告知父组件其已经发生变化
      }
    },
    data() {
      return {
        selectType: ALL,
        onlyContent: true
      };
    },
    computed: {
      positives() {
        let count = 0;
        this.ratings.forEach((rating) => {
          if (rating.rateType === POSITIVE) {
            count++;
          };
        });
        return count;
      },
      negatives() {
        let count = 0;
        this.ratings.forEach((rating) => {
          if (rating.rateType === NEGATIVE) {
            count++;
          };
        });
        return count;
      }
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import '../../common/stylus/mixin.stylus'
  
  .rating-type
    margin: 0 18px
    padding: 18px 0
    border-1px(rgba(7, 17, 27, 0.1))
    .block
      display: inline-block
      padding: 8px 12px
      font-size: 0px
      border-radius: 12px
      font-height: 12px
      margin-right: 8px
      font-color: rgb(77, 85, 93)
      background: rgba(0, 160, 220, 0.2)
      &.positive
        font-size: 12px
        margin-right: 8px
        &.active
          color: #fff
          background: rgb(0, 160, 220)
      &.negative
        font-size: 12px
        background: rgba(77, 85, 93, 0.2)
        &.active
          color: #fff
          background: rgb(77, 85, 93)
      .count
        display: inline-block
        font-size: 8px
        fone-height: 12px
        margin-left: 2px
  .switch
    padding: 12px 18px
    border-bottom: 2px solid rgba(7, 17, 27, 0.1)
    &.on
      .icon-check_circle
        color: #00c850
    .icon-check_circle
      display: inline-block
      vertical-align: top
      font-size: 24px
      line-height: 24px
      color: rgb(147, 153, 159)
    .desc
      display: inline-block
      vertical-align: top
      font-size: 12px
      line-height: 24px
      color: rgb(147, 153, 159)
</style>
