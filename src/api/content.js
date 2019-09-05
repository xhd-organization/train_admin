import request from '@/utils/request'

export function fetchContentList(query) {
  return request({
    url: '/getcontentlist',
    method: 'get',
    params: query
  })
}

export function createContent(data) {
  return request({
    url: '/createcontent',
    method: 'post',
    data
  })
}

export function updateContent(data) {
  return request({
    url: '/updatecontent',
    method: 'post',
    data
  })
}

export function deleteContent(data) {
  return request({
    url: '/deletecontent',
    method: 'post',
    data
  })
}

export function getDataSource(query) {
  return request({
    url: '/datasource',
    method: 'get',
    params: query
  })
}
