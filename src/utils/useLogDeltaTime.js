import { useRef } from 'react';

const useLogDeltaTime = () => {
  const timeRef = useRef();

  return () => {
    const currentTime = Date.now();
    const deltaTime = currentTime - timeRef.current;
    timeRef.current = currentTime;
    if (!isNaN(deltaTime)) {
      console.log(deltaTime);
    }
  };
};

export default useLogDeltaTime;
