<template>
  <!--
  在这里要有模块依赖的是子元素获得父元素的数据也就是
  <star :eval="父元素数据"></star>
  就是在父元素中引用
  
  同时由于goods模块不是app的子元素所以不能使用app中的数据，也就是在
  app中发出的异步请求不能在goods模块中引用，想要应用数据只能在自己的
  模块内自己发异步请求
  -->
  
  <!--在这里goods左边的布局
  采用flex进行布局设为 0 0 80px固定的宽度
  1、采用display等于table进行布局
  在HTML部分
  采用ul，使用v-for来进行遍历
  图标部分v-show=“item.type>0”进行判断是否有图标，注意有图标和文字的一般设置vertical-align:top
  样式部分
  值得注意的是menu-item宽度设置为56，加上padding左右12px再绘画边框的是自动的绘画成menu-wrapper的宽度
  .text display: table-cell 设置vertical-align:middel里面的内容就会垂直居中了
  -->
<div class="goods">
  <div class="menu-wrapper" ref="menuWrapper">
    <ul>
      <li v-for="(item, index) in goods" class="menu-item border-1px" :class="{current:currentIndex === index}" @click="selectMenu(index, $event)">
        <span class="text"><span v-show="item.type>0" class="icon" :class="classMap[item.type]"></span>{{item.name}}</span>
      </li>
    </ul>
  </div>
  <div class="goods-wrapper" ref="foodsWrapper">
    <ul>
      <li v-for="(foods, index) in goods" class="food-list food-list-hook">
        <!--每个name下面包含foods，所以还需要进行遍历 food-list-hook只是当做选测器-->
        <h1 class="title">{{foods.name}}</h1>
        <ul>
          <li v-for="(food, index1) in foods.foods" class="food-item border-1px" @click="selectFood(food, $event)">
            <div class="icon">
              <img :src="food.icon" width="57" height="57"/>
            </div>
            <div class="content">
              <h2 class="name">{{food.name}}</h2>
              <p class="desc">{{food.description}}</p>
              <div class="extra">
                <span class="count">月售{{food.sellCount}}</span><span>好评率{{food.rating}}%</span>
              </div>
              <div>
                <span class="symbol">￥</span><span class="price">{{food.price}}</span><s v-show="food.oldPrice"><span class="oldSymbol">￥</span><span class="oldPrice">{{food.oldPrice}}</span></s>
              </div>
            </div>
            <div class="cartControl">
              <cart-control :food="food"  v-on:cartAdd="_addBall"></cart-control>
              <!--v-on是绑定子组件专递过来的cartAdd事件-->
            </div>
          </li>
        </ul>
      </li>
    </ul>
  </div>
  <shop-cart :minPrice="seller.minPrice" :deliveryPrice="seller.deliveryPrice" :selectFoods="selectFoods" ref="shopCart"></shop-cart>
  <!--ref是访问组件或者是给don对象增加新的属性以方便访问-->
  <food-detail :selectedFood="selectedFood" ref="foodDetail" v-on:cartAdd="_addBall" :shopCartData="shopCart"></food-detail>
</div>
</template>

<script type="text/ecmascript-6">
  import BScroll from 'better-scroll';
  import data from '../../data.json';
  import shopCart from '../shopcart/shopcart.vue';
  import cartControl from '../cartControl/cartControl.vue';
  import foodDetail from '../food/food1.vue';
  export default {
    data() {
      return {
        shopCart: {}, // 保存访问到shopCart子组件的数据
        selectedFood: {},
        goods: [],
        seller: {},
        el: '',
        listHeight: [],
        scrollY: 0,
        classMap: ['decrease', 'discount', 'special', 'invoice', 'guarantee']
      };
    },
    mounted() {
          this.seller = data.seller;
          this.goods = data.goods;
          this.$nextTick(// 这是获得数据的函数
            function() {
              this._initScroll();
              // 这是计算右侧区间的高度
              this._calculateHeight();
            });
  },
    methods: {
      selectFood(food, event) {
        if (!event._constructed) {
          return;
        };
        this.selectedFood = food;
        this.$refs.foodDetail.show();
      },
      selectMenu(index, event) {
        if (!event._constructed) {
          // 这是使用better-scroll之后阻止默认事件
          return;
        };
        let foodsList = this.$refs.foodsWrapper.getElementsByClassName('food-list-hook');
        let el = foodsList[index];
        this.foodsScroll.scrollToElement(el, 300);
      },
      _initScroll() {
        this.menuScroll = new BScroll(this.$refs.menuWrapper, {
          click: true
          // 这是使在移动端下能点击，还有vue的阻止事件，冒泡都无效
        });
        this.foodsScroll = new BScroll(this.$refs.foodsWrapper, {
          // vue中获得元素的方法this.$refs
          probeType: 3,
          click: true
          // probeType实时监视坐标的变化
        });
        this.foodsScroll.on('scroll', (pos) => {
          // 这是监听scroll事件，pos是当前滚动的位置
          this.scrollY = Math.abs(Math.round(pos.y));
          // 获得整数的y坐标
        });
      },
      _calculateHeight() {
        let foodList = this.$refs.foodsWrapper.getElementsByClassName('food-list-hook');
// 这是获得右侧li(父)集合
        let height = 0;
// 初始化高度
        this.listHeight.push(height);
        for (let i = 0; i < foodList.length; i++) {
// 遍历得到每个li
          let item = foodList[i];
          height += item.clientHeight;
          // 获得每个区间的可是高度,当前高度加上下一个高度(这里不能是style.height)
          this.listHeight.push(height);
        }
      },
      _addBall(target) {
          this.el = target;
          this.shopCart = this.$refs.shopCart;
          this.shopCart.drop(this.el);// 访问其子组件
      }
    },
    computed: {
      currentIndex() {
        for (let i = 0; i < this.listHeight.length; i++) {
          let height1 = this.listHeight[i];
          let height2 = this.listHeight[i + 1];
          // 获得两个区间的长度，使用当前坐标和这个区间进行比较
          if (!height2 || this.scrollY >= height1 && this.scrollY < height2) {
            // 不能等于最后一个因为i+1为undefined
            return i;
          };
        };
        return 0;
      },
      selectFoods() {
        let foodsArr = [];
        this.goods.forEach((foods) => {
          foods.foods.forEach((food) => {
            if (food.count) {
              foodsArr.push(food);
            };
          });
        });
        return foodsArr;
      }
    },
    components: {
      shopCart,
      cartControl,
      foodDetail
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin.stylus"
  
  .goods
    display: flex
    position: absolute
    top: 174px
    bottom: 46px
    overflow: hidden
    width: 100%
    .menu-wrapper
      flex: 0 0 80px
      width: 80px//可能有兼容问题
      background: #f3f5f7
      .menu-item
        display: table
        height: 54px
        width: 56px
        padding: 0 12px
        border-1px(rgba(7, 17, 27, 0.1))
        line-height: 14px
        &.current
          position: relative
          z-index: 10
          margin-top: -1px
          background: #fff
          font-weight: 700
        .icon
          display: inline-block
          vertical-align: top
          width: 12px
          height: 12px
          margin-right: 2px
          background-size: 12px 12px
          background-repeat: no-repeat
          &.decrease
            bg-image('decrease_3')
          &.discount
            bg-image('discount_3')
          &.guarantee
            bg-image('guarantee_3')
          &.invoice
            bg-image('invoice_3')
          &.special
            bg-image('special_3')
        .text
            display: table-cell
            width: 56px
            vertical-align: middle
            font-size: 12px
    .goods-wrapper
      flex: 1//剩下的自动响应式的改变大小
      .title
        height: 26px
        padding-left: 14px
        border-left: 2px solid #d9dde1
        background: #f3f5f7
        font-size: 12px
        color: rgb(147, 153, 159)
        line-height: 26px
      .food-item
        display: flex
        margin: 18px
        padding-bottom: 18px
        border-1px(rgba(7, 17, 27, 0.1))
        &:last-child
          border-none()
        .icon
          flex: 0 0 57px
          margin-right: 10px
        .content
          flex: 1
          .name
            margin: 2px 0 8px 0
            line-height: 14px
            font-size: 14px
            color: rgb(7, 17, 27)
          .desc
            margin-bottom: 8px
          .desc, .extra
            font-size: 10px
            line-height: 10px
            color: rgb(147, 153, 159)
            .count
              margin-right: 12px
          .symbol
            font-weight: normal
            font-size: 10px
            color: rgb(240, 20, 20)
            line-height: 24px
          .price
            font-size: 12px
            color: rgb(240, 20, 20)
            margin-right: 4px
            font-weight: 700
            line-height: 24px
          .oldSymbol
            font-size: 10px
            font-weight: normal
            line-height: 24px
            color: rgb(147, 153, 159)
          .oldPrice
            font-size: 10px
            font-weight: 700
            line-height: 15px
            color: rgb(147, 153, 159)
        .cartControl
          position: absolute
          bottom: 0
          right: 0
          z-index: 60
</style>

