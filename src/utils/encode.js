import crypto from 'crypto-browserify';

const algorithm = 'aes-256-ctr';
// const password = 'd6F3Efeq';

export const encrypt = (text, password = 'd6F3Efeq') => {
  const cipher = crypto.createCipher(algorithm, password);
  let crypted = cipher.update(text, 'utf8', 'hex');
  crypted += cipher.final('hex');
  return crypted;
};

export const decrypt = (text, password = 'd6F3Efeq') => {
  if (password) {
    const decipher = crypto.createDecipher(algorithm, password);
    let dec = decipher.update(text, 'hex', 'utf8');
    dec += decipher.final('utf8');
    return dec;
  }
  return ''
};
