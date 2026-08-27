// Lists objects in the R2 bucket, optionally filtered by a prefix or search term.
// Usage: node scripts/list-r2.mjs [search-term]

import { S3Client, ListObjectsV2Command } from '@aws-sdk/client-s3';

const { R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET_NAME } = process.env;

const client = new S3Client({
  region: 'auto',
  endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: { accessKeyId: R2_ACCESS_KEY_ID, secretAccessKey: R2_SECRET_ACCESS_KEY },
});

const search = process.argv[2];
let continuationToken;
const results = [];

do {
  const res = await client.send(new ListObjectsV2Command({
    Bucket: R2_BUCKET_NAME,
    ContinuationToken: continuationToken,
  }));
  for (const obj of res.Contents || []) {
    if (!search || obj.Key.toLowerCase().includes(search.toLowerCase())) {
      results.push(obj);
    }
  }
  continuationToken = res.NextContinuationToken;
} while (continuationToken);

for (const obj of results) {
  console.log(`${obj.Key}\t${(obj.Size / 1024 / 1024).toFixed(2)}MB\t${obj.LastModified}`);
}
console.log(`\n${results.length} object(s) found`);
