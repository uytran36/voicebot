import React from 'react';
import PT from 'prop-types';
import { FormattedMessage } from 'umi';
import { LeftOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';
import styles from './styles.less';

RenderTitle.propTypes = {
  history: PT.shape({
    push: PT.func
  }).isRequired,
  viewPermission: PT.bool.isRequired,
}

function RenderTitle({ viewPermission, history }) {

  return (
    <div className={styles.searchWrapper}>
      <div className={styles.title} style={{ marginLeft: 0 }}>
        {viewPermission && (
          <Tooltip placement="top" title="Danh sách vai trò">
            {console.log("log history", history)}
            <LeftOutlined
              style={{ marginRight: 15, fontSize: 25, color: '#000' }}
              onClick={() => history.push('../roles')}
            />
          </Tooltip>
        )}
        <span>
          <FormattedMessage
            id="pages.user-management.role.permission"
            defaultMessage="Phân quyền"
          />
        </span>
      </div>

    </div>
  )
}

export default RenderTitle;
