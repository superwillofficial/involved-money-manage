const glob = require("glob");
const path = require("path");
const fs = require("fs");
const _ = require("lodash");
const request = require("request-promise");
const pluralize = require("pluralize");
const JSEncrypt = require("node-jsencrypt");

// 引用环境配置
const dotenv = require("dotenv");
const envConfig = dotenv.parse(fs.readFileSync("../.env.development"));
for (const k in envConfig) {
  process.env[k] = envConfig[k];
}

// 配置文件引入
let webRoutes = _.omit(require("../src/routes/index"), "Login");
// let webPowers = require('./webPower');
let webPowers = {};
let apiRoutes = {};

const BASE_URL = `${process.env.REACT_APP_AUTH_SERVICE}/api/v1/auth`;

const LOGIN_API = `${BASE_URL}/login`;
const GET_MENU_API = `${BASE_URL}/menu/menu-tree`;
const GET_ACTION_API = `${BASE_URL}/action/action-tree`;
const DELETE_MENU_API = `${BASE_URL}/menu/delete-node`;
const DELETE_ACTION_API = `${BASE_URL}/action/delete-node`;
const ADD_MENU_API = `${BASE_URL}/menu/add-node`;
const ADD_ACTION_API = `${BASE_URL}/action/add-node`;
const SET_MENU_API = `${BASE_URL}/menu/change-auth`;
const SET_ACTION_API = `${BASE_URL}/action/change-auth`;
const ORG_LIST_API = `http://127.0.0.1:7001/api/v1/organization`;
const ROLE_ADD_API = `${BASE_URL}/role/add`;
const ROLE_LIST_API = `${BASE_URL}/role/list`;
const ADD_USER_API = `${BASE_URL}/user/add`;
const UPDATE_USER_API = `${BASE_URL}/user/update-info`;
const UPDATE_ROLE_API = `${BASE_URL}/role/update`;

async function insertAction({
  web,
  api,
  dropWeb,
  dropApi,
  role,
  roleMenu,
  roleUser
}) {
  // 登陆
  const login = await request({
    method: "POST",
    uri: LOGIN_API,
    body: {
      username: rsaEncrypt("admin"),
      password: rsaEncrypt("111111")
    },
    json: true
  });
  // 删除 web_ui 权限
  if (dropWeb) {
    console.log("===> 删除页面权限开始 <===");
    await removeActions(login.token, "web_ui");
    console.log("===> 删除页面权限完成 <===");
  }

  // 创建 web_ui 权限
  if (web) {
    // 权限按钮赋值类型
    webPowers = _.mapValues(
      webPowers,
      (v, k) => ((v.code = k), (v.type = "btn"), v)
    );

    // 页面赋值类型
    webRoutes = _.mapValues(
      webRoutes,
      (v, k) => ((v.code = k), (v.type = "page"), v)
    );

    console.log("===> 页面权限初始化开始 <===");
    const webQueue = { ...webRoutes, ...webPowers };
    await createActions(login.token, Object.values(webQueue), "web_ui");
    console.log("===> 页面权限初始化完成 <===");
  }

  // 删除 api 权限
  if (dropApi) {
    console.log("===> 删除API权限开始 <===");
    await removeActions(login.token, "api");
    console.log("===> 删除API权限完成 <===");
  }

  // 创建 api 权限
  if (api) {
    let apiQueue = _.mapValues(
      apiRoutes,
      (v, k) => ((v.type = "api"), (v.code = k), v)
    );

    console.log("===> API权限初始化开始 <===");
    await createActions(login.token, Object.values(apiQueue), "api");
    console.log("===> API权限初始化完成 <===");
  }

  //添加角色
  if (role) {
    console.log("===> 添加角色开始 <===");
    await roleAdd(login.token);
    console.log("===> 添加角色完成 <===");
  }

  //添加角色菜单权限
  if (roleMenu) {
    console.log("===> 添加角色菜单权限开始 <===");
    await menuAdd(login.token);
    console.log("===> 添加角色菜单权限完成 <===");
  }

  //添加角色下的用户
  if (roleUser) {
    console.log("===> 添加用户开始 <===");
    userAdd(login.token);
    console.log("===> 添加用户完成 <===");
  }

  // await update(login.token);
}

insertAction({
  web: true,
  dropWeb: true,
  api: true,
  dropApi: true,
  role: true,
  roleMenu: true,
  roleUser: true
}).then(console.log);

/**
 * 添加角色
 */
async function roleAdd(token) {
  //查询机构列表
  // const actionRes = await request({
  //   method: "GET",
  //   uri: ORG_LIST_API,
  //   json: true
  // });
  // const org = actionRes["body"];
  const org = [{
    id: "1",
    name: "福州大学",
    code: "001",
    level: 1,
  }];
  //每个机构添加管理员
  const adminstrator = org.map(e => {
    if(e.level < 3){
      return {
        roleName: e.name + "管理员",
        description: "管理员",
        organizationId: e.id,
        organizationName: e.name,
        organizationCode: e.code,
        visialbletype: 1
      };
    }else{
      return;
    }
  });
  adminstrator.map(e => {
    if(e != undefined){
      add(e);
    }
  });


  //添加经办
  // const jinban = org.map(e => {
  //   if(e.level < 3){
  //     return {
  //       roleName: e.name + "经办",
  //       description: "经办",
  //       organizationId: e.id,
  //       organizationName: e.name,
  //       organizationCode: e.code,
  //       visialbletype: 1
  //     };
  //   }else{
  //     return;
  //   }
  // });

  // jinban.map(e => {
  //   if(e != undefined){
  //     add(e);
  //   }
  // });

  async function add(role) {
    await request({
      method: "POST",
      uri: ROLE_ADD_API,
      qs: role,
      headers: { Authorization: token },
      json: true
    });
  }
}

/**
 * 角色赋予菜单权限
 */
async function menuAdd(token) {
  // 查询出原来所有的菜单权限（树形）
  const actionRes = await request({
    method: "GET",
    uri: GET_MENU_API,
    qs: { roleCode: 0 },
    headers: { Authorization: token },
    json: true
  });
  //取出所有菜单权限（数组）
  const auth = actionRes.data;
  const actionCode = [];
  const loop = data => {
    data.forEach(item => {
      actionCode.push(item.actionCode);
      if (item.child) {
        loop(item.child);
      }
    });
  };
  if (auth && auth.length ){
    loop(auth);
    //为1，2级role添加所有菜单权限
    const roles = await request({
      method: "GET",
      uri: ROLE_LIST_API,
      headers: { Authorization: token },
      json: true
    });

    for(let i = 0; i < roles.data.length;i++){
      const res = await addMenu(roles.data[i].roleCode, actionCode, token);
      if(res.respCode === -1){
        console.log(res);
      }
    }
  }
  //插入菜单权限
  async function addMenu(roleCode, actionCode, token) {
    return await request({
      method: "PUT",
      uri: SET_MENU_API,
      qs: {
        roleCode: roleCode
      },
      body: { actionCode: actionCode },
      headers: { Authorization: token },
      json: true
    });
  }
}

/**
 * 插入用户
 */
async function userAdd(token) {
  //获取所有角色
  const roles = await request({
    method: "GET",
    uri: ROLE_LIST_API,
    headers: { Authorization: token },
    json: true
  });
  //为每个角色添加一个admin用户
  const rolesData = roles.data;
  for (let i = 0; i < rolesData.length; i++) {
    name = createName();
    addUser(name, rolesData[i], token, i);
  }

  async function addUser(name, role, token, index) {
    await request({
      method: "POST",
      uri: ADD_USER_API,
      qs: {
        roleCode: role.roleCode,
        username: "test",
        name: name,
        phone: "",
        organizationId: role.organizationId,
        roleCode: role.roleCode,
        organizationCode: role.organizationCode,
        organizationName: role.organizationName,
        sex: "",
        type: ""
      },
      headers: { Authorization: token },
      json: true
    });
  }
}

//修改超级管理员
async function update(token) {
  await request({
    method: "PUT",
    uri: UPDATE_USER_API,
    body: {
      user: {
        id: 1,
        name: "超级管理员",
        sex: 1,
        status: 1,
        type: 1
      },
      roleList: [
        {
          roleCode: "sys_admin",
          roleName: "admin",
          status: 1,
          organizationId: "A00"
        }
      ]
    },
    headers: { Authorization: token },
    json: true
  });

  return await request({
    method: "PUT",
    uri: UPDATE_ROLE_API,
    body: {
      id: 1,
      organizationId: 1,
      organizationCode: "A00"
    },
    headers: { Authorization: token },
    json: true
  });
}

/**
 * 删除权限列表
 */
async function removeActions(token, actionType) {
  const queryUrl = actionType === "web_ui" ? GET_MENU_API : GET_ACTION_API;
  // 查询出原来所有的权限
  const actionRes = await request({
    method: "GET",
    uri: queryUrl,
    qs: { roleCode: 0 },
    headers: { Authorization: token },
    json: true
  });
  const delUrl = actionType === "web_ui" ? DELETE_MENU_API : DELETE_ACTION_API;
  // 删除原来所有的权限
  if (actionRes.respCode === 0) {
    for (let item of actionRes.data) {
     let rs = await request({
        method: "DELETE",
        uri: delUrl,
        qs: { id: item.id },
        headers: { Authorization: token },
        json: true
      });
    }
  }
}

/**
 * 创建 restful api 路由权限列表
 * @param {*} modelPath
 * @param {*} prefix
 */
async function createRestAPIRoutes(modelPath, prefix = "/api/v1/rest") {
  return await new Promise((resolve, reject) => {
    glob(path.join(modelPath, "**", "*.js"), {}, function(err, files) {
      if (err) reject(err);
      let routes = {};
      for (let file of files) {
        const model = require(file);
        const text = `数据操作-${model.title}`;
        const modelName = path.basename(file).split(".")[0];
        const resourceName = _.kebabCase(pluralize(modelName));

        let apis = [
          {
            code: `${modelName}`,
            method: "",
            path: "",
            type: "class",
            text: `${text}`,
            parent: "Root"
          },
          {
            code: `Find${modelName}`,
            method: "GET",
            path: `${prefix}/${resourceName}`,
            text: `${text}-查询`,
            parent: `${modelName}`
          },
          {
            code: `FindOne${modelName}`,
            method: "GET",
            path: `${prefix}/${resourceName}/*`,
            text: `${text}-单条详情`,
            parent: `${modelName}`
          },
          {
            code: `Create${modelName}`,
            method: "POST",
            path: `${prefix}/${resourceName}`,
            text: `${text}-新增`,
            parent: `${modelName}`
          },
          {
            code: `Update${modelName}`,
            method: "PUT",
            path: `${prefix}/${resourceName}`,
            text: `${text}-编辑`,
            parent: `${modelName}`
          },
          {
            code: `Remove${modelName}`,
            method: "DELETE",
            path: `${prefix}/${resourceName}`,
            text: `${text}-删除`,
            parent: `${modelName}`
          }
        ];

        apis.forEach((api, idx) => {
          routes[api.code] = {
            serial: idx,
            code: api.code,
            method: api.method,
            path: api.path,
            text: api.text,
            parent: api.parent
          };
        });
      }
      resolve(routes);
    });
  });
}

/**
 * 创建权限列表
 */
async function createActions(token, queue = [], actionType) {
  let createdActions1 = {};
  let idx = 0;
  while (queue.length > 0) {
    let parentId;
    const route = queue.shift();

    if (route.parent && route.parent !== "Root") {
      if (!createdActions1[route.parent]) {
        queue.push(route);
        continue;
      } else {
        parentId = createdActions1[route.parent].id;
      }
    }
    const createUrl = actionType === "web_ui" ? ADD_MENU_API : ADD_ACTION_API;
    // 新增权限
    const res = await request({
      method: "POST",
      uri: createUrl,
      form: {
        method: route.method || "GET",
        type: route.type,
        parentId: parentId || 0,
        serial: idx + 1,
        actionName: route.code,
        description: route.text,
        url: route.path,
        icon: route.icon || null,
        component: route.component,
        redirect: route.redirect || null,
        exact: route.exact ? 1 : 0,
        nav: route.nav ? 1 : 0
      },
      headers: { Authorization: token },
      json: true
    });
    // 新增成功，添加到已添加列表
    createdActions1[route.code] = res.data;
    idx++;
  }
  const setPowerUrl = actionType === "web_ui" ? SET_MENU_API : SET_ACTION_API;
  // 为当前用户配置顶级权限
  await request({
    method: "PUT",
    uri: setPowerUrl,
    qs: {
      type: actionType,
      roleCode: "sys_admin"
    },
    body: { actionCode: _.map(createdActions1, v => v.actionCode) },
    headers: { Authorization: token },
    json: true
  });
}
/**
 * 加密方法
 */
function rsaEncrypt(data) {
  const encrypt = new JSEncrypt();
  const pubkey = `
  -----BEGIN PUBLIC KEY-----
  MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDlOJu6TyygqxfWT7eLtGDwajtN
  FOb9I5XRb6khyfD1Yt3YiCgQWMNW649887VGJiGr/L5i2osbl8C9+WJTeucF+S76
  xFxdU6jE0NQ+Z+zEdhUTooNRaY5nZiu5PgDB0ED/ZKBUSLKL7eibMxZtMlUDHjm4
  gwQco1KRMDSmXSMkDwIDAQAB
  -----END PUBLIC KEY-----`;
  encrypt.setPublicKey(pubkey);
  const encrypted = encrypt.encrypt(data);
  return encrypted;
}

const familyNames = new Array(
  "赵",
  "钱",
  "孙",
  "李",
  "周",
  "吴",
  "郑",
  "王",
  "冯",
  "陈",
  "褚",
  "卫",
  "蒋",
  "沈",
  "韩",
  "杨",
  "朱",
  "秦",
  "尤",
  "许",
  "何",
  "吕",
  "施",
  "张",
  "孔",
  "曹",
  "严",
  "华",
  "金",
  "魏",
  "陶",
  "姜",
  "戚",
  "谢",
  "邹",
  "喻",
  "柏",
  "水",
  "窦",
  "章",
  "云",
  "苏",
  "潘",
  "葛",
  "奚",
  "范",
  "彭",
  "郎",
  "鲁",
  "韦",
  "昌",
  "马",
  "苗",
  "凤",
  "花",
  "方",
  "俞",
  "任",
  "袁",
  "柳",
  "酆",
  "鲍",
  "史",
  "唐",
  "费",
  "廉",
  "岑",
  "薛",
  "雷",
  "贺",
  "倪",
  "汤",
  "滕",
  "殷",
  "罗",
  "毕",
  "郝",
  "邬",
  "安",
  "常",
  "乐",
  "于",
  "时",
  "傅",
  "皮",
  "卞",
  "齐",
  "康",
  "伍",
  "余",
  "元",
  "卜",
  "顾",
  "孟",
  "平",
  "黄",
  "和",
  "穆",
  "萧",
  "尹"
);
const givenNames = new Array(
  "子璇",
  "淼",
  "国栋",
  "夫子",
  "瑞堂",
  "甜",
  "敏",
  "尚",
  "国贤",
  "贺祥",
  "晨涛",
  "昊轩",
  "易轩",
  "益辰",
  "益帆",
  "益冉",
  "瑾春",
  "瑾昆",
  "春齐",
  "杨",
  "文昊",
  "东东",
  "雄霖",
  "浩晨",
  "熙涵",
  "溶溶",
  "冰枫",
  "欣欣",
  "宜豪",
  "欣慧",
  "建政",
  "美欣",
  "淑慧",
  "文轩",
  "文杰",
  "欣源",
  "忠林",
  "榕润",
  "欣汝",
  "慧嘉",
  "新建",
  "建林",
  "亦菲",
  "林",
  "冰洁",
  "佳欣",
  "涵涵",
  "禹辰",
  "淳美",
  "泽惠",
  "伟洋",
  "涵越",
  "润丽",
  "翔",
  "淑华",
  "晶莹",
  "凌晶",
  "苒溪",
  "雨涵",
  "嘉怡",
  "佳毅",
  "子辰",
  "佳琪",
  "紫轩",
  "瑞辰",
  "昕蕊",
  "萌",
  "明远",
  "欣宜",
  "泽远",
  "欣怡",
  "佳怡",
  "佳惠",
  "晨茜",
  "晨璐",
  "运昊",
  "汝鑫",
  "淑君",
  "晶滢",
  "润莎",
  "榕汕",
  "佳钰",
  "佳玉",
  "晓庆",
  "一鸣",
  "语晨",
  "添池",
  "添昊",
  "雨泽",
  "雅晗",
  "雅涵",
  "清妍",
  "诗悦",
  "嘉乐",
  "晨涵",
  "天赫",
  "玥傲",
  "佳昊",
  "天昊",
  "萌萌",
  "若萌"
);

function createName() {
  const i = Math.floor(Math.random() * Math.floor(100));
  const familyName = familyNames[i];
  const j = Math.floor(Math.random() * Math.floor(100));
  const givenName = givenNames[j];
  const name = familyName + givenName;
  return name;
}
