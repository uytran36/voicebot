import { createContext } from 'react';
import PT from 'prop-types';
import { useNoteCall } from '@/components/NoteCall';

const NoteContext = createContext(null);
const NoteUpdateContext = createContext(null);


WithNoteProvider.propTypes = {
    children: PT.oneOfType([PT.arrayOf(PT.node), PT.node]).isRequired,
}

export default function WithNoteProvider({ children }) {
    const [values, setValues] = useNoteCall();
    return (
        <NoteUpdateContext.Provider value={setValues}>
            <NoteContext.Provider value={values}>
                {children}
            </NoteContext.Provider>
        </NoteUpdateContext.Provider>
    )
}

export { NoteContext, NoteUpdateContext };
