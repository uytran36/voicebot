import React, { useCallback, useState, useEffect } from 'react';
import PT from 'prop-types';
import difference from 'lodash/difference';
import { connect } from 'umi';
import Table from '@ant-design/pro-table';
import { Button, message } from 'antd';
import { RenderEditRowTable, RenderEditCellTable } from './Edittable';
import styles from './styles.less';
import {
  requestOmniContactListNormalization,
  requestGetOmniContactListBase,
  requestCheckDataDNC,
} from '../../service';
import functions from './functions';
import { filterField } from '@/constants/filter-data-excel';

RenderTable.propTypes = {
  // children: PT.oneOfType([PT.arrayOf(PT.node), PT.node]).isRequired,
  // listTitle: PT.instanceOf(Array).isRequired,
  user: PT.shape({
    authToken: PT.string,
    userId: PT.string,
    tokenGateway: PT.string,
  }).isRequired,
  idContactBase: PT.string.isRequired,
  type: PT.string.isRequired,
  action: PT.string.isRequired,
  setShowDetail: PT.func.isRequired,
  handleRedirectToManagementCampaign: PT.func.isRequired,
};

function RenderTable({
  // listTitle,
  user: { authToken, userId, tokenGateway },
  idContactBase,
  setShowDetail,
  handleRedirectToManagementCampaign,
  type,
  action,
}) {
  // const columns = [];
  const [columns, setColumns] = useState([]);
  const [diff, setDiff] = useState([]);
  const [dataWrongMess, setDataWrongMess] = useState([]);
  const [isSave, setIsSave] = useState(false);
  const [isCheck, setIsCheck] = useState(false);
  const [listTitle, setListTitle] = useState([]);
  const [data, setData] = useState([]);
  const headers = {
    'X-Auth-Token': authToken,
    'X-User-Id': userId,
    Authorization: `Bearer ${tokenGateway}`,
  };

  // ~~ tất cả hàm sự kiện sẽ được khai báo dưới đây ~~

  const handleSaveFormEdit = (row) => {
    const _data = [...data];
    const index = _data.findIndex((item) => row.id === item.id);
    _data[index] = { ..._data[index], ...row };
    setData(_data);
  };

  const handleCheckButtonClick = useCallback(async () => {
    const hide = message.loading('Đang chuẩn hóa');
    const { numWrong, dataChecked } = await functions.handleCheckDataError(data, headers);
    try {
      setData(dataChecked);
      if (numWrong > 0) {
        setDataWrongMess([
          `${numWrong}/${data.length} dữ liệu sô điện thoại chưa chính xác. Vui lòng kiểm tra!`,
        ]);
      } else {
        setDataWrongMess([]);
        setIsSave(true);
      }
      hide();
      message.success('Chuẩn hóa thành công');
    } catch (err) {
      hide();
      message.error(err);
    }
  }, [data]);

  const handleSaveButtonClick = useCallback(async () => {
    // const template = [
    //   'id',
    //   'sdt',
    //   'ho',
    //   'ten',
    //   'ho_va_ten',
    //   'makh',
    //   'alias',
    //   'age',
    //   'gender',
    //   'money',
    //   'money_symbol',
    // ];
    const hide = message.loading('Đang lưu');
    const result = data.map((elm) => {
      const obj = {
        xlsContactListHistory: 'string',
        omniContactListHistory: 'string',
        ...elm,
      };
      // const _diff = difference(Object.keys(elm), template);
      // console.log(_diff)
      // template.forEach((temp) => {
      //   obj[temp] = elm[temp];
      // });
      // if (_diff.length > 0) {
      //   _diff.forEach((key) => {
      //     if(key !== 'checked') {
      //       obj.xlsContactObject = {
      //         ...obj.object,
      //         [key]: elm[key],
      //       };
      //     }
      //   });
      // }
      return obj;
    });
    try {
      const res = await functions.handleRequestUpdateNormalizations(headers, result);
      // hàm này có thể đưa về page campaing management
      // hoặc cũng có thể đẩy về bảng dữ liệu đã chuẩn hóa
      if (res && res.status) {
        hide();
        message.success('Lưu thành công');
        return handleRedirectToManagementCampaign();
      }
    } catch (err) {
      hide();
      message.error(err);
      return null;
    }
    // const dataCheckPhoneNumberDNC = data.map((elm) => ({
    //   msisdn: elm?.sdt,
    // }));
    // check sdt co thuoc DNC k
    // return requestCheckDataDNC(headers, dataCheckPhoneNumberDNC).then((res) => {
    //   if (res.length > 0) {
    //     const phoneNotCall = res.map((phone) => phone.msisdn);
    //     return message.warning(`Phone number is exists in DNC: ${phoneNotCall.toString()}`);
    //   }
    //   functions.handleRequestUpdateNormalizations(headers, result);
    //   // hàm này có thể đưa về page campaing management
    //   // hoặc cũng có thể đẩy về bảng dữ liệu đã chuẩn hóa
    //   return handleRedirectToManagementCampaign();
    // });
  }, [authToken, data, handleRedirectToManagementCampaign, userId]);

  const handleDeleteErrorButtonClick = useCallback(async () => {
    const hide = message.loading('Đang xóa dữ liệu lỗi');
    try {
      const result = await functions.handleDeleteError(data, headers);
      setData(result);
      setDataWrongMess([]);
      setIsSave(true);
      hide();
      message.success('Xóa dữ liệu thành công');
    } catch (err) {
      hide();
      message.error(err.toString());
    }
  }, [data]);

  const handleViewErrorButtonClick = useCallback(async () => {
    const hide = message.loading('Đang kiểm tra dữ liệu lỗi');
    try {
      const { numWrong, sortData, doNotCall } = await functions.handleViewDataError(data, headers);
      setData(sortData);
      if (numWrong > 0) {
        const errMessage = [
          `${numWrong}/${data.length} dữ liệu sô điện thoại chưa chính xác. Vui lòng kiểm tra!`,
        ];
        if (doNotCall && doNotCall.length > 0) {
          errMessage.push(
            `Số điện thoại ${doNotCall
              .map((elm) => elm.sdt)
              .join(' ')} nằm trong danh sách "DoNotCall". Vui lòng kiểm tra!`,
          );
        }
        setDataWrongMess(errMessage);
      } else {
        setDataWrongMess([]);
        setIsSave(true);
      }
      hide();
      message.success('Đã kiểm tra xong');
    } catch (err) {
      hide();
      message.error(err.toString());
    }
  }, [data, headers]);

  // ~~ tất ca hàm chạy logic initial sẽ được khai báo dưới đây ~~
  const fetchListData = useCallback(async (_idContactBase) => {
    try {
      const res = await requestGetOmniContactListBase(headers, {
        filter: {
          where: { xlsContactListHistory: _idContactBase },
        },
      });
      if (Array.isArray(res)) {
        const listKey = [];
        Object.keys(res[0]).forEach((key) => {
          if (!filterField.includes(key)) {
            listKey.push([key]);
          }
          return null;
        });
        // Object.keys(res[0]).forEach((elm) => {
        //   if (elm !== 'id' && elm !== '_id' && elm !== 'key' && elm !== 'xlsContactObject') {
        //     listKey.push([elm]);
        //   }
        //   if (elm === 'xlsContactObject') {
        //     Object.keys(res[0].xlsContactObject).forEach((key) => {
        //       if (key !== 'createdAt' && key !== 'updatedAt' && key !== 'id') {
        //         listKey.push(['xlsContactObject', key]);
        //       }
        //     });
        //   }
        // });
        return {
          data: res,
          listKey,
        };
      }
      throw new Error('Fetch list failed');
    } catch (err) {
      message.error(err.toString());
      return {
        data: [],
        listKey: [],
      };
    }
  }, []);

  const fetchListNormalData = useCallback(async (_idContactBase) => {
    try {
      const res = await requestOmniContactListNormalization(headers, {
        filter: {
          where: { xlsContactListHistory: _idContactBase },
        },
      });
      if (Array.isArray(res)) {
        const listKey = [];
        Object.keys(res[0]).forEach((key) => {
          if (!filterField.includes(key)) {
            listKey.push([key]);
          }
          return null;
        });
        // Object.keys(res[0]).forEach((elm) => {
        //   if (elm !== 'id' && elm !== '_id' && elm !== 'key' && elm !== 'xlsContactObject') {
        //     listKey.push([elm]);
        //   }
        //   if (elm === 'xlsContactObject') {
        //     Object.keys(res[0].xlsContactObject).forEach((key) => {
        //       if (key !== 'createdAt' && key !== 'updatedAt' && key !== 'id') {
        //         listKey.push(['xlsContactObject', key]);
        //       }
        //     });
        //   }
        // });
        return {
          data: res,
          listKey,
        };
      }
      throw new Error('Fetch list failed');
    } catch (err) {
      message.error(err.toString());
      return {
        data: [],
        listKey: [],
      };
    }
  }, []);

  useEffect(() => {
    if (!idContactBase && idContactBase.length === 0) {
      setShowDetail(false);
    }
    if (type === 'raw') {
      fetchListData(idContactBase).then(({ data: _data, listKey }) => {
        if (Array.isArray(listKey) && listKey.length > 0) {
          const col = [];
          listKey.forEach((key) => {
            col.push({
              title: key[key.length - 1].toString(),
              // dataIndex: key.toString(),
              dataIndex: key,
              align: 'center',
              // editable: key.toLowerCase() === 'sdt',
              editable: key[key.length - 1].toLowerCase() === 'sdt',
              render: (text, record) => {
                if (typeof text === 'string') {
                  if (record.error && record.error.includes(key[key.length - 1].toString())) {
                    return <div style={{ color: 'red' }}>{text}</div>;
                  }
                  return <div style={{ color: 'black' }}>{text}</div>;
                }
                if (record[key]) {
                  if (record.checked === 1) {
                    return <div style={{ color: 'green' }}>{record[key].toString()}</div>;
                  }
                  if (record.checked === 0) {
                    return <div style={{ color: 'red' }}>{record[key].toString()}</div>;
                  }
                  return <div style={{ color: 'black' }}>{record[key].toString()}</div>;
                }
                return '_';
              },
            });
          });
          _data.pop();
          setColumns(col);
          setData(_data);
          setListTitle(listKey);
        }
      });
    } else {
      fetchListNormalData(idContactBase).then(({ data: _data, listKey }) => {
        if (Array.isArray(listKey) && listKey.length > 0) {
          const col = [];
          listKey.forEach((key) => {
            col.push({
              title: key[key.length - 1].toString(),
              // dataIndex: key.toString(),
              dataIndex: key,
              align: 'center',
              // editable: key.toLowerCase() === 'sdt',
              editable: key[key.length - 1].toLowerCase() === 'sdt',
              render: (text, record) => {
                if (typeof text === 'string') {
                  if (record.error && record.error.includes(key[key.length - 1].toString())) {
                    return <div style={{ color: 'red' }}>{text}</div>;
                  }
                  return <div style={{ color: 'black' }}>{text}</div>;
                }
                if (record[key]) {
                  if (record.checked === 1) {
                    return <div style={{ color: 'green' }}>{record[key].toString()}</div>;
                  }
                  if (record.checked === 0) {
                    return <div style={{ color: 'red' }}>{record[key].toString()}</div>;
                  }
                  return <div style={{ color: 'black' }}>{record[key].toString()}</div>;
                }
                return '_';
              },
            });
          });
          _data.pop();
          setColumns(col);
          setData(_data);
          setListTitle(listKey);
        }
      });
    }
    return () => {
      setColumns([]);
    };
  }, [authToken, fetchListData, fetchListNormalData, idContactBase, setShowDetail, type, userId]);

  return (
    <div>
      <Table
        rowKey={() => Math.random().toString(36).substring(7)}
        dataSource={data}
        rowClassName={(record) => record.error && styles.rowError}
        pagination={false}
        size="small"
        search={false}
        scroll={{ x: true }}
        options={{ setting: true, fullScreen: false, reload: false, density: false }}
        // options={false}
        components={{
          body: {
            row: RenderEditRowTable,
            cell: RenderEditCellTable,
          },
        }}
        columns={columns.map((col) => {
          if (!col.editable) {
            return col;
          }
          return {
            ...col,
            onCell: (record) => ({
              record,
              editable: col.editable && record?.error?.length > 0,
              dataIndex: col.dataIndex.join(''),
              title: col.title,
              handleSave: handleSaveFormEdit,
            }),
          };
        })}
        onColumnsStateChange={(state) => {
          const listColNotShow = [];
          Object.keys(state).forEach((key) => {
            if (state[key].show === undefined) {
              listColNotShow.push(listTitle[key]);
            } else if (state[key].show !== false) {
              listColNotShow.push(listTitle[key]);
            }
          });
          // kiểm tra tồn tại ít nhất 1 cột được chọn
          if (listColNotShow.length === 0) {
            setDataWrongMess(['Hãy chọn ít nhất một cột để chuẩn hoá.']);
            setIsCheck(true);
            return null;
          }
          setDataWrongMess([]);
          setIsCheck(false);
          // lưu lại giá trị cột đã chọn
          setDiff(difference(listTitle, listColNotShow));
          return null;
        }}
        headerTitle={<span className={styles.title}>Bảng dữ liệu chuẩn</span>}
      />
      {action === 'edit' && (
        <div className={styles.footer} style={{ marginTop: 12 }}>
          <div>
            {dataWrongMess.length > 0 &&
              dataWrongMess.map((str) => {
                return <p className={styles.wrongMess}>{str}</p>;
              })}
            <div className={styles.button}>
              <Button
                disabled={isCheck}
                style={{ marginRight: 8 }}
                type="primary"
                onClick={handleCheckButtonClick}
              >
                Chuẩn hoá
              </Button>
              <Button disabled={!isSave} onClick={handleSaveButtonClick}>
                Lưu
              </Button>
            </div>
          </div>
          <div className={styles.tool}>
            <Button style={{ marginRight: 8 }} type="primary" onClick={handleViewErrorButtonClick}>
              Xem dữ liệu lỗi
            </Button>
            <Button onClick={handleDeleteErrorButtonClick}>Xoá dữ liệu lỗi</Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default connect(({ user }) => ({ user }))(RenderTable);
