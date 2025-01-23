export const getAssetPath = (path: string) => {
  // 如果是完整的 URL（以 http 或 https 开头），直接返回
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  
  // 对于静态资源，直接返回完整路径，不考虑当前的语言路由
  // Next.js 会自动从 public 目录加载
  return path;
}; 