import createClient from 'openapi-fetch';
import type { paths, components } from './generated/api';

// Re-export types from generated API
export type ContributorResponse = components['schemas']['ContributorResponse'];
export type ContributorSecurityResponse = components['schemas']['ContributorSecurityResponse'];
export type PackageResponse = components['schemas']['PackageResponse'];
export type PackageSearchResponse = components['schemas']['PackageSearchResponse'];
export type PackageDependentResponse = components['schemas']['PackageDependentResponse'];
export type RepositoryResponse = components['schemas']['RepositoryResponse'];
export type RepositoryHealthResponse = components['schemas']['RepositoryHealthResponse'];
export type AdvisoryResponse = components['schemas']['AdvisoryResponse'];
export type ErrorResponse = components['schemas']['ErrorResponse'];

export interface ProvenanceClientConfig {
  endpoint: string;
  apiToken: string;
  timeout?: number;
}

export class ProvenanceClientConfigBuilder {
  static fromEnv(): ProvenanceClientConfig {
    const endpoint = process.env.PROVENANCE_ENDPOINT;
    if (!endpoint) {
      throw new Error(
        'PROVENANCE_ENDPOINT is required (e.g., https://api.provenance.netrise.io/v1/provenance)'
      );
    }

    const apiToken = process.env.PROVENANCE_API_TOKEN;
    if (!apiToken) {
      throw new Error('PROVENANCE_API_TOKEN is required');
    }

    return {
      endpoint,
      apiToken,
      timeout: process.env.PROVENANCE_TIMEOUT
        ? parseInt(process.env.PROVENANCE_TIMEOUT, 10)
        : 30000,
    };
  }
}

export class ProvenanceAPIError extends Error {
  constructor(
    public statusCode: number,
    public errorResponse?: ErrorResponse
  ) {
    super(errorResponse?.msg || `API request failed with status ${statusCode}`);
    this.name = 'ProvenanceAPIError';
  }
}

export class ProvenanceClient {
  private config: ProvenanceClientConfig;

  constructor(config: ProvenanceClientConfig) {
    this.config = config;
  }

  private getClient() {
    const token = this.config.apiToken;
    const authHeader = token.startsWith('Bearer ') ? token : `Bearer ${token}`;

    return createClient<paths>({
      baseUrl: this.config.endpoint,
      headers: {
        Authorization: authHeader,
      },
    });
  }

  // --- Contributor endpoints ---

  async getContributor(params: {
    email?: string;
    username?: string;
  }): Promise<ContributorResponse> {
    if (params.email && params.username) {
      throw new Error('email and username are mutually exclusive');
    }
    if (!params.email && !params.username) {
      throw new Error('Either email or username is required');
    }

    const client = this.getClient();
    const { data, error, response } = await client.GET('/contributor', {
      params: {
        query: params,
      },
    });

    if (error) {
      throw new ProvenanceAPIError(response.status, error as ErrorResponse);
    }

    return data as ContributorResponse;
  }

  async getContributorSecurity(params: {
    email?: string;
    username?: string;
  }): Promise<ContributorSecurityResponse> {
    if (params.email && params.username) {
      throw new Error('email and username are mutually exclusive');
    }
    if (!params.email && !params.username) {
      throw new Error('Either email or username is required');
    }

    const client = this.getClient();
    const { data, error, response } = await client.GET('/contributor/security', {
      params: {
        query: params,
      },
    });

    if (error) {
      throw new ProvenanceAPIError(response.status, error as ErrorResponse);
    }

    return data as ContributorSecurityResponse;
  }

  // --- Package endpoints ---

  async getPackage(
    identifier: string,
    depth: number = 1
  ): Promise<PackageResponse> {
    const client = this.getClient();
    const { data, error, response } = await client.GET('/package', {
      params: {
        query: { identifier, depth },
      },
    });

    if (error) {
      throw new ProvenanceAPIError(response.status, error as ErrorResponse);
    }

    return data as PackageResponse;
  }

  async searchPackages(identifier: string): Promise<PackageSearchResponse> {
    const client = this.getClient();
    const { data, error, response } = await client.GET('/package/search', {
      params: {
        query: { identifier },
      },
    });

    if (error) {
      throw new ProvenanceAPIError(response.status, error as ErrorResponse);
    }

    return data as PackageSearchResponse;
  }

  async getDependents(identifier: string): Promise<PackageDependentResponse> {
    const client = this.getClient();
    const { data, error, response } = await client.GET('/package/dependents', {
      params: {
        query: { identifier },
      },
    });

    if (error) {
      throw new ProvenanceAPIError(response.status, error as ErrorResponse);
    }

    return data as PackageDependentResponse;
  }

  // --- Repository endpoints ---

  async getRepository(repoUrl: string): Promise<RepositoryResponse> {
    const client = this.getClient();
    const { data, error, response } = await client.GET('/repo', {
      params: {
        query: { repo_url: repoUrl },
      },
    });

    if (error) {
      throw new ProvenanceAPIError(response.status, error as ErrorResponse);
    }

    return data as RepositoryResponse;
  }

  async getRepositoryHealth(repoUrl: string): Promise<RepositoryHealthResponse> {
    const client = this.getClient();
    const { data, error, response } = await client.GET('/repo/health', {
      params: {
        query: { repo_url: repoUrl },
      },
    });

    if (error) {
      throw new ProvenanceAPIError(response.status, error as ErrorResponse);
    }

    return data as RepositoryHealthResponse;
  }

  // --- Advisory endpoint ---

  async getAdvisory(advisoryId: string): Promise<AdvisoryResponse> {
    const client = this.getClient();
    const { data, error, response } = await client.GET('/advisory', {
      params: {
        query: { advisory_id: advisoryId },
      },
    });

    if (error) {
      throw new ProvenanceAPIError(response.status, error as ErrorResponse);
    }

    return data as AdvisoryResponse;
  }
}
