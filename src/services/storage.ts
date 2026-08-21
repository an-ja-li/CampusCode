// ============================================================
// CampusCode — Storage Service (Mock Abstraction)
// ============================================================

export interface UploadResult {
  url: string;
  key: string;
  size: number;
  mimeType: string;
}

class StorageService {
  private bucket: string;

  constructor() {
    this.bucket = process.env.S3_BUCKET || 'campuscode-uploads';
  }

  async upload(file: File, path: string): Promise<UploadResult> {
    // TODO: Upload to S3 / Cloudflare R2 / Supabase Storage
    const key = `${path}/${Date.now()}_${file.name}`;
    return {
      url: `/uploads/${key}`,
      key,
      size: file.size,
      mimeType: file.type,
    };
  }

  async uploadBuffer(buffer: Buffer, filename: string, path: string, mimeType: string): Promise<UploadResult> {
    const key = `${path}/${Date.now()}_${filename}`;
    return {
      url: `/uploads/${key}`,
      key,
      size: buffer.length,
      mimeType,
    };
  }

  async delete(key: string): Promise<boolean> {
    // TODO: Delete from storage
    return true;
  }

  async getSignedUrl(key: string, expiresIn = 3600): Promise<string> {
    return `/uploads/${key}?expires=${Date.now() + expiresIn * 1000}`;
  }

  getPublicUrl(key: string): string {
    return `/uploads/${key}`;
  }
}

export const storageService = new StorageService();
