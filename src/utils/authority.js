// import { encrypt, decrypt } from '@/utils/encode';
import { reloadAuthorized } from './Authorized'; // use localStorage to store the authority info, which might be sent from server in actual project.
// import crypto from 'crypto';

/**
 * @param {[string]} proAuthority 
 * @returns 
 */
export function getAuthority(proAuthority = []) {
  // const authorityString = proAuthority
    // typeof str === 'undefined' && localStorage ? localStorage.getItem('validate') : str; // authorityString could be admin, "admin", ["admin"]
  const authority = proAuthority;

  // try {
  //   if (authorityString) {
  //     // console.log(localStorage.getItem('accessToken'));
  //     const accessToken = localStorage.getItem('id');
  //     authority = JSON.parse(decrypt(authorityString, accessToken));
  //   }
  // } catch (e) {
  //   console.log(e)
  //   authority = authorityString;
  // }


  // if (typeof authority === 'string') {
  //   console.log('vào', [authority])
  //   return [authority];
  // } // preview.pro.ant.design only do not use in your production.
  // preview.pro.ant.design Special environment variable, please do not use it in your project.

  if (!authority && ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION === 'site') {
    return ['admin'];
  }

  return authority;
}

export function setAuthority(authority, userId) {
  const proAuthority = typeof authority === 'string' ? [authority] : authority;
  // const myCipher = cipher('mySecretSalt');
  // const a = myCipher(JSON.stringify(proAuthority));
  // if (userId) {
  //   localStorage.setItem('id', userId)
  //   const authorityValue = encrypt(JSON.stringify(proAuthority), userId);
  //   // localStorage.setItem('permission-authority', JSON.stringify(proAuthority)); // auto reload
  //   localStorage.setItem('validate', authorityValue);
  // }

  reloadAuthorized(proAuthority);
}
