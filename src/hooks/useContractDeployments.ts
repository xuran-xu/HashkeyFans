import { useState, useEffect } from 'react';

// 开发者等级定义
export type DeveloperLevel = 
  | 'Not a Developer' 
  | 'Beginner' 
  | 'Intermediate' 
  | 'Advanced' 
  | 'Expert';

// 部署记录统计接口
interface DeploymentStats {
  mainnet: number;
  testnet: number;
  total: number;
  level: DeveloperLevel;
  isLoading: boolean;
  error: string | null;
}

/**
 * 根据部署总数确定开发者等级
 */
function getDeveloperLevel(totalDeployments: number): DeveloperLevel {
  if (totalDeployments === 0) return 'Not a Developer';
  if (totalDeployments <= 3) return 'Beginner';
  if (totalDeployments <= 10) return 'Intermediate';
  if (totalDeployments <= 30) return 'Advanced';
  return 'Expert';
}

/**
 * 生成伪随机数，基于地址
 */
function pseudoRandomFromAddress(address?: string): number {
  if (!address) return 0;
  // 简单的哈希计算
  let hash = 0;
  for (let i = 0; i < address.length; i++) {
    hash = ((hash << 5) - hash) + address.charCodeAt(i);
    hash |= 0; // 转换为32位整数
  }
  return Math.abs(hash);
}

/**
 * 用于获取地址的合约部署统计数据的钩子
 * 使用模拟数据代替实际API调用
 */
export function useContractDeployments(address: string | undefined): DeploymentStats {
  const [stats, setStats] = useState<DeploymentStats>({
    mainnet: 0,
    testnet: 0,
    total: 0,
    level: 'Not a Developer',
    isLoading: false,
    error: null
  });

  // 当地址变化时生成模拟统计数据
  useEffect(() => {
    // 如果没有地址，则不需要计算
    if (!address) return;
    
    let isMounted = true;
    
    const generateMockData = async () => {
      // 重置状态并开始加载
      setStats(prev => ({ ...prev, isLoading: true, error: null }));
      
      try {
        // 模拟网络延迟
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // 使用基于地址的伪随机数生成模拟数据
        const seed = pseudoRandomFromAddress(address);
        
        // 根据种子生成部署数量
        const mainnetDeployments = seed % 50; // 最多49个主网部署
        const testnetDeployments = Math.floor(seed / 1000) % 100; // 最多99个测试网部署
        
        // 计算总部署量和开发者等级
        const total = mainnetDeployments + testnetDeployments;
        const level = getDeveloperLevel(total);
        
        // 更新状态
        if (isMounted) {
          setStats({
            mainnet: mainnetDeployments,
            testnet: testnetDeployments,
            total,
            level,
            isLoading: false,
            error: null
          });
        }
      } catch (error) {
        if (isMounted) {
          console.error("Error in useContractDeployments:", error);
          setStats(prev => ({
            ...prev,
            isLoading: false,
            error: 'Failed to generate mock data'
          }));
        }
      }
    };

    generateMockData();
    
    // 清理函数
    return () => {
      isMounted = false;
    };
  }, [address]);

  return stats;
}

export default useContractDeployments; 