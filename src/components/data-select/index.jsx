import React, { useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useObserver } from "mobx-react-lite";

import _ from 'lodash';
import { Select } from 'antd';
import useStore from './store';

const { OptGroup, Option } = Select;
const DataSelect = React.forwardRef((props, ref) => {
  const store = useStore();
  // 不存在数据源 进行数据请求
  useEffect(() => {
    if (!props.dataSource) {
      store
        .setValue('params', props.params)
        .getOptions();
    } else {
      store.setValue('options', props.dataSource);
    }
  }, []);
  // 渲染值
  const onRenderValue = useCallback((option) => {
    if (
      props.onRenderValue &&
      typeof props.onRenderValue === 'function'
    ) {
      return props.onRenderValue(option);
    } else {
      return option[props.opValue];
    }
  }, []);
  // 渲染显示文本
  const onRenderText = useCallback((option) => {
    if (
      props.onRenderText &&
      typeof props.onRenderText === 'function'
    ) {
      return props.onRenderText(option);
    } else {
      return option[props.opText];
    }
  }, []);

  const otherProps = _.omit(
    props,
    ['onRenderText', 'onRenderText', 'dataSource', 'opText', 'opValue'],
  );
  return useObserver(() => (
    <Select
      ref={ref}
      {...otherProps}
    >
      {
        store.options.map((option, index) => {
          if (props.isGroup) {
            return (
              <OptGroup
                key={index}
                label={option[props.opText]}
              >
                {
                  _.get(option, props.opValue, []).map((internalOp, idx) => (
                    <Option
                      key={idx}
                      value={onRenderValue(internalOp)}
                    >
                      {onRenderText(internalOp)}
                    </Option>
                  ))
                }
              </OptGroup>
            );
          }
          return (
            <Option
              key={index}
              value={onRenderValue(option)}
            >
              {onRenderText(option)}
            </Option>
          );
        })
      }
    </Select>
  ));
});

DataSelect.propTypes = {
  placeholder: PropTypes.string,        // 下拉框占位符
  onRenderValue: PropTypes.func,        // 自定义渲染value值
  onRenderText: PropTypes.func,         // 自定义渲染显示文本
  dataSource: PropTypes.array,          // 数据源
  params: PropTypes.shape({             // 请求配置
    url: PropTypes.string.isRequired,   // 请求地址
    query: PropTypes.object,            // 请求参数
  }),
  opText: PropTypes.string.isRequired,  // 文本字段
  opValue: PropTypes.string.isRequired, // 值域字段
  isGroup: PropTypes.bool,              // 是否分组
};

export default DataSelect;
