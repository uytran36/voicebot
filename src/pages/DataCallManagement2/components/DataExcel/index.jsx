import React, { useState, useCallback, useEffect, Suspense } from 'react';
import AddExcel from './components/Add-excel';

const DataTable = React.lazy(() => import('./components/DataTable'));

const DataExcel = (props) => {
    const {
        headers,
        history,
        currentUser
    } = props
    const [isAddData, toggleAddData] = useState(false);

    if (isAddData) {
        return <AddExcel headers={headers} onClose={toggleAddData} history={history} />;
    }

    return (
        <React.Fragment>
            <Suspense fallback={<div>loading..</div>}>
                <DataTable
                    toggleAddData={toggleAddData}
                    headers={{ ...headers, "Content-Type": "application/json", }}
                    history={history}
                />
            </Suspense>
        </React.Fragment>
    )
}
export default DataExcel;