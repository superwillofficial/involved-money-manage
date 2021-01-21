import React, {
  useState,
  useEffect,
} from 'react';
import { withRouter } from 'react-router-dom';
import { useStore } from '@stores';
import { useObserver } from "mobx-react-lite";

const INIT_PERCENT = 80;
const FINAL_PERCENT = 100;

const useStateHook = (props, store) => useObserver(() => {
  const [percent, setPercent] = useState(INIT_PERCENT);

  // 是否切换页面
  const [isSwitchPage, setIsSwitchPage] = useState(true);

  useEffect(() => {
    setPercent(INIT_PERCENT);
    setIsSwitchPage(true);
  }, [props.match]);

  useEffect(() => {
    // 切换页面中 && 当前请求数为0
    if (isSwitchPage) {
      setPercent(FINAL_PERCENT);
      setIsSwitchPage(false);
    }
  }, [isSwitchPage]);

  return { percent };
});

let LoadingBar = (props) => {
  const store = useStore();
  const state = useStateHook(props, store);
  return (
    <div></div>
  );
};

LoadingBar = withRouter(LoadingBar);

export default LoadingBar;
