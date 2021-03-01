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
  if (data.date) {
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
  if (_.isEmpty(data)) return [];
  let arr = [...data];
  return _.map(arr, el => {
    const amountSum = _.reduce(el.incomeList.map(obj => obj.amount), (sum, item) => sum + item, 0);
    return {
      subAcctId: el.subAcctId,
      partyId: el.incomeList[0].partyId,
      partyName: el.incomeList[0].partyName,
      idNo: el.incomeList[0].idNo,
      amount: amountSum,
      outcomeList: _.map([...el.outcomeList], item => {
        return { ...item, subAcctId: el.subAcctId };
      }), // 添加子账号索引，令其在修改时能找到父节点
    };
  });
}

/**
 * 处理案件资金明细的数据
 * for 案件资金管理
 *
 * @export
 * @param {Array} data
 * @return {Array} data 处理过后的对象数组
 */
export function forPaymentConfirm(data) {
  if (_.isEmpty(data)) return [];
  let arr = [...data];
  return _.map(arr, el => {
    const amountSum = _.reduce(el.incomeList.map(obj => obj.amount), (sum, item) => sum + item, 0);
    return {
      subAcctId: el.subAcctId,
      partyId: el.incomeList[0].partyId,
      partyName: el.incomeList[0].partyName,
      idNo: el.incomeList[0].idNo,
      amount: amountSum,
      incomeList: el.incomeList,
    };
  });
}

/**
 * 处理案件处置统计的数据
 *
 * @export
 * @param {Array} data
 * @return {Array} data 处理过后的数组
 */
export function whileStatistics(data) {
  if (_.isEmpty(data)) return [];
  let arr = [...data];
  // 数组扁平化
  const outcomeList = _.flattenDeep(_.map(arr, el => el.outcomeList));
  const partys = ['0', '1'];
  const treasury = ['2'];
  let result = [];
  // 对每一项结果进行处理
  // 合并partyId或accNo相同的项的金额
  _.forEach(outcomeList, (item, index) => {
    if (_.includes(partys, item.type)) {
      const index = _.findIndex(result, el => el.partyId === item.partyId);
      index === -1 ? result.push(item) : result[index].amount += item.amount;
    } else if (_.includes(treasury, item.type)) {
      const index = _.findIndex(result, el => el.acctNo === item.acctNo);
      index === -1 ? result.push(item) : result[index].amount += item.amount;
    }
  });
  console.log('result', result);
  return result;
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