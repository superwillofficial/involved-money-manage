/**
 * 表格工具
 */
import _ from 'lodash';

const isOjbect = (obj) => Object.prototype.toString.call(obj) === '[object Object]';

/**
 * 表格列头
 */
export const onColumn = (title, key, children, options = {}) => {
  if (
    !_.isNil(children) &&
    isOjbect(children)
  ) {
    options = children;
    children = undefined;
  }
  return _.pickBy({
    title,
    key,
    dataIndex: key,
    render: (text) => _.isNil(text) ? '-' : text,
    children,
    ...options,
  }, v => !_.isNil(v));
};
