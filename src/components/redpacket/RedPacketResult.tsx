'use client'

interface RedPacketResultProps {
  amount: number;
  total: number;
  message: string;
  participants: Array<{
    address: string;
    amount: number;
  }>;
}

export const RedPacketResult = ({ amount, total, message, participants }: RedPacketResultProps) => {
  return (
    <div className="w-full max-w-md mx-auto p-6 bg-gray-800 rounded-2xl shadow-xl">
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-white">{message}</h3>
        <p className="text-gray-400 mt-2">
          {amount} HSK / {total} packets
        </p>
      </div>

      <div className="space-y-4">
        {participants.map((participant, index) => (
          <div 
            key={participant.address}
            className="flex items-center justify-between p-4 bg-gray-700 rounded-lg"
          >
            <div className="flex items-center space-x-3">
              <span className="text-gray-400">#{index + 1}</span>
              <span className="text-white">{`${participant.address.slice(0, 6)}...${participant.address.slice(-4)}`}</span>
            </div>
            <span className="text-white font-medium">{participant.amount} HSK</span>
          </div>
        ))}
      </div>
    </div>
  );
}; 