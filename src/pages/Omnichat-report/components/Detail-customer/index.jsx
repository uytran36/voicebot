import React, { useRef, lazy, Suspense } from 'react';
import PT from 'prop-types';
import { Carousel } from 'antd';

const LazyListCOnversation = lazy(() => import('./List-conversation'));
const LazyDetailConversation = lazy(() => import('./Detail-conversation'));

DetailCustomer.propTypes = {
  onClose: PT.func.isRequired,
}

function DetailCustomer({onClose}) {
  const slider = useRef(null);

  return (
    <Carousel ref={slider} dots={false}>
      <Suspense fallback={<div>loading...</div>}>
        <LazyListCOnversation
          onNextContent={() => {
            slider.current?.next();
          }}
          onClose={() => onClose(false)}
        />
      </Suspense>
      <Suspense fallback={<div>loading...</div>}>
        <LazyDetailConversation
          onNextContent={() => {
            slider.current?.prev();
          }}
        />
      </Suspense>
    </Carousel>
  );
}

export default DetailCustomer;
