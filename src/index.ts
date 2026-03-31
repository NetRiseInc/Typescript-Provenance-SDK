// Re-export everything from the client
export {
  ProvenanceClient,
  ProvenanceClientConfig,
  ProvenanceClientConfigBuilder,
  ProvenanceAPIError,
  ContributorResponse,
  ContributorSecurityResponse,
  PackageResponse,
  PackageSearchResponse,
  PackageDependentResponse,
  RepositoryResponse,
  RepositoryHealthResponse,
  AdvisoryResponse,
  ErrorResponse,
} from './client';

// Re-export generated types for advanced usage
export type { paths, components, operations } from './generated/api';
