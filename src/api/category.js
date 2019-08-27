import request from '@/utils/request'

export function fetchCategoryList(query) {
  return request({
    url: '/getcategorylist',
    method: 'get',
    params: query
  })
}

export function fetchCategoryDetail(query) {
  return request({
    url: '/getcategorydetail',
    method: 'get',
    params: query
  })
}

export function updateCategory(data) {
  return request({
    url: '/updatecategory',
    method: 'post',
    data
  })
}

export function createCategory(data) {
  return request({
    url: '/createcategory',
    method: 'post',
    data
  })
}
