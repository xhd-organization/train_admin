import request from '@/utils/request'

export function fetchModuleList(query) {
  return request({
    url: '/getmodule',
    method: 'get',
    params: query
  })
}

