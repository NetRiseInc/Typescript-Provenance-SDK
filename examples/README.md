# Provenance TypeScript SDK Examples

These examples demonstrate how to use the Provenance TypeScript SDK to query package, contributor, repository, and advisory information.

## Setup

1. Install dependencies:
   ```bash
   npm install
   npm install -D ts-node dotenv
   ```

2. Configure credentials by creating a `.env` file:
   ```bash
   cp ../.env.example .env
   # Edit .env with your credentials
   ```

## Examples

### Get Package Information
Look up package details by PURL (Package URL):
```bash
npx ts-node examples/get-package.ts "pkg:deb/ubuntu/python-django-doc@2:3.2.12-2ubuntu1.25?arch=all&distro=ubuntu-22.04"
```

### Get Contributor Information
Look up contributor by email or GitHub username:
```bash
npx ts-node examples/get-contributor.ts --email example@example.com
npx ts-node examples/get-contributor.ts --username example-user
```

### Get Repository Information
Look up repository details and health metrics:
```bash
npx ts-node examples/get-repository.ts "https://github.com/django/django.git"
```

### Search Packages
Search for packages with version constraints:
```bash
npx ts-node examples/search-packages.ts "pkg:deb/ubuntu/python-django-doc@>=2:3.0.0?arch=all&distro=ubuntu-22.04"
```

### Get Advisory Information
Look up security advisory details:
```bash
npx ts-node examples/get-advisory.ts NETR-2024-0001
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `PROVENANCE_ENDPOINT` | API endpoint URL (required) |
| `PROVENANCE_API_TOKEN` | API token (required) |
