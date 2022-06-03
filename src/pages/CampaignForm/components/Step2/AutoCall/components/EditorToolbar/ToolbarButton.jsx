import { Command } from 'gg-editor';
import React from 'react';
import { Tooltip } from 'antd';
import IconFont from '../../common/IconFont';
import styles from './index.less';
import { UndoOutlined, RedoOutlined } from '@ant-design/icons';

const upperFirst = (str) => str.toLowerCase().replace(/( |^)[a-z]/g, (l) => l.toUpperCase());

const ToolbarButton = (props) => {
  const { command, icon, text, action, param } = props;

  const renderSwitch = () => {
    switch (command) {
      case "undo":
        return (<span>
          <UndoOutlined /> <span>Undo</span>
        </span>)
      case "redo":
        return (
          <span>
            <RedoOutlined style={{ color: '#127ACE' }} /> <span style={{ color: '#127ACE' }}>Redo</span>
          </span>
        )
      case "delete":
        return (
          <span>
            <IconFont type={`icon-delete`} style={{ color: '#FF4D4E' }} />
          </span>
        )
      case "copy":
      case "paste":
        return (
          <span >
            <IconFont type={`icon-${icon || command}`} />
          </span>
        )
      default:
        return (
          <span onClick={() => action(param)}>
            <IconFont type={`icon-${icon || command}`} />
          </span>
        )
    }
  }

  return (
    <Command name={command}>
      <Tooltip
        title={text || upperFirst(command)}
        // placement="bottom"
        overlayClassName={styles.tooltip}
      >
        {renderSwitch(command)}
      </Tooltip>
    </Command>
  );
};

export default ToolbarButton;
