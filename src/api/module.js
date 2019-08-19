import request from '@/utils/request'

export function fetchModuleList(query) {
  return request({
    url: '/getmodule',
    method: 'get',
    params: query
  })
}

export function fetchModuleDetail(query) {
  return request({
    url: '/getmoduledetail',
    method: 'get',
    params: query
  })
}

export function fetchModuleField(query) {
  return request({
    url: '/modulefield',
    method: 'get',
    params: query
  })
}

