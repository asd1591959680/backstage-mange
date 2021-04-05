import axios from 'axios'

export function request(config) {
  const instance = axios.create({
    baseURL: '/api',
    timeout: 5000,
    withCredentials: true,
  })
  //axios拦截器
  instance.interceptors.request.use(
    (config) => {
      //需要授权的 API ，必须在请求头中使用 `Authorization` 字段提供 `token` 令牌
      config.headers.Authorization = window.sessionStorage.getItem('token')
      return config
    },
    (err) => {}
  )

  //响应拦截
  instance.interceptors.response.use(
    (res) => {
      return res.data
    },
    (err) => {}
  )

  //发烧网络请求
  return instance(config)
}
