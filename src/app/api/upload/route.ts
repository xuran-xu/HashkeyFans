import { NextResponse } from 'next/server';
import { S3 } from '@aws-sdk/client-s3';

// 创建 S3 客户端
const s3 = new S3({
  endpoint: "https://endpoint.4everland.co",
  credentials: {
    accessKeyId: process.env['4EVERLAND-Bucket-APIKey']!,
    secretAccessKey: process.env['4EVERLAND-Bucket-APISecret']!
  },
  region: "4EVERLAND",
});

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const address = formData.get('address') as string;
    
    if (!file || !address) {
      return NextResponse.json(
        { error: 'Missing file or address' },
        { status: 400 }
      );
    }

    console.log('Processing file:', file.name, file.type);

    // 转换文件为 buffer
    const buffer = await file.arrayBuffer();

    // 生成唯一的文件路径
    const timestamp = Date.now();
    const key = `avatars/${address}/${timestamp}-${file.name}`;

    // 上传文件
    const uploadParams = {
      Bucket: "hashfans",  // 你的 bucket 名称
      Key: key,
      Body: Buffer.from(buffer),
      ContentType: file.type,
    };

    console.log('Uploading to 4EVERLAND...');
    await s3.putObject(uploadParams);

    // 获取 IPFS CID
    const headParams = {
      Bucket: "hashfans",
      Key: key,
    };

    const headData = await s3.headObject(headParams);
    const ipfsCid = headData.Metadata?.['ipfs-hash'];

    if (!ipfsCid) {
      throw new Error('Failed to get IPFS CID');
    }

    console.log('Upload successful, IPFS CID:', ipfsCid);
    return NextResponse.json({ 
      url: `ipfs://${ipfsCid}`
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Upload failed' },
      { status: 500 }
    );
  }
}