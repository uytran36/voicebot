export const debounce = (func, delay) => {
  let inDebounce;
  function f(...args) {
    const context = this;
    clearTimeout(inDebounce);
    inDebounce = setTimeout(() => func.apply(context, args), delay);
    return context;
  }

  f.stop = () => clearTimeout(inDebounce);

  return f;
};

/**
 *
 * @param {*} func
 * @param {*} limit
 * @returns
 */
export const throttle = (func, limit) => {
  let inThrottle;
  return function (...args) {
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
};

/**
 *
 * @param {*} param0
 * @returns
 */
export const normalizeDOMRect = ({
  left, top, right, bottom,
}) => ({
  left,
  top,
  right,
  bottom,
});

/**
 *
 * @param {*} array
 * @param {*} item
 * @param {*} ranking
 * @returns
 */
export function getInsertIndex(array, item, ranking) {
  const order = ranking(item);
  let min = 0;
  let max = array.length - 1;

  while (min <= max) {
    const guess = Math.floor((min + max) / 2);
    const guessedOrder = ranking(array[guess]);
    if (guessedOrder < order) {
      min = guess + 1;
    } else if (guessedOrder > array[guess + 1]) {
      return guess;
    } else {
      max = guess - 1;
    }
  }

  return array.length > 0 ? array.length : 0;
}

/**
 *
 * @param {*} array
 * @param {*} item
 * @param {*} predicate
 * @param {*} ranking
 * @returns
 */
export function upsert(array = [], item, predicate, ranking) {
  const index = array.findIndex(predicate);

  if (index > -1) {
    array[index] = item;
    return array;
  }

  array.splice(getInsertIndex(array, item, ranking), 0, item);
  return array;
}

/**
 *
 * @param {*} rid roomId
 * @param {*} token
 */
export const setCookies = (rid, token) => {
  document.cookie = `rid=${rid}; path=/`;
  document.cookie = `cid=${token}; path=/`;
};

export const getCookie = cname => {
  const name = `${cname}=`;
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i += 1) {
    let c = ca[i];
    while (c.charAt(0) === ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
};

export const deleteAllCookies = () => {
  const cookies = document.cookie.split(";");

  for (let i = 0; i < cookies.length; i += 1) {
    const cookie = cookies[i];
    const eqPos = cookie.indexOf("=");
    const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT`;
  }
};

/**
 *
 * @returns Random token
 */
export const createToken = () => Math.random().toString(36).substring(2, 15)
  + Math.random().toString(36).substring(2, 15);

/**
 *
 * @param {*} array
 * @param {*} column
 * @param {*} inverted
 * @returns true or false
 */
export const sortArrayByColumn = (array, column, inverted) => array.sort((a, b) => {
  if (a[column] < b[column] && !inverted) {
    return -1;
  }
  return 1;
});

// export const getAvatarUrl = username => (username ? `${Livechat.client.host}/avatar/${username}` : null);

// export const canRenderMessage = (message = {}) => !msgTypesNotRendered.includes(message.t);
