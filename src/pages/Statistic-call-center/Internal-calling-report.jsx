import React, { useMemo } from 'react';
import moment from 'moment';
import { Typography, Card, Select, Button, Form, Row, Col, Radio } from 'antd';
import { Export } from '@/components/Icons';
import DatePicker from '@/components/CustomDatePicker';
import Statistical from './components/Statistical';
import { LineChart, GroupedChart } from '@/components/Chart';
import styles from './styles.less';
import { requestExportLocalStatistic, requestLocalStatistic } from '@/services/call-center';
import PageLoading from '@/components/PageLoading';
import { mappingGroupChartData, mappingLineChartData } from './function';
import { isDisable } from './function';
import InternalAgent from './Internal-calling-agent';
import InternalAdmin from './Internal-calling-admin';
import SelectDateTime from '@/components/SelectDateTime';
import { checkPermission, CALL_CENTER_MANAGEMENT } from '@/utils/permission';


const dateFormat = 'YYYY-MM-DD';

function InternalCallingReport(props) {
  const { user } = props;
  const { tokenGateway, wsId, currentUser } = user;

  const headers = React.useMemo(() => {
    return {
      Authorization: tokenGateway,
    };
  }, [tokenGateway]);

  const isAdmin = useMemo(() => {
    return checkPermission(currentUser?.permissions, CALL_CENTER_MANAGEMENT.accessAllCallReport);
  }, [currentUser?.permissions]);

  if (isAdmin) return <InternalAdmin {...props} />;
  return <InternalAgent {...props} />;
}

export default InternalCallingReport;
