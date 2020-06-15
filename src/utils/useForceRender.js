import { useCallback, useState } from 'react';

const useForceRender = () => {
  const [, setState] = useState();

  return useCallback(() => {
    setState({});
  }, []);
};

export default useForceRender;
