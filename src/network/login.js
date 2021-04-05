import { request } from './requset.js'

export function getLogin(username, password) {
  return request({
    method: 'post',
    url: '/login',
    data: {
      username,
      password,
    },
  })
}
