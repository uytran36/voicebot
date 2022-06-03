import React, { useState, useEffect } from 'react';
import PT from 'prop-types';
import { Row, Col, Form, Select } from 'antd';
import moment from 'moment';
import { FormattedMessage } from 'umi';
import Icon, { SwapRightOutlined } from '@ant-design/icons';
import styles from './styles.less';
import OptionsValue from './OptionsValue';
import OptionsRange from './OptionsRange';

function TimeConfig({ detailCampaign }) {
  const OPTIONS = [
    { label: 'Năm', value: 'year' },
    { label: 'Tháng', value: 'month' },
    { label: 'Ngày trong tháng', value: 'dayInMonth' },
    { label: 'Ngày trong tuần', value: 'dayInWeek' },
    { label: 'Tuần trong năm', value: 'weekInYear' },
    { label: 'Tuần trong tháng', value: 'weekInMonth' },
    { label: 'Giờ', value: 'hour' },
  ];

  const [execution_datetime, setExecution_datetime] = useState([]);

  useEffect(() => {
    if (detailCampaign?.configuration?.execution_datetime !== undefined) {
      setExecution_datetime(detailCampaign?.configuration?.execution_datetime);
    }
  }, [detailCampaign]);

  return (
    <div className={styles['filter-wrapper']}>
      {execution_datetime.map((item, idx) => {
        return (
          <>
            {idx !== 0 && <div>Hoặc</div>}
            <div className={styles['filter-call-time']}>
              <Row>
                <Col span={8}>Điều kiện</Col>
                <Col span={7}>Từ</Col>
                <Col span={1}></Col>
                <Col span={7}>Đến</Col>
                <Col span={1}></Col>
              </Row>
              {Object.keys(item).map((key) => {
                const defaultValue = item[key];

                return (
                  <>
                    <Row className={styles['filter-row']}>
                      <Col span={8}>
                        <Form.Item noStyle>
                          <Select
                            labelInValue
                            defaultValue={key}
                            className={styles['select-filter']}
                            disabled
                          >
                            {OPTIONS.map((item) => (
                              <Option key={item.value} value={item.value}>
                                {item.label}
                              </Option>
                            ))}
                          </Select>
                        </Form.Item>
                      </Col>
                      <Col span={7}>
                        <Form.Item noStyle>
                          <OptionsValue defaultValue={defaultValue[0]} type={key} />
                        </Form.Item>
                      </Col>
                      <Col span={1}>
                        <SwapRightOutlined className={styles['icon-arrow']} />
                      </Col>
                      <Col span={7}>
                        <Form.Item noStyle>
                          <OptionsRange defaultValue={defaultValue[1]} type={key} />
                        </Form.Item>
                      </Col>
                      <Col span={1} className={styles['icon-add-del']}></Col>
                    </Row>
                  </>
                );
              })}
            </div>
          </>
        );
      })}
    </div>
  );
}

export default TimeConfig;
