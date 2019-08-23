import request from '@/utils/request'

export function fetchModuleList(query) {
  return request({
    url: '/getmodule',
    method: 'get',
    params: query
  })
}

export function createModule(data) {
  return request({
    url: '/createmodule',
    method: 'post',
    data
  })
}

export function updateModule(data) {
  return request({
    url: '/updatemodule',
    method: 'post',
    data
  })
}

export function fetchModuleDetail(query) {
  return request({
    url: '/getmoduledetail',
    method: 'get',
    params: query
  })
}

export function fetchModuleFieldList(query) {
  return request({
    url: '/modulefieldlist',
    method: 'get',
    params: query
  })
}

export function fetchModuleFieldDetail(query) {
  return request({
    url: '/modulefielddetail',
    method: 'get',
    params: query
  })
}

export function createModuleField(data) {
  return request({
    url: '/addmodulefield',
    method: 'post',
    data
  })
}

export function updateModuleField(data) {
  return request({
    url: '/updatemodulefield',
    method: 'post',
    data
  })
}

export function updateFieldSort(data) {
  return request({
    url: '/sortfield',
    method: 'post',
    data
  })
}
