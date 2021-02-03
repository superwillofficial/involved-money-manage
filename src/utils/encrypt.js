import JSEncrypt from 'jsencrypt';

/**
 * rsa加密算法
 *
 * @export
 * @param {*} data
 * @returns
 */
export function rsaEncrypt(data){
  const encrypt = new JSEncrypt();
  const pubkey = `
  -----BEGIN PUBLIC KEY-----
  MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDlOJu6TyygqxfWT7eLtGDwajtN
  FOb9I5XRb6khyfD1Yt3YiCgQWMNW649887VGJiGr/L5i2osbl8C9+WJTeucF+S76
  xFxdU6jE0NQ+Z+zEdhUTooNRaY5nZiu5PgDB0ED/ZKBUSLKL7eibMxZtMlUDHjm4
  gwQco1KRMDSmXSMkDwIDAQAB
  -----END PUBLIC KEY-----`;
  encrypt.setPublicKey(pubkey);
  const encrypted = encrypt.encrypt(data);
  return encrypted;
}
