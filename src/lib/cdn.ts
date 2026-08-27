// Must match R2_PUBLIC_URL in .env — update both if the bucket/domain changes.
export const R2_BASE = 'https://pub-c73b90ae83684de4a5c23aeec6b7b01b.r2.dev';

export function asset(path: string): string {
  return `${R2_BASE}/${path.replace(/^\//, '')}`;
}
