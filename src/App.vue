<template>
  <div id="app">
    <!--这个是子元素获得父元素数据的写法，header相当于app的子元素-->
    <v-header :seller = 'seller'></v-header>
    <div class="tab border-1px">
      <div class="tab-item">
        <router-link to="/goods">商品</router-link>
      </div>
      <div class="tab-item">
        <router-link to="/ratings">评论</router-link>
      </div>
      <div class="tab-item">
        <router-link to="/seller">商家</router-link>
      </div>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
  import header from './components/header/header.vue';
  import data from '../data.json';
  export default {
    data() {
      return {
        seller: {},
        goods: [],
        ratings: []
      };
    },
    components: {
      'v-header': header
    },
    mounted() {
      this.seller = data.seller;
    }
  };

</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "./common/stylus/mixin.stylus";
  #app
    .tab
      display: flex
      width: 100%//使用人家生成的模板不然很容易出错
      height: 40px//这里是高度的一半移动端设计自动变成80
      line-height: 40px
      border-1px(rgba(7, 17, 27, 0.1))
      .tab-item
        flex: 1
        text-align: center
        & > a//虽然是router-link但是生成时会自动变成a所以这里使用a
          display: block//默认占满父元素
          font-size: 14px
          color: rgb(77, 85, 93)
          &.active//设置点击到goods是goods被激活并增加类名active
            color: rgb(240, 20, 20)//然后在main.js的VueRouter中添加linkActiveClass：active
</style>

