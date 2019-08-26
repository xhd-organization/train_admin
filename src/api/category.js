import request from '@/utils/request'

export function fetchCategoryList(query) {
  return request({
    url: '/getcategorylist',
    method: 'get',
    params: query
  })
}

