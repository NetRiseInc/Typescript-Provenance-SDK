/**
 * Example: Get repository information and health metrics.
 *
 * Usage:
 *   npx ts-node examples/get-repository.ts [REPO_URL]
 *
 * Environment:
 *   Requires .env file or environment variables (see .env.example)
 */

import 'dotenv/config';
import { ProvenanceClient, ProvenanceClientConfigBuilder } from '../src';

const DEFAULT_REPO = 'https://github.com/django/django.git';

async function main() {
  const repoUrl = process.argv[2] || DEFAULT_REPO;

  console.log(`Looking up repository: ${repoUrl}`);
  console.log('-'.repeat(60));

  const config = ProvenanceClientConfigBuilder.fromEnv();
  const client = new ProvenanceClient(config);

  // Get basic repository info
  console.log('\n[Repository Info]');
  const repoResponse = await client.getRepository(repoUrl);

  if (repoResponse.data) {
    const repo = repoResponse.data;
    const details = repo.repository_details;
    console.log(`Description:  ${details.description?.slice(0, 80) || 'N/A'}...`);
    console.log(`Languages:    ${details.languages?.join(', ') || 'N/A'}`);
    console.log(`Stars:        ${details.star_count}`);
    console.log(`Forks:        ${details.fork_count}`);

    if (repo.packages?.length) {
      console.log(`\nPackages: ${repo.packages.length}`);
      repo.packages.slice(0, 5).forEach((pkg) => {
        console.log(`  - ${pkg.purl}`);
      });
    }

    if (details.contributors?.length) {
      console.log(`\nContributors: ${details.contributors.length}`);
      details.contributors.slice(0, 5).forEach((c) => {
        const signed = c.has_signed_commits ? '✓ signed' : '';
        console.log(`  - ${c.email} ${signed}`);
      });
    }
  }

  // Get health metrics
  console.log('\n[Repository Health]');
  const healthResponse = await client.getRepositoryHealth(repoUrl);

  if (healthResponse.data) {
    const health = healthResponse.data;

    if (health.scorecard) {
      console.log(`Scorecard Score: ${health.scorecard.aggregate_score}`);
      if (health.scorecard.checks?.length) {
        console.log('Checks:');
        health.scorecard.checks.slice(0, 5).forEach((check) => {
          console.log(`  - ${check.name}: ${check.score}/10`);
        });
      }
    }

    if (health.security_config) {
      const sec = health.security_config;
      console.log('\nSecurity Config:');
      console.log(`  Dependabot Alerts:  ${sec.dependabot_alerts_enabled}`);
      console.log(`  Security.md:        ${sec.security_md_exists}`);
      console.log(`  CI Workflows:       ${sec.has_ci_workflows}`);
    }

    if (health.activity) {
      const act = health.activity;
      console.log('\nActivity:');
      console.log(`  Last Commit:      ${act.last_commit_date}`);
      console.log(`  Commits (90d):    ${act.commit_frequency.days_90}`);
      console.log(`  Archived:         ${act.is_archived}`);
    }
  } else {
    console.log('No health data returned');
  }
}

main().catch(console.error);
