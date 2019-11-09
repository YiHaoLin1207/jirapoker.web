import Vue from 'vue';
import numeral from 'numeral';
import { BaseLocaleEntity } from '@/classes/apiModel';

// Format a Datetime to formatted data: : YYYY-MM-DD
Vue.filter('formattedDate', (value: Date | string) => {
  if (value) {
    if (typeof value === 'string') {
      value = new Date(value);
    }
    return Vue.prototype.$moment(value).format('YYYY-MM-DD');
  }
});

// Format a Datetime to formatted data: YYYY/MM/DD
Vue.filter('formattedChineseDate', (value: Date | string) => {
  if (value) {
    if (typeof value === 'string') {
      value = new Date(value);
    }
    return Vue.prototype.$moment(value).format('YYYY-MM-DD');
  }
});

// Format a Datetime to formatted data + time
Vue.filter('formattedDateTime', (value: Date | string, format: string) => {
  if (value) {
    if (typeof value === 'string') {
      value = new Date(value);
    }

    if (!format) {
      return Vue.prototype.$moment(value).format('YYYY-MM-DD\xa0\xa0HH:mm:ss');
    } else  {
      return Vue.prototype.$moment(value).format(format);
    }
  }
});
Vue.filter('formattedDateTimeOnlyDate', (value: Date | string, format: string) => {
  if (value) {
    if (typeof value !== 'string') {
      value = String(value);
    }

    if (!format) {
      return Vue.prototype.$moment(value).format('YYYY-MM-DD');
    } else  {
      return Vue.prototype.$moment(value).format(format);
    }
  }
});
Vue.filter('formattedDateTimeOnlyTime', (value: Date | string, format: string) => {
  if (value) {
    if (typeof value !== 'string') {
      value = String(value);
    }

    if (!format) {
      return Vue.prototype.$moment(value).format('HH:mm:ss');
    } else  {
      return Vue.prototype.$moment(value).format(format);
    }
  }
});
// Replace newline symbol '\n' to html tag '<br />'
Vue.filter('replaceNewLine', (value: string) => {
  if (value) {
    return value.split('\n').join('<br />');
  }
});

// Format a number as 1000 unit and thousand-separatored
Vue.filter('unitK', (value: number | string) => {
  value = Number(value);
  if (value === 0 || value) {
    return (numeral(value).divide(1000).format('0,0') + 'K');
  }
});

// Format a number as thousand-separatored
Vue.filter('thousandComma', (value: number | string) => {
  value = Number(value);
  if (value === 0 || value) {
    return numeral(value).format('0,0');
  }
});

Vue.filter('addPercentage', (value: number | string) => {
  if (value === 0 || value) {
    return String(value) + '%';
  }
});

// Fix a number to show Fixed 2 digits
Vue.filter('fixedNumber', (value: number | string) => {
  if (value === 0 || value) {
    return Number(value).toFixed(2);
  }
});

// Fix a number to show Fixed 2 digits (strictly)


Vue.filter('toFixed2DigNumber', (value: number | string) => {

  if (value === 0 || value) {
    let num = value.toString();
    const pattern = /(-?\d+)(\d{3})/;

    while (pattern.test(num)) {
      num = num.replace(pattern, '$1,$2');
    }

    if (num.indexOf('.') !== -1) {
      const objNum = num.split('.');
      for (let i = 0; i < 2 - objNum[1].length; i++) {
        num += '0';
      }
    } else {
      num += '.00';
    }
    return num;
  }
});

// getLocaleName: Return mapping name on certain language
Vue.filter('toLocaleName',  (value: BaseLocaleEntity, lang: string) => {
  switch (lang.toLowerCase()) {
    case 'zh-tw':
      return value.name as string;
    case 'zh-cn':
      return value.nameCn as string;
    default:
      return value.nameEn as string;
  }
});

// Format a Datetime to formatted data
Vue.filter('formCol', (value: string, isRequired: boolean) => {
  if (value) {
    value += '&nbsp;:';
  }
  value = isRequired === true ?
     `<span style="color:#F75252">*</span>${value}` : `&nbsp;${value}`;

  return value;
});

Vue.filter('i18nSentence', (values: string[], lang: string = 'zh-tw', isUpcaseFirstLetter: boolean | null) => {
  let concated = '';
  if (values && lang) {
    if (Object.keys(values).length > 1 && lang.toLowerCase() === 'en-us') {
      if (values[0] && isUpcaseFirstLetter === true) {
        const v1 = values[0];
        values[0] = v1.substr(0, 1).toUpperCase();
        if (v1.length > 1) {
          values[0] += v1.substr(1, v1.length - 1);
        }
      }
      concated = values.join(' ');

      // If the last part is marks, remove the last blank before it.
      if (concated.substr(concated.length - 1).match(/^[.,:;!?]/)) {
        concated = concated.substring(0, concated.lastIndexOf(' ')) + concated.substring(concated.lastIndexOf(' ')).trim();
      }
    } else {
      concated = values.join('');
    }
  }

  return concated;
});

Vue.filter('flattenNames', ( items: any[] ) => {
  if (items) {
    const names = items.map( (item: any) => item.name ) as any[];
    return names.join(', ');
  }
  return '';
});
