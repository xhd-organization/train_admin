import request from '@/utils/request'

export function updateCategoryPermission(query) {
  return request({
    url: '/updateCategoryPermission',
    method: 'post',
    data: query
  })
}

export function createCategoryPermission(query) {
  return request({
    url: '/createCategoryPermission',
    method: 'post',
    data: query
  })
}

export function deleteCategoryPsermission(data) {
  return request({
    url: '/deleteCategoryPsermission',
    method: 'post',
    data
  })
}
