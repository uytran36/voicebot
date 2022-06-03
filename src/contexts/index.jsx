import React from 'react';
import PT from 'prop-types';
import WithNoteProvider from './note.context';
import WithModalProvider from './modal.context';

RootContext.propTypes = {
  children: PT.oneOfType([PT.arrayOf(PT.node), PT.node]).isRequired,
}

export default function RootContext({ children }) {
  return (
    <WithModalProvider>
      <WithNoteProvider>
        {children}
      </WithNoteProvider>
    </WithModalProvider>
  )
}