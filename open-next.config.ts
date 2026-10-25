import { defineCloudflareConfig } from '@opennextjs/cloudflare';

// No ISR/revalidation on this site, so no R2 incremental cache is needed.
export default defineCloudflareConfig({});
