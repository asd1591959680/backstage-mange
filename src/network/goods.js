import { request } from './requset.js'

export function getCateList(type, pagenum, pagesize) {
  return request({
    url: 'categories',
    params: {
      type,
      pagenum,
      pagesize,
    },
  })
}
