import React from 'react';
import PT from 'prop-types';
import { Card } from 'antd';
import styles from './styles.less';
import FormEmail from './form-email';
import ChangePassword from './form-change-password';

ForgotPassword.propTypes = {
  history: PT.shape({
    push: PT.func
  }).isRequired,
}

function ForgotPassword(props) {
  const { history } = props;

  const [submitedEmail, toggleSubmitEmail] = React.useState(false);

  const backToLoginForm = React.useCallback(() => {
    history.push('/user/login')
  }, [history]);

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    }}>
      <Card className={styles.card}>
        {submitedEmail
          ? <ChangePassword cb={backToLoginForm} />
          : <FormEmail toggleSubmitEmail={toggleSubmitEmail} />
        }
      </Card>
    </div>
  )
}

export default ForgotPassword;
