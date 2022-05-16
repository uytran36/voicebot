import React, { useCallback, useEffect, useState, useMemo } from 'react';
import PT from 'prop-types';
import { connect } from 'umi';
import { requestGetCustomer, requestGetGroup } from '@/services/crm';
import CustomerDetail from './components/customer-detail';
import GroupDetail from './components/group-detail';
import { checkPermission, MINI_CRM_MANAGEMENT } from '@/utils/permission';

const signature = {
  customer: 'customer',
  group: 'group',
};

CrmDetail.propTypes = {
  dispatch: PT.func.isRequired,
  history: PT.shape({
    push: PT.func,
  }).isRequired,
  match: PT.shape({
    params: PT.instanceOf(Object),
  }).isRequired,
  crmDetail: PT.shape({
    customerDetail: PT.instanceOf(Object),
    groupsDetail: PT.instanceOf(Object),
  }).isRequired,
  user: PT.shape({
    userId: PT.string,
    authToken: PT.string,
    tokenGateway: PT.string,
    wsId: PT.string
  }).isRequired,
};

function CrmDetail({
  dispatch,
  history,
  match,
  crmDetail: { customerDetail, groupsDetail },
  user,
}) {
  const [{ tab, id }, setParams] = useState(match.params);
  // const { tab, id } = match.params;
  const [permissions, setPermissions] = useState({ manage: false, update: false, onlyView: false });
  useEffect(() => {
    setPermissions({
      manage: checkPermission(
        user?.currentUser?.permissions,
        MINI_CRM_MANAGEMENT.manageInfoCustomer,
      ),
      update: checkPermission(
        user?.currentUser?.permissions,
        MINI_CRM_MANAGEMENT.updateInfoCustomer,
      ),
      onlyView: checkPermission(
        user?.currentUser?.permissions,
        MINI_CRM_MANAGEMENT.onlyViewInfoCustomer,
      ),
    });
  }, [user?.currentUser?.permissions]);
  const headers = useMemo(() => {
    return {
      'X-Auth-Token': user.authToken,
      'X-User-Id': user.userId,
      Authorization: `${user.tokenGateway}`,
    }
  }, [user.authToken, user.tokenGateway, user.userId]);

  const wsId = user.wsId;
  const redirectToList = useCallback(() => {
    history.push('/customer-relationship-management/customer-management');
  }, [history]);

  useEffect(() => {
    const _params = match.params;
    if (_params.tab && _params.id) {
      setParams({tab: _params.tab, id: _params.id})
    } else {
      redirectToList();
    }
  }, [match.params, redirectToList])

  useEffect(() => {
    // console.log(`location`, location, match);
    switch (tab) {
      case signature.customer: {
        if (!id) {
          redirectToList();
          break;
        }
        requestGetCustomer(id, headers)
          .then((res) => {
            dispatch({
              type: 'crmDetail/execution',
              payload: {
                customerDetail: res.data || {},
              },
            });
          })
          .catch((err) => {
            console.error(err);
          });
        break;
      }
      case signature.group: {
        if (!id) {
          redirectToList();
          break;
        }
        requestGetGroup(id, headers)
          .then((res) => {
            dispatch({
              type: 'crmDetail/execution',
              payload: {
                groupsDetail: res.response.data,
              },
            });
          })
          .catch((err) => {
            console.error(err);
          });
        break;
      }
      default: {
        redirectToList();
        break;
      }
    }
    return () => {
      dispatch({
        type: 'crmDetail/execution',
        payload: {
          customerDetail: {},
          groupsDetail: {},
        },
      });
    };
  }, [history, redirectToList, dispatch, tab, id, headers]);


  if (Object.keys(customerDetail).length > 0) {
    return <CustomerDetail wsId={wsId} headers={headers} customer={customerDetail} history={history} permissions={permissions} />;
  }

  if (Object.keys(groupsDetail).length > 0) {
    return <GroupDetail headers={headers} groupId={id} history={history} permissions={permissions} />;
  }
  return <div>Loading</div>;
}

export default connect(({ crmDetail, user }) => ({ crmDetail, user }))(CrmDetail);
