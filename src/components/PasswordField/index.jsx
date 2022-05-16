import React from 'react';
import PT from 'prop-types';
import { Input, Form } from 'antd';
import zxcvbn from 'zxcvbn';
import styles from './styles.less';

PasswordField.propTypes = {
  minStrength: PT.number,
}

PasswordField.defaultProps = {
  minStrength: 1,
}

const SUGGESTIONS = ['rất yếu', 'yếu', 'trung bình', 'mạnh', 'rất mạnh'];

function PasswordField(props) {
  const { minStrength, ...other } = props;

  const [strength, setStrength] = React.useState(-1);

  return (
    <React.Fragment>
      {(strength >= 0) &&
        <div className={styles.strength}>
          <div className={styles['strength-meter']}>
            <div className={styles['strength-meter-fill']} data-strength={strength} />
          </div>
          <span className={styles.suggestion} data-strength={strength}>
            {SUGGESTIONS[strength]}
          </span>
        </div>
      }
      <Form.Item {...other} rules={[
        { required: true, message: 'Mật khẩu không được để trống' },
        () => ({
          validator(_, value) {
            const score = zxcvbn(value).score;
            if (value.length > 0) {
              setStrength(score);
              if (value.length < 8 || value.length > 32) {
                return Promise.reject(new Error('Mật khẩu tối thiểu 8 ký tự, tối đa 32 ký tự'));
              }
              if (score < minStrength) {
                return Promise.reject(new Error('Mật khẩu quá yếu.'));
              }
            }
            setStrength(-1);
            return Promise.resolve();
          },
        })
      ]}>
        <Input.Password />
      </Form.Item>
    </React.Fragment>
  )
}

export default PasswordField;
