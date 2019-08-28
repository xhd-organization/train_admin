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

export function deleteCategory(data) {
  return request({
    url: '/deletecategory',
    method: 'post',
    data
  })
}

export function updateCategorySort(data) {
  return request({
    url: '/sortcategory',
    method: 'post',
    data
  })
}
