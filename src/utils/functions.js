import _ from "lodash";

/**
 * 数据处理
 *
 * @export
 * @param {Object} data
 * @return {Object} data 处理过后的data
 */
export function dataProcess(data) {
  let obj = { ...data };
  if(data.date) {
    obj['start'] = data.date[0].format('YYYY-MM-DD 00:00:00');
    obj['end'] = data.date[1].format('YYYY-MM-DD 23:59:59');
  }
  obj = _.omit(obj, ['date']); 
  return obj;
}
