import React from "react";
import Picker, { SKIN_TONE_MEDIUM_DARK } from "emoji-picker-react";

export default ({ getEmoji }) => {
    const onEmojiClick = (event, emojiObject) => {
        getEmoji(emojiObject);
    };

    return <Picker onEmojiClick={onEmojiClick} disableAutoFocus={true} skinTone={SKIN_TONE_MEDIUM_DARK} groupNames={{ smileys_people: "PEOPLE" }} />;
};
