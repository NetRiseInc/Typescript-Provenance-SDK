/**
 * Example: Get security advisory information.
 *
 * Usage:
 *   npx ts-node examples/get-advisory.ts [ADVISORY_ID]
 *
 * Examples:
 *   npx ts-node examples/get-advisory.ts NETR-2026-0001
 *
 * Environment:
 *   Requires .env file or environment variables (see .env.example)
 */

import 'dotenv/config';
import { ProvenanceClient, ProvenanceClientConfigBuilder } from '../src';

const DEFAULT_ADVISORY = 'NETR-2024-0001';

async function main() {
  const advisoryId = process.argv[2] || DEFAULT_ADVISORY;

  console.log(`Looking up advisory: ${advisoryId}`);
  console.log('-'.repeat(60));

  const config = ProvenanceClientConfigBuilder.fromEnv();
  const client = new ProvenanceClient(config);

  const response = await client.getAdvisory(advisoryId);

  if (response) {
    const adv = response;
    console.log(`Name:        ${adv.name}`);
    console.log(`Created:     ${adv.created_at}`);

    if (adv.description) {
      console.log(`\nDescription:\n${adv.description.slice(0, 500)}...`);
    }

    if (adv.urls?.length) {
      console.log('\nReferences:');
      adv.urls.slice(0, 5).forEach((url) => {
        console.log(`  - ${url}`);
      });
    }

    if (adv.packages?.direct?.length) {
      console.log(`\nDirectly Affected Packages: ${adv.packages.direct.length}`);
      adv.packages.direct.slice(0, 5).forEach((purl) => {
        console.log(`  - ${purl}`);
      });
    }

    if (adv.packages?.indirect?.length) {
      console.log(`\nIndirectly Affected Packages: ${adv.packages.indirect.length}`);
      adv.packages.indirect.slice(0, 5).forEach((purl) => {
        console.log(`  - ${purl}`);
      });
    }

    if (adv.repositories?.direct?.length) {
      console.log(`\nAffected Repositories: ${adv.repositories.direct.length}`);
      adv.repositories.direct.slice(0, 5).forEach((repo) => {
        console.log(`  - ${repo}`);
      });
    }
  } else {
    console.log('No data returned');
  }
}

main().catch(console.error);
