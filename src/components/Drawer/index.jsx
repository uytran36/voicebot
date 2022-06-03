import React, { useCallback } from 'react';
import { Drawer } from 'antd';
import PT from 'prop-types';
import { connect } from 'umi';
// import styles from './styles.less';

DrawerWrapper.propTypes = {
    dispatch: PT.func.isRequired,
    drawer: PT.shape({
        content: PT.oneOfType([PT.arrayOf(PT.node), PT.node]),
        isOpen: PT.bool
    }).isRequired,
};

function DrawerWrapper({ dispatch, drawer, ...rest }) {
    const { content, isOpen, ...custom } = drawer;

    const handleOnClose = useCallback(() => {
        dispatch({
            type: 'drawer/execution',
            payload: {
                isOpen: false,
                content: <div />
            }
        })
    }, [])

    return <Drawer width='400' onClose={handleOnClose} visible={isOpen} {...rest} {...custom} >{content}</Drawer>;
}

export default connect(({ drawer }) => ({ drawer }))(DrawerWrapper);