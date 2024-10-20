import dotenv from 'dotenv';
import { generateInvitationLink } from './invitationUtils';

dotenv.config();

const [,, nickname, type, lang] = process.argv;

if (!nickname || !type || !lang) {
  console.error('请提供昵称、类型和语言参数');
  process.exit(1);
}

try {
  const invitationLink = generateInvitationLink(nickname, type, lang);
  console.log('生成的邀请链接：', invitationLink);
} catch (error) {
  console.error('生成邀请链接时出错：', error);
}
