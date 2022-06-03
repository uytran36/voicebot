import React from 'react';
import PT from 'prop-types';
import useNoteCall from './useNoteCall';
import { NoteContext, NoteUpdateContext } from '@/contexts/note.context';
import NoteForm, { useHandleFinish as onSaveNote } from './note-form';

WithNoteProvider.propTypes = {
	children: PT.oneOfType([PT.arrayOf(PT.node), PT.node]).isRequired,
}

function WithNoteProvider({ children }) {
	const [values, setValues] = useNoteCall();

	return (
		<NoteUpdateContext.Provider value={setValues}>
			<NoteContext.Provider value={values}>
				{children}
			</NoteContext.Provider>
		</NoteUpdateContext.Provider>
	)
}

export { NoteForm, onSaveNote, useNoteCall }

export default WithNoteProvider;
