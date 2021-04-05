import { request } from './requset.js'

export function getLeftMenu() {
  return request({
    url: '/menus',
  })
}
export function getUsersList(query, pagenum, pagesize) {
  return request({
    url: '/users',
    params: {
      query,
      pagenum,
      pagesize,
    },
  })
}
export function getUsersState(uId, type) {
  return request({
    method: 'put',
    url: `/users/${uId}/state/${type}`,
  })
}
export function getAddUsers(username, password, email, mobile) {
  return request({
    method: 'post',
    url: '/users',
    data: {
      username,
      password,
      email,
      mobile,
    },
  })
}

export function getEditUsers(id) {
  return request({
    url: `/users/${id}`,
  })
}

export function getEditSubmit(id, email, mobile) {
  return request({
    method: 'put',
    url: `/users/${id}`,
    data: {
      email,
      mobile,
    },
  })
}

export function getDeleteUsers(id) {
  return request({
    method: 'delete',
    url: `/users/${id}`,
  })
}

export function getALLRights() {
  return request({
    url: 'roles',
  })
}

export function allotUserRights(id, rid) {
  return request({
    method: 'put',
    url: `users/${id}/role`,
    data: {
      id,
      rid,
    },
  })
}
