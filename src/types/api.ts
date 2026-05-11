/**
 * API Contract Types for TokenHunt Backend
 *
 * This file defines the TypeScript interfaces and types for API requests/responses.
 * Backend team: Please implement these contracts to ensure type safety across the stack.
 */

// ============================================================================
// Token Types
// ============================================================================

/**
 * Represents a Solana token in the TokenHunt platform
 */
export interface Token {
  /** Unique identifier for the token in our database */
  id: string;

  /** Solana token mint address (public key) */
  address: string;

  /** Token name (e.g., "Bonk Inu") */
  name: string;

  /** Token symbol/ticker (e.g., "BONK") */
  symbol: string;

  /** URL to the token icon/logo image */
  icon_url?: string;

  /** Overall AI safety score (0-100) */
  overall_ai_score: number;

  /** Smart contract security score (0-100) */
  contract_score?: number;

  /** Liquidity pool score (0-100) */
  liquidity_score?: number;

  /** Token distribution score (0-100) */
  distribution_score?: number;

  /** Number of upvotes from users */
  upvotes: number;

  /** Number of downvotes from users */
  downvotes: number;

  /** DEX source where the token was discovered (e.g., "raydium", "orca") */
  dex_source: string;

  /** ISO 8601 timestamp when the token was first discovered */
  discovered_at: string;

  /** Current liquidity in USD */
  liquidity_usd?: number;
}

// ============================================================================
// Search API Contract
// ============================================================================

/**
 * Request parameters for token search endpoint
 *
 * Endpoint: GET /tokens/search
 *
 * Query Parameters:
 * - q: Search query string
 * - limit: Number of results per page (default: 20)
 * - offset: Number of results to skip (default: 0)
 * - sort_by: Sort order (default: 'relevance')
 */
export interface SearchTokensRequest {
  /**
   * Search query string
   *
   * Supports searching by:
   * - Token name (e.g., "Bonk")
   * - Token symbol/ticker (e.g., "BONK")
   * - Solana mint address (e.g., "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263")
   *
   * Case-insensitive matching recommended
   */
  q: string;

  /** Number of results to return (default: 20, max: 100) */
  limit?: number;

  /** Number of results to skip for pagination (default: 0) */
  offset?: number;

  /**
   * Sort order for results
   *
   * Options:
   * - 'relevance': Best match first (default for search)
   * - 'newest': Most recently discovered first
   * - 'score': Highest AI safety score first
   * - 'trending': Most upvoted in last 24h
   */
  sort_by?: 'relevance' | 'newest' | 'score' | 'trending';
}

/**
 * Response from token search endpoint
 *
 * Example Response:
 * ```json
 * {
 *   "tokens": [
 *     {
 *       "id": "123",
 *       "address": "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263",
 *       "name": "Bonk",
 *       "symbol": "BONK",
 *       "overall_ai_score": 85,
 *       "upvotes": 1234,
 *       "downvotes": 56,
 *       ...
 *     }
 *   ],
 *   "total": 1,
 *   "limit": 20,
 *   "offset": 0,
 *   "has_more": false
 * }
 * ```
 */
export interface SearchTokensResponse {
  /** Array of tokens matching the search query */
  tokens: Token[];

  /** Total number of tokens matching the query (for pagination UI) */
  total: number;

  /** Number of results returned in this response */
  limit: number;

  /** Number of results skipped (pagination offset) */
  offset: number;

  /** Whether there are more results available (for infinite scroll) */
  has_more: boolean;
}

// ============================================================================
// Existing Feed API (for reference)
// ============================================================================

/**
 * Response from token feed endpoint (already implemented)
 *
 * Endpoint: GET /tokens/feed
 */
export interface TokenFeedResponse {
  tokens: Token[];
  has_more: boolean;
}

// ============================================================================
// Backend Implementation Notes
// ============================================================================

/**
 * BACKEND TODO: Implement the search endpoint
 *
 * Endpoint: GET /api/tokens/search
 *
 * Query Parameters:
 * - q (required): Search query string
 * - limit (optional): Results per page (default: 20, max: 100)
 * - offset (optional): Pagination offset (default: 0)
 * - sort_by (optional): Sort order (default: 'relevance')
 *
 * Search Logic:
 * 1. Check if query is a valid Solana address (44 characters, base58)
 *    - If yes, do exact match on token.address field
 * 2. Otherwise, search token.name and token.symbol fields
 *    - Use case-insensitive matching
 *    - Support partial matches (e.g., "bon" matches "Bonk")
 *    - Prioritize exact matches over partial matches
 *
 * Response Headers:
 * - Content-Type: application/json
 *
 * HTTP Status Codes:
 * - 200: Success
 * - 400: Invalid query parameters
 * - 500: Server error
 *
 * Example Requests:
 *
 * Search by name:
 *   GET /api/tokens/search?q=bonk&limit=10
 *
 * Search by symbol:
 *   GET /api/tokens/search?q=BONK&sort_by=score
 *
 * Search by mint address:
 *   GET /api/tokens/search?q=DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263
 *
 * Pagination:
 *   GET /api/tokens/search?q=solana&limit=20&offset=20
 */
