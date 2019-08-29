import request from '@/utils/request'

export function fetchContentList(query) {
  return request({
    url: '/getcontentlist',
    method: 'get',
    params: query
  })
}
