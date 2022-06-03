import React from 'react';
import classNames from 'classnames';
import PT from 'prop-types';

function noob() { }

Description.propTypes = {
    className: PT.string,
};

Description.defaultProps = {
    paused: 'paused',
    className: '',
    onClick: noob,
    disabled: false
};

function Description({ className, ...props }) {
    return (
        <span className={classNames('anticon', className)} {...props}>
            <svg width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd" d="M0.779061 0C0.348831 0 6.10352e-05 0.34877 6.10352e-05 0.779V2.03822V3.116V12.464V13.5417V14.801C6.10352e-05 15.2312 0.348831 15.58 0.779061 15.58H2.03828H3.11606H12.4641H13.5418H14.8011C15.2313 15.58 15.5801 15.2312 15.5801 14.801V13.5418V12.464V3.116V2.03822V0.779C15.5801 0.34877 15.2313 0 14.8011 0H13.5418H12.4641H3.11606H2.03828H0.779061ZM3.11606 12.6534C3.22007 12.7281 3.35617 12.76 3.49727 12.7222L5.58373 12.1623L3.50112 10.0797L2.94133 12.1662C2.91293 12.2721 2.92383 12.3752 2.9626 12.464H3.11606V12.6534ZM6.32772 11.2978L12.4914 5.13411C12.7836 4.84178 12.7836 4.36793 12.4914 4.07568L11.4768 3.06113C11.1845 2.7688 10.7106 2.7688 10.4183 3.06113L4.25466 9.22478L6.32772 11.2978Z" fill="#595959" />
            </svg>
        </span>
    );
}

export default Description;
