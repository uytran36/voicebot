import React from 'react';
import { history } from 'umi';
import PT from 'prop-types';
import { Empty, Button } from 'antd';

function NoDataPermission(props) {
  return (
    <Empty
      image={<img style={{ width: '100%' }} src="/NoData.svg" alt="" />}
      imageStyle={{ height: 200 }}
      description={
        <div style={{ textAlign: 'center' }}>
          <h3 style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 5 }}>Không có dữ liệu</h3>
          <h4 style={{ fontSize: 14, color: 'rgba(0,0,0,0.45)', marginBottom: 5 }}>
            Bạn chưa có quyền truy cập tính năng này.
          </h4>
          <h4 style={{ fontSize: 14, color: 'rgba(0,0,0,0.45)', marginBottom: 5 }}>
            Vui lòng liên hệ admin để thiết lập quyền.
          </h4>
        </div>
      }
    >
      <Button onClick={() => history.replace('/')} style={{ background: '#127ace', color: '#fff' }}>
        Về trang chủ
      </Button>
    </Empty>
  );
}

export default NoDataPermission;
