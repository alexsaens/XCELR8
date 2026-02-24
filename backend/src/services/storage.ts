import { Storage } from '@google-cloud/storage';

const PROJECT_ID = process.env.GCP_PROJECT_ID || 'cs-poc-rlwc9pihxctoazqsylrl3ka';
const BUCKET_NAME = `${PROJECT_ID}-xcelr8-uploads`;

const storage = new Storage({ projectId: PROJECT_ID });

/** Initialize the storage bucket */
export async function initStorage(): Promise<void> {
  const bucket = storage.bucket(BUCKET_NAME);
  const [exists] = await bucket.exists();
  if (!exists) {
    await storage.createBucket(BUCKET_NAME, {
      location: 'US',
      storageClass: 'STANDARD',
      uniformBucketLevelAccess: { enabled: true },
    });
    console.log(`Created storage bucket: ${BUCKET_NAME}`);
  }
}

/** Generate a signed upload URL for the client */
export async function generateUploadUrl(
  submissionId: string,
  fileName: string,
  contentType: string
): Promise<{ uploadUrl: string; filePath: string }> {
  const filePath = `submissions/${submissionId}/${fileName}`;
  const file = storage.bucket(BUCKET_NAME).file(filePath);

  const [url] = await file.getSignedUrl({
    version: 'v4',
    action: 'write',
    expires: Date.now() + 15 * 60 * 1000, // 15 minutes
    contentType,
  });

  return { uploadUrl: url, filePath: `gs://${BUCKET_NAME}/${filePath}` };
}

/** Generate a signed download URL */
export async function generateDownloadUrl(filePath: string): Promise<string> {
  const fullPath = filePath.replace(`gs://${BUCKET_NAME}/`, '');
  const file = storage.bucket(BUCKET_NAME).file(fullPath);

  const [url] = await file.getSignedUrl({
    version: 'v4',
    action: 'read',
    expires: Date.now() + 60 * 60 * 1000, // 1 hour
  });

  return url;
}

/** Read file content as text (for AI processing) */
export async function readFileAsText(filePath: string): Promise<string> {
  const fullPath = filePath.replace(`gs://${BUCKET_NAME}/`, '');
  const file = storage.bucket(BUCKET_NAME).file(fullPath);
  const [contents] = await file.download();
  return contents.toString('utf-8');
}
