import React from 'react';
import classNames from 'classnames';
import PT from 'prop-types';

function noob() { }

Gender.propTypes = {
  className: PT.string,
};

Gender.defaultProps = {
  paused: 'paused',
  className: '',
  onClick: noob,
  disabled: false
};

function Gender({ className, ...props }) {
  return (
    <span className={classNames('anticon', className)} {...props}>
      <svg width="1em" height="1em" viewBox="0 0 17 17" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path fillRule="evenodd" clipRule="evenodd" d="M1.5 0.5C0.947715 0.5 0.5 0.947715 0.5 1.5V15.0833C0.5 15.6356 0.947715 16.0833 1.5 16.0833H15.0833C15.6356 16.0833 16.0833 15.6356 16.0833 15.0833V1.5C16.0833 0.947715 15.6356 0.5 15.0833 0.5H1.5ZM13.2637 3.39043C13.2366 3.38915 11.3829 3.41038 11.3829 3.41038C11.0535 3.41424 10.7884 3.73719 10.7929 4.06787C10.7971 4.39532 11.0641 4.70992 11.3903 4.70992H11.398L11.7431 4.65298L11.1143 5.25675C10.6015 4.90034 9.99519 4.69287 9.35829 4.69287C8.53514 4.69287 7.76121 5.00714 7.17899 5.58904C6.24872 6.51898 6.03899 7.89765 6.54787 9.03153C6.58068 9.04247 6.61382 9.05276 6.64759 9.06209C6.75985 9.09265 6.87565 9.10905 6.99113 9.11291C7.00786 9.11356 7.02491 9.11388 7.04196 9.11388C7.32567 9.11388 7.6023 9.03507 7.84355 8.88582C7.29575 8.14791 7.35558 7.09798 8.02498 6.42827C8.38074 6.07218 8.85456 5.87564 9.35861 5.87564C9.86267 5.87564 10.3362 6.07186 10.6922 6.42827C11.4285 7.16425 11.4285 8.3615 10.6922 9.09683C10.4208 9.36896 10.0804 9.54749 9.70988 9.61665C9.68446 9.6501 9.65841 9.68355 9.63203 9.71604C9.28527 10.1374 8.84233 10.4671 8.34407 10.6775C8.66606 10.7891 9.00767 10.8473 9.35829 10.8473C10.1818 10.8473 10.9557 10.5254 11.5382 9.94314C12.583 8.89804 12.7551 7.28326 11.9837 6.08923L12.6943 5.4163V5.83415C12.6943 6.16418 12.9555 6.43213 13.2855 6.43213C13.6159 6.43213 13.8774 6.16418 13.8774 5.83415V3.98359C13.8777 3.82372 13.8507 3.42678 13.2637 3.39043ZM8.29513 11.2444H7.57942V10.5682C8.99862 10.3122 10.0733 9.07085 10.0733 7.58249C10.0733 7.18009 9.99644 6.79601 9.85297 6.44443C9.69664 6.38557 9.53002 6.35404 9.35792 6.35404C9.08483 6.35404 8.82492 6.43156 8.60072 6.57567C8.78889 6.86614 8.89826 7.21161 8.89826 7.58249C8.89826 8.60669 8.0661 9.43949 7.04191 9.43949C6.01836 9.43949 5.18589 8.60669 5.18589 7.58249C5.18589 6.80309 5.66871 6.13531 6.35033 5.86028C6.48929 5.64251 6.65302 5.43793 6.84023 5.25104C7.09563 4.99596 7.38385 4.7843 7.69619 4.62057C7.48581 4.57425 7.26708 4.54916 7.0432 4.54916C5.37085 4.54916 4.00472 5.91046 4.00472 7.58282C4.00472 9.03804 5.03663 10.2559 6.39697 10.5486V11.2447H5.73015C5.40494 11.2447 5.14117 11.5114 5.14117 11.8359C5.14117 12.1614 5.40494 12.4278 5.73015 12.4278H6.39697V12.8981C6.39697 13.2226 6.66331 13.4861 6.98819 13.4861C7.3134 13.4861 7.57942 13.2226 7.57942 12.8981V12.4278H8.29513C8.62034 12.4278 8.88346 12.1614 8.88346 11.8359C8.88346 11.511 8.62002 11.2444 8.29513 11.2444Z" fill="#595959" />
      </svg>
    </span>
  );
}

export default Gender;