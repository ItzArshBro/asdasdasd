import { NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/auth';
import fs from 'fs';
import path from 'path';

export async function POST(req: Request) {
  try {
    const isAuthenticated = await getAdminSession();
    if (!isAuthenticated) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await req.formData();
    const files = formData.getAll('files') as File[];
    const file = formData.get('file') as File;

    const filesToProcess = files.length > 0 ? files : file ? [file] : [];

    if (filesToProcess.length === 0) {
      return NextResponse.json({ success: false, error: 'No files uploaded' }, { status: 400 });
    }

    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const uploadedUrls: string[] = [];

    for (const f of filesToProcess) {
      if (typeof f === 'string') continue;
      const bytes = await f.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Clean safe filename
      const ext = path.extname(f.name) || '.jpg';
      const cleanName = f.name.replace(/[^a-zA-Z0-9]/g, '_').substring(0, 20);
      const filename = `rj_${Date.now()}_${cleanName}${ext}`;
      const filepath = path.join(uploadDir, filename);

      fs.writeFileSync(filepath, buffer);
      uploadedUrls.push(`/uploads/${filename}`);
    }

    return NextResponse.json({
      success: true,
      urls: uploadedUrls,
      url: uploadedUrls[0] || '',
    });
  } catch (error: any) {
    console.error('Image upload failed:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to upload image' },
      { status: 500 }
    );
  }
}
