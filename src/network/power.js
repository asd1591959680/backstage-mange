import { request } from './requset.js'

export function getRightsList(type) {
  return request({
    url: `/rights/${type}`,
  })
}

export function getRolesList() {
  return request({
    url: '/roles',
  })
}

export function deleteRoles(roleId, rightId) {
  return request({
    method: 'delete',
    url: `/roles/${roleId}/rights/${rightId}`,
  })
}

export function getAllRoles(type) {
  return request({
    url: `rights/${type}`,
  })
}

export function rightsSubmit(roleId, rids) {
  return request({
    method: 'post',
    url: `roles/${roleId}/rights`,
    data: {
      roleId,
      rids,
    },
  })
}
