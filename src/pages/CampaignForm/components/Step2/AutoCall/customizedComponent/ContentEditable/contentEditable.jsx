import React, { useState, useRef } from 'react';
import { MentionsInput, Mention } from 'react-mentions';
import PT from 'prop-types';
import merge from './merge';
import defaultStyle from './defaultStyle';
import defaultMentionStyle from './defaultMentionStyle';

MentionEditor.propTypes = {
  mentions: PT.instanceOf(Array).isRequired,
  defaultValue: PT.string,
  handleTextareaOnChange: PT.func.isRequired,
};

MentionEditor.defaultProps = {
  defaultValue: '',
};

function MentionEditor({ mentions, mentions2, defaultValue, handleTextareaOnChange }) {
  const [value, setValue] = useState(defaultValue);

  const handleChange = (event) => {
    setValue(event.target.value);
    handleTextareaOnChange(event.target.value);
  };

  let style = merge({}, defaultStyle, {
    input: {
      overflow: 'auto',
      height: 100,
    },
    highlighter: {
      boxSizing: 'border-box',
      overflow: 'auto',
      height: 100,
    },
  });

  const displayTrans = (mentionsList, id, display) => {
    return mentionsList.find((item) => item.id == id).display;
  };

  return (
    <>
      <MentionsInput
        value={value}
        onChange={handleChange}
        style={style}
        placeholder={"Mention using '@'"}
        a11ySuggestionsListLabel={'Suggested mentions'}
      >
        <Mention
          markup="{{__display__}}"
          //displayTransform={(id, display) => displayTrans(mentions, id, display)}
          trigger="@"
          data={mentions}
          appendSpaceOnAdd
          style={defaultMentionStyle}
        />
        <Mention
          markup="<<__id__>>"
          displayTransform={(id, display) => displayTrans(mentions2, id, display)}
          trigger="<"
          data={mentions2}
          appendSpaceOnAdd
          style={defaultMentionStyle}
        />
      </MentionsInput>
    </>
  );
}

export default MentionEditor;
