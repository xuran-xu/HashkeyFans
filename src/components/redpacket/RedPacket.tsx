'use client'

interface RedPacketProps {
  message: string;
  onOpen: () => void;
  isOpened?: boolean;
}

export const RedPacket = ({ message, onOpen, isOpened }: RedPacketProps) => {
  const warmRed = '#FF5B5C';

  return (
    <div 
      className={`relative w-full max-w-sm mx-auto overflow-hidden cursor-pointer transform transition-transform ${isOpened ? 'scale-95 opacity-75' : 'hover:scale-105'}`}
      onClick={onOpen}
      style={{
        borderRadius: '16px',
        background: warmRed,
      }}
    >
      {/* 顶部祝福语 */}
      <div className="w-full py-2 text-center">
        <p className="text-white text-xs tracking-wider">
          新年快乐
        </p>
      </div>

      {/* 主图区域 */}
      <div className="relative">
        <img 
          src="/img/redpacket-sm.jpg"
          alt="Red Packet"
          className="w-full"
        />
        
        {/* 消息 */}
        <div className="absolute top-1/2 left-4 -translate-y-1/2">
          <p className="font-sora text-2xl font-bold text-[#FF3B3B] drop-shadow-[0_2px_2px_rgba(255,255,255,0.7)]">
            {message || "HashKey Chain"}
          </p>
        </div>
      </div>

      {/* 底部祝福语 */}
      <div className="w-full py-2 text-center">
        <p className="text-white text-xs tracking-wider">
          恭喜发财，大吉大利
        </p>
      </div>
    </div>
  );
}; 