import CryptoJS from 'crypto-js';

const secretKey = process.env.PRIVATE_KEY;

export function generateInvitationLink(nickname: string, type: string, lang: string): string {
  const data = JSON.stringify({ nickname, type });
  if (!secretKey) {
    throw new Error('PRIVATE_KEY 未在环境变量中设置');
  }
  const encrypted = CryptoJS.AES.encrypt(data, secretKey).toString();
  return `/${lang}/invitation/${encodeURIComponent(encrypted)}`;
}
