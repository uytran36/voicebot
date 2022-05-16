import React from 'react';
import { CURRENT } from './renderAuthorize'; // eslint-disable-next-line import/no-cycle

import PromiseRender from './PromiseRender';

/**
 * General authority checking method
 * Common check permissions method
 * @param { 权限判定 | Permission judgment } authority
 * @param { 你的权限 | Your permission description } currentAuthority
 * @param { 通过的组件 | Passing components } target
 * @param { 未通过的组件 | no pass components } Exception
 */
const checkPermissions = (authority, currentAuthority, target, Exception) => {
  // No decision permission. View all by default
  // Retirement authority, return target;
  if (!authority) {
    return target;
  } // Array processing

  if (Array.isArray(authority)) {
    if (Array.isArray(currentAuthority)) {
      if (currentAuthority.some((item) => authority.includes(item))) {
        return target;
      }
    } else if (authority.includes(currentAuthority)) {
      return target;
    }

    return Exception;
  } // string handle

  if (typeof authority === 'string') {
    if (Array.isArray(currentAuthority)) {
      if (currentAuthority.some((item) => authority === item)) {
        return target;
      }
    } else if (authority === currentAuthority) {
      return target;
    }

    return Exception;
  } // Promise handle

  if (authority instanceof Promise) {
    return <PromiseRender ok={target} error={Exception} promise={authority} />;
  } // Function handle

  if (typeof authority === 'function') {
    const bool = authority(currentAuthority); // After the function is executed, the return value is Promise

    if (bool instanceof Promise) {
      return <PromiseRender ok={target} error={Exception} promise={bool} />;
    }

    if (bool) {
      return target;
    }

    return Exception;
  }

  throw new Error('unsupported parameters');
};

export { checkPermissions };

function check(authority, target, Exception) {
  const a = checkPermissions(authority, CURRENT, target, Exception);
  return a
}

export default check;
