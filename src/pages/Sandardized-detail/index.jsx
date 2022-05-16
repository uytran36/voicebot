import React, { useState, useCallback, useEffect } from 'react';
import PT from 'prop-types';
import { connect } from 'umi';
import Table from './components/Table';
import {
  requestOmniContactListNormalizations,
  // requestGetOmniContactListBase,
  requestContactHistories,
} from '@/services/campaign-management';
import { filterField } from '@/constants/filter-data-excel';
import { Typography, Popconfirm } from 'antd';
import { EditOutlined, LeftOutlined } from '@ant-design/icons';
import { Delete } from '@/components/Icons';
import { signature } from '@/pages/DataCallManagement2';

const onGetOmniContactListNormalizations = async (headers, params = {}) => {
  try {
    const res = await requestOmniContactListNormalizations(headers, {
      filter: params,
    });
    if (Array.isArray(res)) {
      return res;
    }
    throw new Error('ERROR~');
  } catch (err) {
    console.error(err);
    return [];
  }
};

SandardizedDetail.propTypes = {
  match: PT.instanceOf(Object).isRequired,
  history: PT.instanceOf(Object).isRequired,
  user: PT.shape({
    userId: PT.string,
    authToken: PT.string,
    tokenGateway: PT.string,
  }).isRequired,
};

function SandardizedDetail({ match, history, user }) {
  const [sessionId, setSessionId] = useState('');
  const [infoLization, setInfoLization] = useState({});
  const [isEdit, toggleEdit] = useState(false);

  const headers = React.useMemo(
    () => ({
      'X-Auth-Token': user.authToken,
      'X-User-Id': user.userId,
      Authorization: `Bearer ${user.tokenGateway}`,
    }),
    [user.authToken, user.tokenGateway, user.userId],
  );

  const redirectToList = useCallback(() => {
    history.push('/config/data-call-management-2');
  }, [history]);

  useEffect(() => {
    const { tab, id } = match.params;
    switch (tab) {
      case signature?.contactListNormalizations: {
        if (!id || id === 'undefined') {
          redirectToList();
          break;
        }
        setSessionId(id);
        break;
      }
      default: {
        redirectToList();
        break;
      }
    }
  }, [headers, match.params, redirectToList]);

  return (
    <Table
      headers={headers}
      sessionId={sessionId}
      onCancel={redirectToList}
      scroll={{ x: 992 }}
    />
  );
}

export default connect(({ user }) => ({ user }))(SandardizedDetail);
