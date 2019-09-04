/**
 * Created by PanJiaChen on 16/11/18.
 */

/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validUsername(str) {
  const valid_map = ['admin', 'editor']
  return valid_map.indexOf(str.trim()) >= 0
}

/**
 * @param {string} url
 * @returns {Boolean}
 */
export function validURL(url) {
  const reg = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/
  return reg.test(url)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validLowerCase(str) {
  const reg = /^[a-z]+$/
  return reg.test(str)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validUpperCase(str) {
  const reg = /^[A-Z]+$/
  return reg.test(str)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validAlphabets(str) {
  const reg = /^[A-Za-z]+$/
  return reg.test(str)
}

/**
 * @param {string} email
 * @returns {Boolean}
 */
export function validEmail(email) {
  const reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return reg.test(email)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function isString(str) {
  if (typeof str === 'string' || str instanceof String) {
    return true
  }
  return false
}

/**
 * @param {Array} arg
 * @returns {Boolean}
 */
export function isArray(arg) {
  if (typeof Array.isArray === 'undefined') {
    return Object.prototype.toString.call(arg) === '[object Array]'
  }
  return Array.isArray(arg)
}

export const valideRules = {
  email(value) {
    return /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i
  },
  // http://docs.jquery.com/Plugins/Validation/Methods/minlength
  minlength: function(value, param) {
    return value.trim().length >= param
  },

  // http://docs.jquery.com/Plugins/Validation/Methods/maxlength
  maxlength: function(value, param) {
    return value.trim().length <= param
  },

  // http://docs.jquery.com/Plugins/Validation/Methods/rangelength
  rangelength: function(value, param) {
    var length = value.length
    return (length >= param[0] && length <= param[1])
  },

  // http://docs.jquery.com/Plugins/Validation/Methods/min
  min: function(value, param) {
    return value >= param
  },

  // http://docs.jquery.com/Plugins/Validation/Methods/max
  max: function(value, param) {
    return value <= param
  },

  /**
   * 判断是否在某个范围内
   * @date        2019-09-03
   * @author cnvp
   * @anotherdate 2019-09-03T15:14:34+0800
   * @param       {Number}                 value [需要判断的值]
   * @param       {Array}                 param []
   * @returns     {Boolean}                       [是否在范围内]
   */
  range: function(value, param) {
    return (value >= param[0] && value <= param[1])
  },

  // http://docs.jquery.com/Plugins/Validation/Methods/url
  url: function(value) {
    // contributed by Scott Gonzalez: http://projects.scottsplayground.com/iri/
    return /^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(value)
  },

  // http://docs.jquery.com/Plugins/Validation/Methods/date
  date: function(value) {
    return !/Invalid|NaN/.test(new Date(value))
  },

  // http://docs.jquery.com/Plugins/Validation/Methods/dateISO
  dateISO: function(value) {
    return /^\d{4}[\/-]\d{1,2}[\/-]\d{1,2}$/
  },

  // http://docs.jquery.com/Plugins/Validation/Methods/number
  number: function(value) {
    return /^-?(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d+)?$/
  },

  english: function(value) {
    return /^[a-z_A-Z]+$/
  },
  en_num: function(value) {
    return /^\w+$/
  },
  ip4: function(value) {
    return /^\d+\.\d+\.\d+\.\d+$/
  },
  mobile: function(value) {
    return /^[0-9]{11}$/
  },
  zipcode: function(value) {
    return /^\d{6}$/
  },
  qq: function(value) {
    return /^\d{5,}$/
  },
  idcard: function(value) {
    return /^[1-9]([0-9]{14}|[0-9]{17})$/
  },
  chinese: function(value) {
    return /^[\u4e00-\u9fa5]+$/
  },
  cn_username: function(value) {
    return /^([\u4e00-\u9fa5]|[\w])+$/
  },
  tel: function(value) {
    return /^[+]{0,1}(\d){1,4}[ ]{0,1}([-]{0,1}((\d)|[ ]){1,12})+$/
  },

  // http://docs.jquery.com/Plugins/Validation/Methods/digits
  digits: function(value) {
    return /^\d+$/
  },

  // http://docs.jquery.com/Plugins/Validation/Methods/creditcard
  // based on http://en.wikipedia.org/wiki/Luhn
  creditcard: function(value) {
    // accept only digits and dashes
    if (/[^0-9-]+/.test(value)) {
      return false
    }
    var nCheck = 0
    let nDigit = 0
    var bEven = false
    value = value.replace(/\D/g, '')
    for (var n = value.length - 1; n >= 0; n--) {
      var cDigit = value.charAt(n)
      nDigit = parseInt(cDigit, 10)
      if (bEven) {
        if ((nDigit *= 2) > 9) {
          nDigit -= 9
        }
      }
      nCheck += nDigit
      bEven = !bEven
    }

    return (nCheck % 10) === 0
  },

  // http://docs.jquery.com/Plugins/Validation/Methods/accept
  accept: function(value, param) {
    param = typeof param === 'string' ? param.replace(/,/g, '|') : 'png|jpe?g|gif'
    return value.match(new RegExp('.(' + param + ')$', 'i'))
  },

  // http://docs.jquery.com/Plugins/Validation/Methods/equalTo
  equalTo: function(value, param) {
    return value === param
  }
}

export function format(source, params) {
  if (params) {
    params.map((item, index) => {
      source = source.replace(new RegExp('\\{' + index + '\\}', 'g'), item)
    })
  }

  return source
}

export const validateMessages = {
  required: '此项为必填项',
  remote: '数据已存在',
  email: '请输入一个有效的电子邮件地址',
  url: '请输入一个有效的网址',
  date: '请输入一个有效的日期',
  dateISO: '请输入一个有效的(ISO)日期.',
  number: '请输入一个有效的数字',
  digits: '请只输入数字',
  creditcard: '请输入一个有效的信用卡号码',
  equalTo: '请再次输入相同的值.',
  accept: '请输入一个有效的扩展名的价值.',
  maxlength: format('请输入不超过 {0} 个字符.'),
  minlength: format('请输入至少 {0} 个字符.'),
  rangelength: format('请输入介于值 {0} 和 {1} 个字符长.'),
  range: format('请输入介于 {0} 和 {1}的值'),
  max: format('请输入小于或等于 {0}的值'),
  min: format('请输入一个值大于或等于 {0}的值'),
  ip4: '请输入一个正确的IP地址',
  mobile: '请输入一个正确的手机号码',
  zipcode: '请输入一个正确的邮编',
  qq: '请输入一个正确的QQ号码',
  idcard: '请输入一个正确的身份证号',
  chinese: '请输入中文字符',
  cn_username: '请输入中文英文和数字',
  tel: '请输入正确的电话号码',
  english: '只能输入英文字母',
  en_num: '只能输入英文和数字和下划线'
}
