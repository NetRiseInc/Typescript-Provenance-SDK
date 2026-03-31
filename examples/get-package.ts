/**
 * Example: Get package information by PURL.
 *
 * Usage:
 *   npx ts-node examples/get-package.ts [PURL]
 *
 * Environment:
 *   Requires .env file or environment variables (see .env.example)
 */

import 'dotenv/config';
import { ProvenanceClient, ProvenanceClientConfigBuilder } from '../src';

const DEFAULT_PURL = 'pkg:deb/ubuntu/python-django-doc@2:3.2.12-2ubuntu1.25?arch=all&distro=ubuntu-22.04';

async function main() {
  const purl = process.argv[2] || DEFAULT_PURL;

  console.log(`Looking up package: ${purl}`);
  console.log('-'.repeat(60));

  const config = ProvenanceClientConfigBuilder.fromEnv();
  const client = new ProvenanceClient(config);

  const response = await client.getPackage(purl, 1);

  if (response.data) {
    const pkg = response.data;
    console.log(`Product:      ${pkg.product}`);
    console.log(`Version:      ${pkg.version}`);
    console.log(`Type:         ${pkg.package_type}`);
    console.log(`License:      ${pkg.package_details.license}`);
    console.log(`Summary:      ${pkg.package_details.summary?.slice(0, 60) || 'N/A'}...`);

    if (pkg.repository_details) {
      console.log(`\nRepository:   ${pkg.repository_details.url}`);
      if (pkg.repository_details.contributors?.length) {
        console.log(`Contributors: ${pkg.repository_details.contributors.length}`);
        pkg.repository_details.contributors.slice(0, 5).forEach((c) => {
          console.log(`  - ${c.email}`);
        });
      }
    }

    if (pkg.dependencies?.length) {
      console.log(`\nDependencies: ${pkg.dependencies.length}`);
      pkg.dependencies.slice(0, 5).forEach((dep) => {
        console.log(`  - ${dep.purl}`);
      });
    }

    if (pkg.advisories?.length) {
      console.log(`\nAdvisories: ${pkg.advisories.length}`);
      pkg.advisories.slice(0, 3).forEach((adv) => {
        console.log(`  - ${adv.name} (${adv.relationship})`);
      });
    }
  } else {
    console.log('No data returned');
  }
}

main().catch(console.error);
