/**
 * Example: Get contributor information.
 *
 * Usage:
 *   npx ts-node examples/get-contributor.ts --email example@example.com
 *   npx ts-node examples/get-contributor.ts --username example-user
 *
 * Environment:
 *   Requires .env file or environment variables (see .env.example)
 */

import 'dotenv/config';
import { ProvenanceClient, ProvenanceClientConfigBuilder } from '../src';

async function main() {
  const args = process.argv.slice(2);
  let email: string | undefined;
  let username: string | undefined;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--email' && args[i + 1]) {
      email = args[++i];
    } else if (args[i] === '--username' && args[i + 1]) {
      username = args[++i];
    }
  }

  if (!email && !username) {
    console.error('Usage: get-contributor.ts --email <email> OR --username <username>');
    process.exit(1);
  }

  const identifier = email || username;
  console.log(`Looking up contributor: ${identifier}`);
  console.log('-'.repeat(60));

  const config = ProvenanceClientConfigBuilder.fromEnv();
  const client = new ProvenanceClient(config);

  const response = await client.getContributor({ email, username });

  if (response.data) {
    const contrib = response.data;

    if (contrib.identity) {
      console.log('Identity:');
      console.log(`  Emails:    ${contrib.identity.emails?.join(', ') || 'N/A'}`);
      console.log(`  Usernames: ${contrib.identity.usernames?.join(', ') || 'N/A'}`);
      console.log(`  Names:     ${contrib.identity.declared_names?.join(', ') || 'N/A'}`);
    }

    if (contrib.summary?.repos_contributed_to?.length) {
      console.log(`\nContributions: ${contrib.summary.repos_contributed_to.length} repositories`);
      contrib.summary.repos_contributed_to.slice(0, 5).forEach((repo) => {
        const signed = repo.has_signed_commits ? '✓ signed' : '';
        console.log(`  - ${repo.url} ${signed}`);
      });
    }

    if (contrib.organizations?.length) {
      console.log(`\nOrganizations: ${contrib.organizations.length}`);
      contrib.organizations.slice(0, 5).forEach((org) => {
        console.log(`  - ${org.name} (${org.repository_url})`);
      });
    }

    if (contrib.advisories?.length) {
      console.log(`\nAdvisories: ${contrib.advisories.length}`);
      contrib.advisories.slice(0, 5).forEach((adv) => {
        console.log(`  - ${adv.name} (${adv.relationship})`);
      });
    }

    if (contrib.locations?.length) {
      console.log(`\nLocations: ${contrib.locations.length}`);
      contrib.locations.slice(0, 3).forEach((loc) => {
        console.log(`  - ${loc.country} (${loc.confidence}% confidence)`);
      });
    }
  } else {
    console.log('No data returned');
  }
}

main().catch(console.error);
