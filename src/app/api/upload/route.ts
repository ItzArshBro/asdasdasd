import { NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    console.log('[API UPLOAD] POST request received (Supabase Mode)');
    const isAuthenticated = await getAdminSession();
    console.log('[API UPLOAD] isAuthenticated:', isAuthenticated);
    
    if (!isAuthenticated) {
      console.warn('[API UPLOAD] Unauthorized upload attempt');
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await req.formData();
    const files = formData.getAll('files') as File[];
    const file = formData.get('file') as File;
    
    const filesToProcess = files.length > 0 ? files : file ? [file] : [];
    console.log('[API UPLOAD] Number of files to process:', filesToProcess.length);

    if (filesToProcess.length === 0) {
      console.warn('[API UPLOAD] No files found in request');
      return NextResponse.json({ success: false, error: 'No files uploaded' }, { status: 400 });
    }

    const uploadedUrls: string[] = [];

    for (const f of filesToProcess) {
      if (typeof f === 'string') {
        console.log('[API UPLOAD] Skipping non-file item:', f);
        continue;
      }
      console.log('[API UPLOAD] Uploading file to Supabase Bucket:', f.name, 'Size:', f.size);
      
      const bytes = await f.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Clean safe filename
      const ext = path.extname(f.name) || '.jpg';
      const cleanName = f.name.replace(/[^a-zA-Z0-9]/g, '_').substring(0, 20);
      const filename = `rj_${Date.now()}_${cleanName}${ext}`;

      // Upload buffer directly to Supabase storage bucket 'jewellery-images'
      const { data, error } = await supabaseAdmin.storage
        .from('jewellery-images')
        .upload(filename, buffer, {
          contentType: f.type || 'image/jpeg',
          upsert: true,
        });

      if (error) {
        console.error('[API UPLOAD] Supabase Storage upload failed:', error);
        throw error;
      }

      // Get public URL of the uploaded image
      const { data: urlData } = supabaseAdmin.storage
        .from('jewellery-images')
        .getPublicUrl(filename);

      if (!urlData || !urlData.publicUrl) {
        throw new Error('Failed to retrieve public URL from Supabase Storage');
      }

      console.log('[API UPLOAD] Successfully uploaded to Supabase. Public URL:', urlData.publicUrl);
      uploadedUrls.push(urlData.publicUrl);
    }

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
