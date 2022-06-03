import PT from 'prop-types';
import { List, Avatar, Button, Skeleton, Checkbox, Divider, Row, Col, Space } from 'antd';
import { useState, useCallback } from 'react';
import { requestSubcribePageFacebook } from '../../../../service';
import _ from 'lodash';

function ModalSubcribePage(props) {
  const { list, accessToken, getListPageSubcribe, clickCancel } = props;
  console.log({ list });
  const [listChecked, setListChecked] = useState([]);
  // const list = [
  //   {
  //     gender: 'male',
  //     name: {
  //       last: '123',
  //       title: '1432',
  //       first: '12313',
  //     },
  //     email: 'jannis.huck@example.com',
  //     nat: 'DE',
  //   },
  //   {
  //     gender: 'male',
  //     name: {
  //       last: '123',
  //       title: '1432',
  //       first: '12313',
  //     },
  //     email: 'jannis.huck@example.com',
  //     nat: 'DE',
  //   },
  // ];

  const checkAll = (e) => {
    if (e.target.checked) {
      return setListChecked(list?.map((item) => item.id));
    }
    return setListChecked([]);
  };

  const checkItem = (e, id) => {
    if (e.target.checked) {
      return setListChecked([...listChecked, id]);
    }
    return setListChecked(listChecked.filter((item) => item !== id));
  };

  const onSubcribePage = useCallback(async () => {
    if (listChecked?.length > 0) {
      // const result = _.reject(list, (item) => _.find(listChecked, { id: item }));
      const result = list.filter((item) => listChecked.includes(item.id));
      const data = result.map((item) => ({
        pageId: item.id,
        accessToken: item.access_token,
        pageName: item.name,
        avatarUrl: item.avatarUrl,
      }));
      console.log({ data });
      console.log({ result });
      const res = await requestSubcribePageFacebook({}, data);
      // console.log({ res });
    }
    getListPageSubcribe();
    clickCancel();
  }, [listChecked, accessToken, getListPageSubcribe, clickCancel]);

  return (
    <>
      <Checkbox onChange={checkAll}>
        <span style={{ paddingLeft: '10px' }}>{`Tất cả các trang(${list?.length})`}</span>
      </Checkbox>
      <Divider />
      <List
        className="demo-loadmore-list"
        // loading={initLoading}
        itemLayout="horizontal"
        dataSource={list}
        renderItem={(item) => (
          <List.Item>
            <Checkbox
              style={{ paddingRight: '10px' }}
              checked={listChecked.includes(item.id)}
              onChange={(e) => checkItem(e, item.id)}
            />
            <List.Item.Meta
              avatar={<Avatar src={item.avatarUrl} shape="square" size={42} />}
              title={<a href="https://ant.design">{item.name}</a>}
              description={item.category}
            />
          </List.Item>
        )}
      />
      <Row
        gutter={[16, 16]}
        type="flex"
        style={{ alignItems: 'center' }}
        justify="center"
        align="middle"
      >
        <Col span={12}>
          <Row type="flex" justify="center" align="middle">
            <Button
              style={{ width: '200px' }}
              onClick={() => {
                clickCancel();
                getListPageSubcribe();
              }}
            >
              Huỷ
            </Button>
          </Row>
        </Col>
        <Col span={12}>
          <Row type="flex" justify="center" align="middle">
            <Button style={{ width: '200px' }} type="primary" onClick={onSubcribePage}>
              Kết nối
            </Button>
          </Row>
        </Col>
      </Row>
    </>
  );
}

export default ModalSubcribePage;
