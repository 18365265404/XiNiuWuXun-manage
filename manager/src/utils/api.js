import axios from 'axios'
import {Message, Alert} from 'element-ui'
import url from '../utils/url';
// import session_storage from '@/utils/session_storage'
import sessionUtil from '../utils/sessionStorage'
import router from '../router'
// axios.defaults.withCredentials = true
import qs from 'qs'


axios.interceptors.request.use(config=> {
  // let refreshTime=sessionUtil.getSessionStorage('refreshTime')
  // let loginTime=sessionUtil.getSessionStorage('loginTime')
  // let currentTime = (new Date()).getTime()
  // if(currentTime-loginTime>refreshTime*1000){
  //   router.replace({
  //       path: '/login',
        
  //   })
  // }
  // console.log('refresh过期时间',refreshTime)
  // console.log('登录的时间',loginTime)
  // console.log('当前系统时间',currentTime)

  return config;
}, err=> {
  Message.error({message: '请求超时!'});
  return Promise.resolve(err);
})

// 是否正在刷新的标记
let isRefreshing = false
// 重试队列，每一项将是一个待执行的函数形式
let requests = []

axios.interceptors.response.use(response=> {
  // console.log("1111111111===============11111111111111",response)
  if(response.status== 200){
      if(response.data.status==-4){
        sessionStorage.clear()
        // this.$router.push("/login");
        router.replace({
            path: '/login',
            
        })
      }

      if(response.data.status==-3){
        console.log('response',response.data)
        // if (!isRefreshing) {
        //   isRefreshing = true
          return refreshToken().then(res => {
            console.log('刷新返回的数据',res.data.data)
            sessionUtil.putSessionStorage('accessToken',res.data.data.accessToken)
            // sessionUtil.putSessionStorage('refreshToken',res.data.data.refreshToken)
            const { accessToken } = res.data.data

            
            axios.defaults.headers['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8'
            axios.defaults.headers['Authorization'] = accessToken
            
            sessionUtil.putSessionStorage('accessToken',res.data.data.accessToken)
            response.config.headers['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8'
            response.config.headers['Authorization'] = accessToken

            // // 已经刷新了token，将所有队列中的请求进行重试
            requests.forEach(cb => cb(accessToken))
            requests = []
            response.config.data=qs.parse(response.config.data)

            return axios(response.config)
          })
        // }
        // else {
        //   // 正在刷新token，将返回一个未执行resolve的promise
        //   return new Promise((resolve) => {
        //     // 将resolve放进队列，用一个函数形式来保存，等token刷新后直接执行
        //     requests.push((accessToken) => {
        //       response.config.baseURL = ''
        //       response.config.headers['Authorization'] = accessToken
        //       resolve(axios(response.config))
        //     })
        //   })
        // }
        

      }
  }
  if (response.status && response.status == 200 && response.data.status == 'error') {
    
    // Message.error({message: data.data.msg});
    return;
  }
  return response;
}, err=> {

  // if (err.response.status == 504||err.response.status == 404) {
  //   // Message.error({message: '服务器被吃了⊙﹏⊙∥'});
  // } 
  return Promise.resolve(err);
})

function refreshToken () {
  
  // instance是当前request.js中已创建的axios实例
  return axios({
    method: 'post',
    url: `http://192.168.1.98:8081/${url.oauthTokenGetNewAccessToken}`, //?token=${getCookie("token")}
    data: {
      refreshToken:sessionUtil.getSessionStorage('refreshToken')
    },
    transformRequest: [function (data) {
      let ret = ''
      for (let it in data) {
        ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
      }
      return ret
    }],

  })


}




var base = url.server;
var base2 = url.server2;

// get请求
export const getRequest = (url, params) => {
    return axios({
      method: 'get',
      url: `${base}${url}`,
      params: params,
      transformRequest: [function (data) {
        let ret = ''
        for (let it in data) {
          ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
        }
        return ret
      }],
      headers: {
        'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8',
        'Authorization': sessionUtil.getSessionStorage('accessToken')

      }
    });
}



export const postRequest = (url, params) => {
  return axios({
    method: 'post',
    contentType:'application/json',
    url: `${base}${url}`, //?token=${getCookie("token")}
    data: params,
    transformRequest: [function (data) {
      let ret = ''
      for (let it in data) {
        ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
      }
      return ret
    }],
    headers: {
      // 'Content-Type': 'application/json',
      'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8',
      'Authorization': sessionUtil.getSessionStorage('accessToken')
      
    }
  });
}


export const uploadFileRequest = (url, params) => {
  return axios({
    method: 'post',
    contentType: false,//这里不要落下
    url: `${url}`,
    data: params,
    headers: {
      'Content-Type': 'multipart/form-data',

    }
  });
}
export const putRequest = (url, params) => {
  return axios({
    method: 'put',
    url: `${base}${url}`,
    data:params,
    transformRequest: [function (data) {
      let ret = ''
      for (let it in data) {
        ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
      }
      return ret
    }],
    headers: {
      'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8',
      'Authorization': sessionUtil.getSessionStorage('accessToken')
      
    }
  });
}
export const deleteRequest = (url,params) => {
  return axios({
    method: 'delete',
    url: `${base}${url}`,
    data:params,
    transformRequest: [function (data) {
      let ret = ''
      for (let it in data) {
        ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
      }
      return ret
    }],
    headers: {
      'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8',
      'Authorization': sessionUtil.getSessionStorage('accessToken')
      
    }
  });
}

export const patchRequest = (url,params) => {
  return axios({
    method: 'patch',
    url: `${base}${url}`,
    data:params,
    transformRequest: [function (data) {
      let ret = ''
      for (let it in data) {
        ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
      }
      return ret
    }],
    headers: {
      'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8',
      'Authorization': sessionUtil.getSessionStorage('accessToken')
      
    }
  });
}
