import React from 'react';
import PT from 'prop-types';
import { Typography } from 'antd';

RenderModalError.propTypes = {
  messages: PT.instanceOf(Array).isRequired,
  actions: PT.arrayOf(PT.node).isRequired,
}

function RenderModalError({ messages, actions }) {
  return (
    <div>
      <div>
        {messages.map((message, index) => (
          <Typography key={index}>{message}</Typography>
        ))}
      </div>
    </div>
  );
}

export default RenderModalError;
