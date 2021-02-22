import _ from "lodash";
import { PARTY } from "@config/consts";

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

/**
 * 处理新增受害人时的数据
 *
 * @export
 * @param {Object} data
 * @return {Array} data 处理过后的对象数组
 */
export function dataProcessingWhenCreatingVictim(data) {
  let obj = { ...data };
  obj['type'] = PARTY.VICTIM;
  return [obj];
}

/**
 * 处理编辑受害人时的数据
 *
 * @export
 * @param {Object} data
 * @return {Object} data 处理过后的对象数组
 */
export function dataProcessingWhenEditingVictim(data) {
  let obj = { ...data };
  obj['type'] = PARTY.VICTIM;
  return obj;
}

/**
 * 处理新增嫌疑人时的数据
 *
 * @export
 * @param {Object} data
 * @return {Array} data 处理过后的对象数组
 */
export function dataProcessingWhenCreatingSuspect(data) {
  let obj = { ...data };
  obj['type'] = PARTY.SUSPECT;
  return [obj];
}

/**
 * 处理案件资金明细的数据
 *
 * @export
 * @param {Array} data
 * @return {Array} data 处理过后的对象数组
 */
export function caseFundDetailProcessing(data) {
  if(_.isEmpty(data)) return [];
  let arr = [...data];
  return _.map(arr, el => {
    const amountSum = _.reduce(el.incomeList.map(obj => obj.amount), (sum, item) => sum + item, 0);
    return {
      subAcct: el.subAcct,
      partyId: el.incomeList[0].partyId,
      partyName: el.incomeList[0].partyName,
      idNo: el.incomeList[0].idNo,
      amount: amountSum,
      outcomeList: [...el.outcomeList],
    };
  });
}

/**
 * 处理资金分配的数据
 *
 * @export
 * @param {Object} data
 * @return {Array} data 处理过后的对象数组
 */
export function fundDistPrc(data) {
  let obj = { ...data };
  return _.omit(obj, [
    'acctNo',
    'acctName',
    'bankName',
    'bankCode',
  ]);
}