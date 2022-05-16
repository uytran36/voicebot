import React from 'react';
import PT from 'prop-types';
import { FormattedMessage } from 'umi';
import { SettingOutlined } from '@ant-design/icons';
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
        <span>
          <FormattedMessage
            id="pages.user-management.role.list"
            defaultMessage="Danh sách vai trò"
          />
        </span>
      </div>
      {viewPermission && (
        <Tooltip placement="top" title="Phân quyền">
          <SettingOutlined
            style={{ fontSize: 24, color: '#000' }}
            onClick={() => history.push('./roles/permission')}
          />
        </Tooltip>
      )}
    </div>
  )
}

export default RenderTitle;
