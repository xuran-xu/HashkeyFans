import { useState } from 'react';

const gateways = [
  'https://ipfs.io/ipfs/',
  'https://cloudflare-ipfs.com/ipfs/',
  'https://gateway.pinata.cloud/ipfs/',
  'https://4everland.io/ipfs/'
];

interface IpfsImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  ipfsUrl: string;
}

export const IpfsImage: React.FC<IpfsImageProps> = ({ ipfsUrl, alt, className, ...props }) => {
  const [gatewayIndex, setGatewayIndex] = useState(0);
  const [hasError, setHasError] = useState(false);
  
  // 移除 ipfs:// 前缀，获取 CID
  const cid = ipfsUrl.replace('ipfs://', '');
  
  const handleError = () => {
    console.log('Image load error, trying next gateway...');
    if (gatewayIndex < gateways.length - 1) {
      setGatewayIndex(gatewayIndex + 1);
    } else {
      setHasError(true);
    }
  };

  if (hasError) {
    return <div className={`${className} bg-gray-200 flex items-center justify-center`}>
      <span className="text-gray-400">Failed to load</span>
    </div>;
  }

  return (
    <img
      src={`${gateways[gatewayIndex]}${cid}`}
      alt={alt}
      className={className}
      onError={handleError}
      {...props}
    />
  );
}; 