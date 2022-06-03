import React from 'react';

export default (initialValues = {}) => {
    const [values, setValues] = React.useState(initialValues);

    const saveValues = React.useCallback((_values) => {
        // có thể thêm logic kiểm tra đầu vào tại đây
        setValues(_values)
    }, []);
    return [values, saveValues]
}