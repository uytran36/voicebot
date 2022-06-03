import React, { useEffect, useCallback } from 'react';
import PT from 'prop-types';
import moment from 'moment';
import { CloseCircleOutlined } from '@ant-design/icons';
import { Result, Typography, Progress, Carousel, Button } from 'antd';
import styles from './styles.less';
import api from '@/api';

RenderResult.propTypes = {
  extra: PT.arrayOf(PT.node),
};

RenderResult.defaultProps = {
  extra: [],
};

function RenderResult({ extra }) {
  return <Result status="success" title="Nhập dữ liêu thành công" extra={extra} />;
}

export function ModalContentMissingField({ children }) {
  return (
    <div className={styles['detail-error-container']}>
      <Typography.Title className={styles['detail-error-header']}>
        Kiểm tra dữ liệu không thành công
      </Typography.Title>
      <Typography.Title className={styles['detail-error-sub-header']} style={{ color: '#FF4D4F' }}>
        Thiếu thông tin bắt buộc #Số điện thoại
      </Typography.Title>
      {children}
    </div>
  );
}

export function ModalContentDuplicateName({ children }) {
  return (
    <div className={styles['detail-error-container']}>
      <Typography.Title className={styles['detail-error-header']}>
        Kiểm tra dữ liệu không thành công
      </Typography.Title>
      <Typography.Title className={styles['detail-error-sub-header']} style={{ color: '#FF4D4F' }}>
        File bị trùng tên
      </Typography.Title>
      {children}
    </div>
  );
}

ModalContentError.propTypes = {
  typeError: PT.arrayOf(['wrong-type', 'phone-dup']).isRequired,
  rowPerTotal: PT.shape({
    total: PT.oneOfType([PT.string, PT.number]),
    error: PT.oneOfType([PT.string, PT.number]),
    duplicate: PT.oneOfType([PT.string, PT.number]),
  }).isRequired,
};

export function ModalContentError({ children, detail }) {
  return (
    <div className={styles['detail-error-container']}>
      <Typography.Title className={styles['detail-error-header']}>
        Nhập dữ liệu không thành công
      </Typography.Title>
      <div className={styles['detail-error-list']}>
        <Typography.Text>File bạn vừa tải lên có thể gặp một số vấn đề sau</Typography.Text>
        {detail.total_error_rows > 0 && (
          <div className={styles['detail-error-item']}>
            <span>
              <Typography.Text>
                Số điện thoại chưa đúng định dạng{' '}
                {`${detail.total_error_rows}/${detail.total_rows}`}
              </Typography.Text>
              <CloseCircleOutlined />
            </span>
            <ul>
              <Typography.Text>
                Nội dung của trường #Số điện thoại phải đúng định dạng sau
              </Typography.Text>
              <li>
                <Typography.Text>10 số nếu là đầu số 0</Typography.Text>
              </li>
              <li>
                <Typography.Text>11 số nếu là đầu số 84</Typography.Text>
              </li>
              <li>
                <Typography.Text>
                  Chỉ cho phép ký tự đầu tiên là các số 0, 8 và đầu +
                </Typography.Text>
              </li>
            </ul>
          </div>
        )}
        {detail.total_duplicated_phone_number > 0 && (
          <div className={styles['detail-error-item']}>
            <span>
              <Typography.Text>
                Số điện thoại bị trùng{' '}
                {`${detail.total_duplicated_phone_number}/${detail.total_rows}`}
              </Typography.Text>
              <CloseCircleOutlined />
            </span>
          </div>
        )}
      </div>
      {children}
    </div>
  );
}

export function ModalContentValidate() {
  return (
    <div className={styles['detail-error-container']}>
      <Typography.Title className={styles['detail-error-header']}>
        Đang kiểm tra dữ liệu
      </Typography.Title>
      <Typography.Title className={styles['detail-error-sub-header']}>
        Quá trình kiểm tra có thể mất vài phút, vui lòng đợi
      </Typography.Title>
    </div>
  );
}

export function ModalContentImport() {
  return (
    <div className={styles['detail-error-container']}>
      <Typography.Title className={styles['detail-error-header']}>
        Đang nhập dữ liệu
      </Typography.Title>
      <Typography.Title className={styles['detail-error-sub-header']}>
        Quá trình nhập có thể mất vài phút, vui lòng đợi
      </Typography.Title>
    </div>
  );
}

export function ModalContentValidateSuccess({ children }) {
  return (
    <div className={styles['detail-error-container']}>
      <Typography.Title className={styles['detail-error-header']}>
        Kiểm tra dữ liệu thành công
      </Typography.Title>
      {children}
    </div>
  );
}

export function ModalContentImporting({ children }) {
  return (
    <div className={styles['detail-error-container']}>
      <Typography.Title className={styles['detail-error-header']}>
        Đang nhập dữ liệu
      </Typography.Title>
      <Typography.Title className={styles['detail-error-sub-header']}>
        Quá trình nhập có thể mất vài phút, vui lòng đợi
      </Typography.Title>
      {children}
    </div>
  );
}

export function ModalContentImportSuccess({ children }) {
  return (
    <div className={styles['detail-error-container']}>
      <Typography.Title className={styles['detail-error-header']}>
        Nhập dữ liệu thành công
      </Typography.Title>
      <Typography.Title className={styles['detail-error-sub-header']}>
        Thời gian tạo: {moment().format('DD/MM/YYYY HH:mm')}
      </Typography.Title>
      {children}
    </div>
  );
}

// const SUBSCRIBED = 'subscribed';
const PROGRESS_BAR_VALIDATE = 'progress-bar-validate';
const PROGRESS_BAR_UPLOAD = 'progress-bar-upload';
export const STATUS = {
  VALIDATING: 'VALIDATING',
  VALIDATE_SUCCESS: 'VALIDATE_SUCCESS',
  VALIDATE_ERROR_TYPE: 'VALIDATE_ERROR_TYPE',
  VALIDATE_ERROR_FORMAT: 'VALIDATE_ERROR_FORMAT',
  IMPORTING: 'IMPORTING',
  IMPORT_SUCCESS: 'IMPORT_SUCCESS',
  VALIDATE_DUPLICATE_NAME: 'VALIDATE_DUPLICATE_NAME',
};

export default function RenderProgress({
  children,
  ws,
  defaultPercent,
  typeStatus,
  exception,
  onCancel,
  detail,
}) {
  const slider = React.useRef(null);

  const [percent, setPercent] = React.useState(defaultPercent);
  const [status, setStatus] = React.useState(typeStatus);
  const [type, setType] = React.useState([]);
  const [linkFile, setLinkFile] = React.useState('');
  const [isException, toggleException] = React.useState(exception);
  const [totalRowError, setTotalRowError] = React.useState({
    total: 0,
    error: 0,
    duplicate: 0,
  });
  const [slideNumber, setSlideNumber] = React.useState(0);
  const [sessionId, setSessionId] = React.useState('');

  const initialWebSocket = React.useCallback((connection) => {
    const socket = connection;
    socket.onopen = () => {
      console.log('WS: websocket connected');
    };
    socket.onclose = () => {
      console.log('WS: connectWs close ');
    };
    socket.onerror = (e) => {
      console.log('WS: connectWs error \n', e);
    };
    socket.onmessage = (e) => {
      console.log('asdgashgdasjdhjas');
      try {
        const dataWs = JSON.parse(e.data);
        // validate
        if (dataWs.success && dataWs.event_name.indexOf(PROGRESS_BAR_VALIDATE) > -1) {
          let countDuplicate = 0;
          let countError = 0;
          if (dataWs.data.total) {
            setPercent(dataWs.data.total);
          }
          if (!dataWs.data?.success && dataWs.data?.duplicate) {
            const typeError = [];
            if (dataWs.data?.duplicate?.length > 0) {
              typeError.push('phone-dup');
              dataWs.data.duplicate.forEach((elm) => {
                countDuplicate += elm.loopInIndex.length;
              });
              countDuplicate += dataWs.data.duplicate.length;
            }
            if (dataWs.data?.error?.length > 0) {
              typeError.push('wrong-type');
              countError = dataWs.data?.error?.length;
            }
            setStatus(STATUS.VALIDATE_ERROR_FORMAT);
            setType(typeError);
            setLinkFile(dataWs.data?.file);
            toggleException('exception');
            setSlideNumber(1);
            setTotalRowError({
              total: dataWs.data?.length,
              duplicate: countDuplicate,
              error: countError,
            });
            return null;
          }
          if (dataWs.data.success) {
            toggleException('');
            setStatus(STATUS.VALIDATE_SUCCESS);
            setSlideNumber(2);
          }
          return null;
        }
        // import...
        if (dataWs.success && dataWs.event_name.indexOf(PROGRESS_BAR_UPLOAD) > -1) {
          setPercent(dataWs.data.total);
          if (dataWs.data.total.toString() !== '100') {
            toggleException('');
            setStatus(STATUS.IMPORTING);
            return null;
          }
          if (dataWs.data.total.toString() === '100') {
            setStatus(STATUS.IMPORT_SUCCESS);
            setSlideNumber(4);

            return null;
          }
          return null;
        }
        console.log(dataWs.event_name);
        // eslint-disable-next-line no-useless-escape
        const _sessionId = dataWs.event_name.match(/(?<=\#).+/g);
        setSessionId(_sessionId);
        return null;
      } catch (err) {
        console.error(err);
        return null;
      }
    };
  }, []);

  React.useEffect(() => {
    if (ws) {
      initialWebSocket(ws);
    }
  }, [initialWebSocket, ws]);

  React.useEffect(() => {
    if (slideNumber === 1) {
      slider.current?.goTo(1);
    }
    if (slideNumber === 2) {
      slider.current?.goTo(2);
    }
    if (slideNumber === 3) {
      slider.current?.goTo(3);
    }
    if (slideNumber === 4) {
      slider.current?.goTo(4);
    }
  }, [slideNumber]);

  const handleDownloadFileExample = useCallback(() => {
    window
      .open(`${api.CM_SERVICE}/template/Template-import-du-lieu-voicebot-campaign.xlsx`)
      .focus();
  }, []);

  useEffect(() => {
    if (status === STATUS.VALIDATING) {
      setSlideNumber(4);
      setPercent(100);
    }
    if (status === STATUS.VALIDATE_ERROR_FORMAT) {
      setSlideNumber(1);
    }
    console.log(status);
  }, [status]);

  return (
    <div>
      <div
        style={{
          margin: '24px 0',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Progress type="circle" percent={percent} status={isException} />
      </div>
      {status === STATUS.VALIDATE_ERROR_TYPE && (
        /** Validated - Missing field phones */
        <ModalContentMissingField>
          <div style={{ justifyContent: 'center' }} className={styles['button-group']}>
            <Button onClick={onCancel}>Huỷ</Button>
            <Button type="primary" onClick={handleDownloadFileExample}>
              Tải file mẫu
            </Button>
          </div>
        </ModalContentMissingField>
      )}
      {status === STATUS.VALIDATE_DUPLICATE_NAME && (
        <ModalContentDuplicateName>
          <div style={{ justifyContent: 'center' }} className={styles['button-group']}>
            <Button onClick={onCancel}>Trở lại</Button>
          </div>
        </ModalContentDuplicateName>
      )}
      {status !== STATUS.VALIDATE_ERROR_TYPE && status !== STATUS.VALIDATE_DUPLICATE_NAME && (
        <>
          <Carousel effect="fade" dots={false} ref={slider}>
            {/** Validating(0) */}
            <ModalContentValidate />

            {/** Validated(1) - Format phones invalid */}
            <ModalContentError detail={detail}>
              {children(STATUS.VALIDATE_ERROR_FORMAT, {
                url: `${api.UMI_API_BASE_URL}${detail?.download_url}`,
                setSlideNumber: (num) => setSlideNumber(num),
                toggleException: () => toggleException(''),
              })}
            </ModalContentError>

            {/** Validated(2) - Validate success */}
            <ModalContentValidateSuccess>
              {children(STATUS.VALIDATE_SUCCESS, {
                setSlideNumber: (_slideNumber) => setSlideNumber(_slideNumber),
              })}
            </ModalContentValidateSuccess>

            {/** Validated(3) - Validate success */}
            <ModalContentImporting>{children(STATUS.IMPORTING)}</ModalContentImporting>

            {/** Validated(4) - Validate success */}
            <ModalContentImportSuccess>
              {children(STATUS.IMPORT_SUCCESS, {
                setSlideNumber: (_) => setSlideNumber(4),
              })}
            </ModalContentImportSuccess>
          </Carousel>
        </>
        /** Default render */
      )}
    </div>
  );
}
