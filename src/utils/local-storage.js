export const get = key => localStorage.getItem(key);

export const set = (key, value) => localStorage.setItem(key, value);

export const remove = key => localStorage.removeItem(key);
