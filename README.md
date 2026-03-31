# @netrise/provenance-sdk

TypeScript SDK for the NetRise Provenance API. Query package, repository, contributor, and advisory intelligence data.

## Installation

```bash
npm install @netrise/provenance-sdk
```

## Quick Start

```typescript
import { ProvenanceClient, ProvenanceClientConfigBuilder } from '@netrise/provenance-sdk';

// Load configuration from environment variables
const config = ProvenanceClientConfigBuilder.fromEnv();
const client = new ProvenanceClient(config);

// Get package information by PURL
const pkg = await client.getPackage('pkg:npm/lodash@4.17.21');
console.log(pkg);

// Search for packages
const results = await client.searchPackages('pkg:npm/lodash');
console.log(results);

// Get contributor security information
const contributor = await client.getContributorSecurity({ email: 'developer@example.com' });
console.log(contributor);
```

## Configuration

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `PROVENANCE_ENDPOINT` | Yes | API endpoint URL |
| `PROVENANCE_API_TOKEN` | Yes | API token |
| `PROVENANCE_TIMEOUT` | No | Request timeout in ms (default: 30000) |

### Manual Configuration

```typescript
import { ProvenanceClient, ProvenanceClientConfig } from '@netrise/provenance-sdk';

const config: ProvenanceClientConfig = {
  endpoint: 'https://api.provenance.netrise.io/v1/provenance',
  apiToken: 'your-token',
  timeout: 30000,
};

const client = new ProvenanceClient(config);
```

## API Methods

### Package Endpoints

```typescript
// Get package details by PURL
const pkg = await client.getPackage('pkg:npm/lodash@4.17.21', depth);

// Search packages (supports version constraints)
const results = await client.searchPackages('pkg:npm/lodash@>=4.0.0');

// Get packages that depend on a PURL
const dependents = await client.getDependents('pkg:npm/lodash@4.17.21');
```

### Repository Endpoints

```typescript
// Get repository information
const repo = await client.getRepository('https://github.com/lodash/lodash');

// Get repository health metrics
const health = await client.getRepositoryHealth('https://github.com/lodash/lodash');
```

### Contributor Endpoints

```typescript
// Get contributor by email or username
const contributor = await client.getContributor({ email: 'dev@example.com' });
const contributor = await client.getContributor({ username: 'devuser' });

// Get contributor security information
const security = await client.getContributorSecurity({ email: 'dev@example.com' });
```

### Advisory Endpoint

```typescript
// Get advisory details
const advisory = await client.getAdvisory('CVE-2021-44228');
```

## Error Handling

```typescript
import { ProvenanceClient, ProvenanceAPIError } from '@netrise/provenance-sdk';

try {
  const pkg = await client.getPackage('pkg:npm/nonexistent@1.0.0');
} catch (error) {
  if (error instanceof ProvenanceAPIError) {
    console.error(`API Error ${error.statusCode}: ${error.message}`);
    console.error('Details:', error.errorResponse);
  } else {
    throw error;
  }
}
```

## TypeScript Support

This SDK is written in TypeScript and provides full type definitions. All response types are exported:

```typescript
import type {
  PackageResponse,
  PackageSearchResponse,
  PackageDependentResponse,
  RepositoryResponse,
  RepositoryHealthResponse,
  ContributorResponse,
  ContributorSecurityResponse,
  AdvisoryResponse,
  ErrorResponse,
} from '@netrise/provenance-sdk';
```

For advanced use cases, the generated OpenAPI types are also available:

```typescript
import type { paths, components, operations } from '@netrise/provenance-sdk';
```

## Development

```bash
# Install dependencies
npm install

# Generate OpenAPI types
npm run generate

# Build
npm run build

# Clean
npm run clean
```

## License

MIT

