const merge = (target, ...sources) => {
  return sources.reduce((t, s) => {
    return mergeDeep(t, s);
  }, target);
};

const mergeDeep = (target, source) => {
  let output = Object.assign({}, target);
  if (isPlainObject(target) && isPlainObject(source)) {
    keys(source).forEach((key) => {
      if (isPlainObject(source[key])) {
        if (!(key in target)) Object.assign(output, { [key]: source[key] });
        else output[key] = mergeDeep(target[key], source[key]);
      } else {
        Object.assign(output, { [key]: source[key] });
      }
    });
  }
  return output;
};

const isPlainObject = (obj) => !(obj instanceof Date) && obj === Object(obj) && !Array.isArray(obj);

const keys = (obj) => {
  return obj === Object(obj) ? Object.keys(obj) : [];
};

export default merge;
