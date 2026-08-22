import { NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/auth';
import fs from 'fs';
import path from 'path';

export async function POST(req: Request) {
  try {
    console.log('[API UPLOAD] POST request received');
    const isAuthenticated = await getAdminSession();
    console.log('[API UPLOAD] isAuthenticated:', isAuthenticated);
    
    if (!isAuthenticated) {
      console.warn('[API UPLOAD] Unauthorized upload attempt');
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await req.formData();
    console.log('[API UPLOAD] Keys in formData:', Array.from(formData.keys()));
    
    const files = formData.getAll('files') as File[];
    const file = formData.get('file') as File;
    
    const filesToProcess = files.length > 0 ? files : file ? [file] : [];
    console.log('[API UPLOAD] Number of files to process:', filesToProcess.length);

    if (filesToProcess.length === 0) {
      console.warn('[API UPLOAD] No files found in request');
      return NextResponse.json({ success: false, error: 'No files uploaded' }, { status: 400 });
    }

    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    console.log('[API UPLOAD] Target Directory:', uploadDir);
    
    if (!fs.existsSync(uploadDir)) {
      console.log('[API UPLOAD] Creating directory public/uploads');
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const uploadedUrls: string[] = [];

    for (const f of filesToProcess) {
      if (typeof f === 'string') {
        console.log('[API UPLOAD] Skipping non-file item:', f);
        continue;
      }
      console.log('[API UPLOAD] Processing file:', f.name, 'Size:', f.size, 'type:', f.type);
      
      const bytes = await f.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Clean safe filename
      const ext = path.extname(f.name) || '.jpg';
      const cleanName = f.name.replace(/[^a-zA-Z0-9]/g, '_').substring(0, 20);
      const filename = `rj_${Date.now()}_${cleanName}${ext}`;
      const filepath = path.join(uploadDir, filename);

      console.log('[API UPLOAD] Writing file to:', filepath);
      fs.writeFileSync(filepath, buffer);
      uploadedUrls.push(`/uploads/${filename}`);
    }

    console.log('[API UPLOAD] Upload completed successfully. URLs:', uploadedUrls);

    return NextResponse.json({
      success: true,
      urls: uploadedUrls,
      url: uploadedUrls[0] || '',
    });
  } catch (error: any) {
    console.error('[API UPLOAD] Image upload failed error details:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to upload image' },
      { status: 500 }
    );
  }
}
