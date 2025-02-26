import { NextResponse } from 'next/server';
import { MongoClient, GridFSBucket, ObjectId } from 'mongodb';
import { Readable } from 'stream';

const MONGODB_URI = process.env.MONGODB_URI || '';

let bucket: GridFSBucket;

// Initialize MongoDB connection and GridFS bucket
async function connectToDb() {
  if (!bucket) {
    const client = await MongoClient.connect(MONGODB_URI);
    const db = client.db();
    bucket = new GridFSBucket(db, {
      bucketName: 'uploads'
    });
  }
  return bucket;
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only JPEG, PNG and WebP are allowed.' },
        { status: 400 }
      );
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File size exceeds 5MB limit.' },
        { status: 400 }
      );
    }

    const bucket = await connectToDb();
    const filename = `${Date.now()}-${file.name}`;
    const uploadStream = bucket.openUploadStream(filename);

    // Convert File to Buffer
    const buffer = await file.arrayBuffer();
    const readable = new Readable();
    readable._read = () => {}; // Required but not used
    readable.push(Buffer.from(buffer));
    readable.push(null);

    // Upload to GridFS
    await new Promise((resolve, reject) => {
      readable.pipe(uploadStream)
        .on('error', reject)
        .on('finish', resolve);
    });

    return NextResponse.json({
      success: true,
      fileId: uploadStream.id.toString(),
      filename
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const fileId = searchParams.get('id');

    if (!fileId) {
      return NextResponse.json(
        { error: 'File ID is required' },
        { status: 400 }
      );
    }

    const bucket = await connectToDb();
    const files = await bucket.find({ _id: new ObjectId(fileId) }).toArray();

    if (!files.length) {
      return NextResponse.json(
        { error: 'File not found' },
        { status: 404 }
      );
    }

    const downloadStream = bucket.openDownloadStream(files[0]._id);
    
    // Convert stream to buffer
    const chunks: Buffer[] = [];
    for await (const chunk of downloadStream) {
      chunks.push(Buffer.from(chunk));
    }
    const buffer = Buffer.concat(chunks);

    // Determine content type
    const contentType = files[0].contentType || 'application/octet-stream';

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `inline; filename="${files[0].filename}"`,
      },
    });
  } catch (error) {
    console.error('Download error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve file' },
      { status: 500 }
    );
  }
} 