import { useState, useEffect } from 'react';

function useWindowSize() {
  const [windowSize, setWindowSize] = useState({
    width: undefined,
    height: undefined,
    screen: undefined
  });

  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
        screen:
          window.innerWidth > 1600
            ? 'xxl'
            : window.innerWidth >= 1200
            ? 'xl'
            : window.innerWidth >= 992
            ? 'lg'
            : window.innerWidth >= 768
            ? 'md'
            : window.innerWidth >= 576
            ? 'sm'
            : 'xs',
      });
    }

    window.addEventListener('resize', handleResize);

    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowSize;
}

export default useWindowSize;
