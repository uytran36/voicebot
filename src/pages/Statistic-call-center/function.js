export const mappingGroupChartData = (data) => {
  const result = [];
  data.forEach((group) => {
    result.push({
      xField: group.date.length > 7 ? group.date.slice(0, -5) : group.date,
      yField: group.totalSuccessCall,
      stackField: 'cuộc gọi thành công',
    });
    result.push({
      xField: group.date.length > 7 ? group.date.slice(0, -5) : group.date,
      yField: group.totalFailureCall,
      stackField: 'cuộc gọi thất bại',
    });
  });
  return result;
};
export const mappingLineChartData = (data) => {
  return data.map((group) => {
    return {
      date: group.date.length > 7 ? group.date.slice(0, -5) : group.date,
      value: group.totalTime,
    };
  });
};

export const mappingBarChartData = (data) => {
  const result = [];
  Object.keys(data).forEach((key) => {
    switch (key) {
      case 'totalBusyCall':
        result.push({ type: 'Máy bận', value: data.totalBusyCall });
        break;
      case 'totalRejectedCall':
        result.push({ type: 'KHG từ chối', value: data.totalRejectedCall });
        break;
      case 'totalNoResponseCall':
        result.push({ type: 'Không bắt máy', value: data.totalNoResponseCall });
        break;
      case 'totalNoAnswerCall':
        result.push({ type: 'Dừng cuộc gọi', value: data.totalNoAnswerCall });
        break;
      case 'totalOrtherFailureCall':
        result.push({ type: 'Thất bại khác', value: data.totalOrtherFailureCall });
        break;

      default:
        break;
    }
  });
  return result;
};
import moment from 'moment';

export const isDisable = (startDate, endDate, type) => {
  const start = moment(startDate);
  const end = moment(endDate);
  const diff = end.diff(start, 'days');
  switch (type) {
    case 'HOURS':
      if (diff === 0) return false;
      else return true;
    case 'DAYS':
      if (diff > 31) return true;
      else return false;
    case 'MONTHS':
      if (diff === 0 || diff > 366) return true;
      else return false;
    default:
      if (diff < 365) return true;
      else return false;
  }
};
