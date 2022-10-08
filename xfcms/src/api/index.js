import http from './http.js'
const login = payload => {
    return http.post("/adminUser/login", payload);
};
const userInfo = () => {
    return http.get("/adminUser/profile");
};
/* 轮播图 */
const bannerData = payload => {
  return http.get("/carousels", { params: payload });
}
const bannerUpdate = payload => {
  return http.put("/carousels",payload);
}
const bannerNew = payload => {
  return http.post('/carousels',payload);
}
/* 热销商品 */
const goodsGet = payload => {
  return http.get("/indexConfigs",{params:payload});
}
const goodsEdit = payload => {
  return http.put("/indexConfigs",payload);
}
const goodsNew = (payload) => {
  return http.post("/indexConfigs", payload);
};
/* 新品上线 */
const productGet = payload =>{
return http.get("/indexConfigs",{params:payload});
}
const productEdit = (payload) => {
  return http.put("/indexConfigs", payload );
};
const productNew = (payload) => {
  return http.post("/indexConfigs",  payload);
};
/* 为你推荐 */
const recommendGet = (payload) => {
  return http.get("/indexConfigs", { params: payload });
};
const recommendEdit = (payload) => {
  return http.put("/indexConfigs", payload);
};
const recommendNew = (payload) => {
  return http.post("/indexConfigs", payload);
};
/* 分类管理 */
// categories?pageNumber=1&pageSize=10&categoryLevel=1&parentId=0
const  ClassGet = (payload) => {
  return http.get("/categories", { params: payload });
};
const ClassEdit = (payload) => {
  return http.put("/categories", payload);
};
const ClassNew = (payload) => {
  return http.post("/categories", payload);
};
const categories = payload => {
  return http.get("/categories", payload);
};
const goods = payload => {
  return http.post('/goods', payload);
};
const EditGoods = payload => {
  return http.put('goods', payload)
};
const goodslist = payload => {
  return http.get("/goods/list", { params: payload });
};
const goodsstatus = (num, payload) => {
  return http.put(`goods/status/${num}`, payload);
};
const goodsInfo = (id) => {
  return http.get(`/goods/${id}`);
};
const users = payload => {
  return http.get("/users", { params: payload });
};
const usersDisable = (num,payload) => {
  return http.put(`/users/${num}`,  payload );
};
const ordersGet = payload => {
  return http.get("orders", { params: payload });
};
const orderscheckDone = payload => {
  return http.put("orders/checkDone", payload);
};
const orderscheckOut = payload => {
  return http.put("orders/checkOut",payload);
}
export default {
  login,
  userInfo,
  bannerData,
  bannerUpdate,
  bannerNew,
  goodsGet,
  goodsEdit,
  goodsNew,
  productGet,
  productEdit,
  productNew,
  recommendGet,
  recommendEdit,
  recommendNew,
  ClassGet,
  ClassEdit,
  ClassNew,
  categories,
  goods,
  goodslist,
  goodsstatus,
  goodsInfo,
  EditGoods,
  users,
  usersDisable,
  ordersGet,
  orderscheckDone,
  orderscheckOut,
};