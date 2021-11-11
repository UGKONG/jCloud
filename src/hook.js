/* eslint-disable default-case */
// REST API request = {url: String, method: String, data: Object, start: Function, success: Function, error: Function}
export const useRest = ( request ) => {
  if (typeof(request) == 'string') {
    return console.warn('The useRest parameter is an Object!');
  }
  let url = request.url ?? null;
  let method = request.method ?? 'GET';
  let data = request.data ?? null;
  let start = request.start ?? function(){};
  let success = request.success ?? function(){};
  let error = request.error ?? function(){};

  if (!url) console.warn('useRest: {url}이 없습니다.');
  start(data);
  switch (method) {
    case 'GET':
      fetch(url).then(res => {
        if (!res.ok) {
          error();
          return console.warn('Request Error!');
        }
        return res.json();
      }).then(resData => {
        success(resData);
      }).catch(resData => {
        error(resData);
      });
      break;
    case 'POST':
      fetch(url, {
        method: method,
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data),
      }).then(res => {
        if (!res.ok) {
          error();
          return console.warn('Request Error!');
        }
        return res.json();
      }).then(resData => {
        success(resData);
      }).catch(resData => {
        error(resData);
      });
      break;
    case 'PUT':
      fetch(url, {
        method: method,
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data),
      }).then(res => {
        if (!res.ok) {
          error();
          return console.warn('Request Error!');
        }
        return res.json();
      }).then(resData => {
        success(resData);
      }).catch(resData => {
        error(resData);
      });
      break;
    case 'DELETE':
      fetch(url, {
        method: method,
      }).then(res => {
        if (!res.ok) {
          error();
          return console.warn('Request Error!');
        }
        return res.json();
      }).then(resData => {
        success(resData);
      }).catch(resData => {
        error(resData);
      });
      break;
  }
}

// FadeIn 함수 (element:String, duration:Number) : None
export const useFadeIn = (element = null, duration = 500) => {
  if (!element) {
    console.warn('Element is null!!');
    return;
  }
  let el = document.querySelector(element);
  el.style.transition = `${duration / 1000}s`;
  el.style.opacity = 0;
  el.style.display = 'block';
  setTimeout(() => el.style.opacity = 1, 0);
}

// FadeOut 함수 (element:String, duration:Number) : None
export const useFadeOut = (element = null, duration = 500) => {
  if (!element) {
    console.warn('element is null!!');
    return;
  }
  let el = document.querySelector(element);
  el.style.transition = `${duration / 1000}s`;
  el.style.opacity = 0;
  setTimeout(() => el.style.display = 'none', duration);
}

// 연락처 하이픈 추가 함수 (element:Object, to:Object, option:Boolean) : None
export const useHyphen = (element, to = null, option = false) => {
  if (to) {
    if (option) {
      element.value = (element.value.replace(/[^0-9]/g, "").replace(/(^02|^0505|^1[0-9]{3}|^0[0-9]{2})([0-9]+)?([0-9]{4})$/,"$1-$2-$3").replace("--", "-") );
    }
    document.querySelector(to).innerText = (element.value.replace(/[^0-9]/g, "").replace(/(^02|^0505|^1[0-9]{3}|^0[0-9]{2})([0-9]+)?([0-9]{4})$/,"$1-$2-$3").replace("--", "-") );
  } else {
    element.value = (element.value.replace(/[^0-9]/g, "").replace(/(^02|^0505|^1[0-9]{3}|^0[0-9]{2})([0-9]+)?([0-9]{4})$/,"$1-$2-$3").replace("--", "-") );
  }
}

// 날짜 포맷 함수 (dt:Object, format:String) : String
export const useDateFormat = (dt = new Date(), format = '-') => {
  let date = new Date(dt);
  let _year = date.getFullYear();
  let _month = Number(date.getMonth() + 1) < 10 ? '0' + Number(date.getMonth() + 1) : Number(date.getMonth()) + 1;
  let _date = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
  return _year + format + _month + format + _date;
}

// 시간 포맷 함수 (dt:Object, format:String) : String
export const useTimeFormat = (dt = new Date(), format = ':') => {
  let date = new Date(dt);
  let _hours = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
  let _minutes = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
  let _seconds = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
  return _hours + format + _minutes + format + _seconds;
}

// 숫자 포맷 함수 (value:Number|String) : String
export const useNumberFormat = (value = null) => {
  return String(value).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// 나이계산 함수 (y:String|Number) : Number
export const useAge = (y = null) => {
  if (!y) {
    return 0;
  }
  let nowYear = (new Date()).getFullYear();
  let _nowYear = String(nowYear).slice(2, 4);
  let date;
  let birth = String(y);
  if (birth.indexOf('-') > -1) {
    date = new Date(y);
  } else {
    if (birth.length == 8) {
      date = new Date(birth.slice(0, 4) + '-' + birth.slice(4, 6) + '-' + birth.slice(6, 8));
    } else if (birth.length == 6) {
      let _y = birth.slice(0, 2) <= _nowYear ? '20' : '19';
      date = new Date(_y + birth.slice(0, 2) + '-' + birth.slice(2, 4) + '-' + birth.slice(4, 6));
    }
  }
  let result = Number(nowYear) - Number(date.getFullYear()) + 1;
  return result;
}

// 첨부 이미지 미리보기 (input:Object, output:Object, defaultImageURL:String) : None
export const useImgFileView = (input, output, defaultImageURL = '') => {
  let _input = document.querySelector(input);
  if (_input.files && _input.files[0]) {
    let reader = new FileReader();
    reader.onload = (e) => {
      document.querySelector(output).setAttribute('src', e.target.result);
    }
    reader.readAsDataURL(_input.files[0]);
  } else {
    document.querySelector(output).setAttribute('src', defaultImageURL);
  }
}

// 암호화 하는 함수 (str:String|Number) : String
export const usePwEncoding = (str = '') => {
  var str = btoa(unescape(encodeURIComponent(str)));
  return str;
}

// 복호화 하는 함수 (str:String|Number) : String
export const usePwDecoding = (str = '') => {
  var str = decodeURIComponent(escape(atob(str)));
  return str;
}

// 해당 월 (dt: Object) : String[]
export const useMonthSpan = (dt = new Date()) => {
  let TODAY = useDateFormat(dt);
  let date = new Date(dt);
  date.setDate(1);
  let START_DT = useDateFormat(date);
  date.setMonth(date.getMonth() + 1);
  date.setDate(1);
  date.setDate(date.getDate() - 1);
  let END_DT = useDateFormat(date);

  return [START_DT, END_DT, TODAY];
}

// 프레임워크 사용X 컴포넌트 제작 함수 (tag:String, attr:Object, template:String, target:Element)
export const useElement = (tag = 'div', attr = null, template = '', target = null) => {
  let _tag = document.createElement(tag);
  if (attr) {
    let keys = Object.keys(attr);
    keys.forEach(key => _tag.setAttribute(key, attr[key]));
  }
  _tag.innerHTML = template;
  if (target) {
    target.appendChild(_tag);
  } else {
    return _tag;
  }
}

// GET파라미터 스트링변환
export const useQueryString = (dataObject = {}) => {
  let resultStr = '';
  let keys = Object.keys(dataObject);
  keys.forEach((key, idx) => {
    resultStr += idx == 0 ? '?' : '';
    resultStr += key + '=' + dataObject[key];
    resultStr += keys.length - 1 == idx ? '' : '&';
  });
  console.log(resultStr);

  return resultStr;
}
// GET파라미터 객체변환
export const useQueryObject = (dataString = '') => {
  // db_table=dt_Introduce&htmlSeq=15
  let resultObj = {};
  let dataStringArr = [];
  if (String(dataString).indexOf('&') > -1) {
    dataStringArr = String(dataString).split('&');
  } else {
    dataStringArr[0] = dataString;
  }
  dataStringArr.forEach(data => {
    let [key, value] = String(data).split('=');
    resultObj[key] = value;
  });
  return resultObj;
}

// Today: String 반환
export const useToday = (day = new Date()) => {
  let y = day.getFullYear();
  let m = (day.getMonth() + 1) < 10 ? '0' + (day.getMonth() + 1) : (day.getMonth() + 1);
  let d = day.getDate() < 10 ? '0' + day.getDate() : day.getDate();
  return (`${y}-${m}-${d}`);
}

// 배열의 프로퍼티 value중 가장 높은 Object 반환
export const useMaxArr = (arr = [], prop = '') => {
  let temp = arr.sort((a, b) => Number(a[prop]) - Number(b[prop]));
  if (temp.length == 0) return 0;
  let maxObj = temp[temp.length - 1];
  return maxObj;
}

// 배열의 프로퍼티 value 정렬 후 리스트 반환 (arr: 배열, prop: KeyName, sort: 오름/내림차순, type: number/string)
export const useOrderArr = (arr = [], prop = null, sort = 'up', type = 'number') => {
  let tempArr = [...arr];

  if (!prop) {
    switch (type) {
      case 'number':
        return sort == 'up' ? (
          tempArr.sort((a, b) => Number(a) - Number(b))
        ) : (
          tempArr.sort((a, b) => Number(b) - Number(a))
        );
      case 'string':
        return sort == 'up' ? (
          tempArr.sort((a, b) => a < b ? -1 : a > b ? 1 : 0)
        ) : (
          tempArr.sort((a, b) => a > b ? -1 : a < b ? 1 : 0)
        );
    }
  } else {
    switch (type) {
      case 'number':
        return sort == 'up' ? (
          tempArr.sort((a, b) => Number(a[prop]) - Number(b[prop]))
        ) : (
          tempArr.sort((a, b) => Number(b[prop]) - Number(a[prop]))
        );
      case 'string':
        return sort == 'up' ? (
          tempArr.sort((a, b) => a[prop] < b[prop] ? -1 : a[prop] > b[prop] ? 1 : 0)
        ) : (
          tempArr.sort((a, b) => a[prop] > b[prop] ? -1 : a[prop] < b[prop] ? 1 : 0)
        );
    }
  }
}

// 파일 사이즈 반환
export const useFileSize = (size) => {
  let result = 0;
  let ext = '';
  let n = 1024;
  if (size >= n) {
    result = size / n;
    ext = 'KB';
  }
  if (size >= n * n) {
    result = size / n / n;
    ext = 'MB';
  }
  if (size >= n * n * n) {
    result = size / n / n / n;
    ext = 'GB';
  }
  return Number(result).toFixed(2) + ext;
}

// 날짜 Validation (a: Element, b: Element)
export const useDateValidation = (startEl = {}, endEl = {}) => {
  if (startEl.value == '' || endEl.value == '') return null;
  let start = startEl.value;
  let end = endEl.value;
  start = new Date(start);
  end = new Date(end);
  
  start.setHours(0); end.setHours(0);
  start.setMinutes(0); end.setMinutes(0);
  start.setSeconds(0); end.setSeconds(0);
  start.setMilliseconds(0); end.setMilliseconds(0);

  return end - start < 0 ? false : true;
}

// 게시글 등록/수정 Validation (el: Element, callbackFn: Function)
export const useSendValidation = (el = null, errFn = () => {}, param1 = null, param2 = null, param3 = null) => {
  if (!el) return console.error('"el" is null!');
  if (Array.isArray(el)) {
    for(let i of el) {
      let val = typeof(i) != 'object' ? i : i.value;
      if (val == '') {
        errFn(i, param1, param2, param3);
        return false;
      }
    }
    return true;
  }
  let val = typeof(el) != 'object' ? el : el.value;
  if (val != '') return true;
  if (typeof(el) != 'object') return false;
  errFn(el, param1, param2, param3);
  return false;
}

// Element 위치 구하기
export const useOffsetY = (el = {}) => {
  if (!el.tagName) return console.warn('el is undefined!');
  return el.getBoundingClientRect().top;
}