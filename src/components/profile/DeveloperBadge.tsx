import { FC } from 'react';
import { Icon } from '../common/Icon';
import { DeveloperLevel } from '@/hooks/useContractDeployments';

interface DeveloperBadgeProps {
  level: DeveloperLevel;
  deployments: {
    mainnet: number;
    testnet: number;
    total: number;
  };
  isLoading?: boolean;
}

// 每个等级的配置
const levelConfig: Record<DeveloperLevel, {
  icon: string;
  color: string;
  bgColor: string;
  borderColor: string;
  title: string;
}> = {
  'Not a Developer': {
    icon: 'user',
    color: 'text-gray-500',
    bgColor: 'bg-gray-100/50',
    borderColor: 'border-gray-200',
    title: 'User'
  },
  'Beginner': {
    icon: 'code',
    color: 'text-blue-500',
    bgColor: 'bg-blue-100/50',
    borderColor: 'border-blue-200',
    title: 'Beginner Developer'
  },
  'Intermediate': {
    icon: 'code',
    color: 'text-indigo-500',
    bgColor: 'bg-indigo-100/50',
    borderColor: 'border-indigo-200',
    title: 'Intermediate Developer'
  },
  'Advanced': {
    icon: 'code',
    color: 'text-purple-500',
    bgColor: 'bg-purple-100/50',
    borderColor: 'border-purple-200',
    title: 'Advanced Developer'
  },
  'Expert': {
    icon: 'code',
    color: 'text-primary',
    bgColor: 'bg-primary/10',
    borderColor: 'border-primary/30',
    title: 'Expert Developer'
  }
};

export const DeveloperBadge: FC<DeveloperBadgeProps> = ({ 
  level, 
  deployments,
  isLoading = false
}) => {
  const config = levelConfig[level];
  
  // 自定义渐变效果
  const getGradientClass = (level: DeveloperLevel) => {
    switch(level) {
      case 'Expert':
        return 'from-primary via-purple-600 to-indigo-600';
      case 'Advanced':
        return 'from-purple-600 to-indigo-600';
      case 'Intermediate':
        return 'from-indigo-600 to-blue-600';
      case 'Beginner':
        return 'from-blue-600 to-blue-500';
      default:
        return 'from-gray-400 to-gray-500';
    }
  };

  if (isLoading) {
    return (
      <div className="inline-flex items-center rounded-full py-1.5 px-4 bg-base-200/50 animate-pulse">
        <div className="w-20 h-4 bg-base-300 rounded"></div>
      </div>
    );
  }

  // 对于非开发者，显示简单的用户标签
  if (level === 'Not a Developer') {
    return null;
  }

  return (
    <div className={`
      flex items-center py-1.5 px-4 rounded-full 
      ${config.bgColor} border ${config.borderColor} 
      backdrop-blur-sm transition-all group hover:shadow-md
    `}>
      {/* 徽章图标 */}
      <div className={`
        w-6 h-6 rounded-full flex items-center justify-center mr-2
        bg-gradient-to-br ${getGradientClass(level)} text-white
      `}>
        <Icon name="code" className="w-3.5 h-3.5" />
      </div>
      
      {/* 徽章文本 */}
      <div className="flex items-center">
        <span className={`font-medium ${config.color}`}>{config.title}</span>
        
        {/* 部署计数器浮窗 */}
        <div className="relative ml-1 group">
          <div className="cursor-help">
            <Icon name="chevronRight" className="w-4 h-4 text-base-content/40" />
          </div>
          
          {/* 悬停时显示部署详情 */}
          <div className="
            absolute left-1/2 -translate-x-1/2 bottom-full mb-2 
            w-48 p-3 rounded-lg bg-base-300/90 backdrop-blur-md 
            border border-white/10 shadow-xl z-10
            opacity-0 group-hover:opacity-100 pointer-events-none 
            transition-opacity duration-200 text-sm
          ">
            <div className="text-center font-medium mb-2 text-white">Deployment Stats</div>
            <div className="space-y-1.5">
              <div className="flex justify-between">
                <span className="text-base-content/70">Mainnet:</span>
                <span className="font-mono text-white">{deployments.mainnet}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-base-content/70">Testnet:</span>
                <span className="font-mono text-white">{deployments.testnet}</span>
              </div>
              <div className="border-t border-white/10 mt-2 pt-2 flex justify-between">
                <span className="text-base-content/70">Total:</span>
                <span className="font-mono text-white">{deployments.total}</span>
              </div>
            </div>
            {/* 小三角形指示器 */}
            <div className="absolute bottom-[-6px] left-1/2 -translate-x-1/2 transform rotate-45 w-3 h-3 bg-base-300/90 border-r border-b border-white/10"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeveloperBadge; 