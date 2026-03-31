/**
 * Example: Search for packages with version constraints.
 *
 * Usage:
 *   npx ts-node examples/search-packages.ts [PURL_PATTERN]
 *
 * Examples:
 *   npx ts-node examples/search-packages.ts "pkg:deb/ubuntu/python-django-doc@>=2:3.0.0?arch=all&distro=ubuntu-22.04"
 *
 * Environment:
 *   Requires .env file or environment variables (see .env.example)
 */

import 'dotenv/config';
import { ProvenanceClient, ProvenanceClientConfigBuilder } from '../src';

const DEFAULT_SEARCH = 'pkg:deb/ubuntu/python-django-doc@>=2:3.0.0?arch=all&distro=ubuntu-22.04';

async function main() {
  const searchPattern = process.argv[2] || DEFAULT_SEARCH;

  console.log(`Searching for packages: ${searchPattern}`);
  console.log('-'.repeat(60));

  const config = ProvenanceClientConfigBuilder.fromEnv();
  const client = new ProvenanceClient(config);

  const response = await client.searchPackages(searchPattern);

  if (response.purls?.length) {
    console.log(`Found ${response.purls.length} matching packages:\n`);
    response.purls.slice(0, 20).forEach((purl) => {
      console.log(`  ${purl}`);
    });

    if (response.purls.length > 20) {
      console.log(`\n  ... and ${response.purls.length - 20} more`);
    }
  } else {
    console.log('No matching packages found');
  }
}

main().catch(console.error);
