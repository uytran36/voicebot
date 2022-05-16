import React, { useCallback, useState } from 'react';
import PT from 'prop-types';
import { List, Typography, Button } from 'antd';
import styles from './styles.less';

AddCustomersToGroups.propTypes = {
  dataSource: PT.instanceOf(Array).isRequired,
  onCancel: PT.func.isRequired,
  onSave: PT.func.isRequired,
};

function AddCustomersToGroups({ dataSource, onCancel, onSave }) {
  const [groupsSelected, toggleGroups] = useState([]);

  const handleSelectGroup = useCallback(
    (group) => () => {
      const listGroupFiltered = [];
      const _groupsSelected = [];

      groupsSelected.forEach((groupID) => {
        if (groupID === group.id) {
          _groupsSelected.push(group.id);
        } else {
          listGroupFiltered.push(groupID);
        }
      });

      if (_groupsSelected.length > 0) {
        toggleGroups(listGroupFiltered);
      } else {
        toggleGroups([...listGroupFiltered, group.id]);
      }
    },
    [groupsSelected],
  );

  return (
    <>
      <List
        dataSource={dataSource}
        className={styles['list-group-container']}
        size='small'
        renderItem={(item) => {
          return (
            <List.Item
              style={{cursor: "pointer"}}
              onClick={handleSelectGroup(item)}
              className={`${styles['list-group-item']} ${
                groupsSelected.filter((groupID) => groupID === item.id).length > 0 &&
                styles['list-group-item-active']
              }`}
            >
              <Typography.Text>{item.name}</Typography.Text>
            </List.Item>
          );
        }}
      />
      <div className={styles['group-btn']} style={{ padding: '5px 10px' }}>
        <Button size='small' onClick={onCancel}>Huỷ</Button>
        <Button size='small' type='primary' onClick={() => onSave(groupsSelected)}>Lưu</Button>
      </div>
    </>
  );
}

export default React.memo(AddCustomersToGroups);
