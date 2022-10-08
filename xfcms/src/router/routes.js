import Home from '../views/home.vue'
import store from '../store'
// import homeChildren from './homeChildren'
const routes = [
  {
    path: "/",
    redirect: "/home/controlPanel",
  },
  {
    path: "/home",
    name: "home",
    meta: {
      title: store.state.title,
    },
    children: [
      {
        path: "/home/NewGoods:id",
        name: "NewGoods",
        meta: {
          title: "新增商品",
          icon: "添加.png",
        },
        component: () => import("../views/NewGoods.vue"),
      },
      {
        path: "bannersetting",
        name: "banner",
        meta: {
          title: "轮播图设置",
          issubset: true,
          icon: "lunbotuguanli.png",
        },
        component: () => import("../views/home/bannersetting.vue"),
      },
      {
        path: "/home/goodssetting",
        name: "goodssetting",
        meta: {
          title: "热销商品管理",
          issubset: true,
          icon: "rexiaochanpin.png",
        },
        component: () => import("../views/home/goodssetting.vue"),
      },
      {
        path: "/home/productsetting",
        name: "productsetting",
        meta: {
          title: "新品上线",
          issubset: true,
          icon: "shinshopxinpin.png",
        },
        component: () => import("../views/home/productsetting.vue"),
      },
      {
        path: "/home/recommendsetting",
        name: "recommendsetting",
        meta: {
          title: "为你推荐",
          issubset: true,
          icon: "tuijian.png",
        },
        component: () => import("../views/home/recommendsetting.vue"),
      },
      {
        path: "/home/controlPanel",
        name: "controlPanel",
        meta: {
          title: "控制面板",
          icon: "kongzhimianban.png",
        },
        component: () => import("../views/home/controlPanel.vue"),
      },
      {
        path: "/home/classification",
        name: "classification",
        meta: {
          title: "分类管理",
          icon: "yingyong.png",
        },
        component: () => import("../views/classification.vue"),
      },
      {
        path: "/home/goodsmanager",
        name: "goodsmanager",
        meta: {
          title: "商品管理",
          icon: "shangpin.png",
        },
        component: () => import("../views/goods.vue"),
      },
      {
        path: "/home/membermanager",
        name: "membermanager",
        meta: {
          title: "会员管理",
          icon: "huiyuan.png",
        },
        component: () => import("../views/membermanager.vue"),
      },
      {
        path: "/home/order",
        name: "order",
        meta: {
          title: "订单管理",
          icon: "dingdan.png",
        },
        component: () => import("../views/order.vue"),
      },
      {
        path: "/home/classification/classSon:id",
        name: "classSon",
        meta: {
          title: "",
        },
        component: () => import("../views/classSon.vue"),
      },
      {
        path: "/home/order/orderDetil:id",
        name: "orderDetil",
        meta: {
          title: "订单详情",
        },
        component: () => import("../views/orderDetil.vue"),
      },
    ],
    component: Home,
  },
  {
    path: "/login",
    name: "login",
    meta: {
      title: "用户登录",
    },
    component: () => import("../views/login.vue"),
  },
  {
    path: "/:pathMatch(.*)*",
    redirect: "/home/controlPanel",
  },
  {
    path: "",
    redirect: "/home/controlPanel",
  },
];
export default routes;