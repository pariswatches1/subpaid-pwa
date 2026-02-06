import { KeywordCacheEntry, KeywordRequest, KeywordResponse } from './keyword-types';
import { generateCacheKey } from './keyword-generator';

// Cache TTL in milliseconds (7 days)
const CACHE_TTL_MS = 7 * 24 * 60 * 60 * 1000;

// In-memory cache store (in production, this would be in the database)
let keywordCache: KeywordCacheEntry[] = [];

// Generate unique ID
function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

// Get cached response if available and not expired
export function getCachedKeywords(request: KeywordRequest): KeywordResponse | null {
  const cacheKey = generateCacheKey(request);
  const now = new Date().toISOString();

  // Find non-expired cache entry
  const entry = keywordCache.find(
    (e) => e.cacheKey === cacheKey && e.expiresAt > now
  );

  if (entry) {
    return entry.response;
  }

  // Clean up expired entries
  keywordCache = keywordCache.filter((e) => e.expiresAt > now);

  return null;
}

// Save keywords to cache
export function cacheKeywords(
  request: KeywordRequest,
  response: KeywordResponse
): KeywordCacheEntry {
  const cacheKey = generateCacheKey(request);
  const now = new Date();
  const expiresAt = new Date(now.getTime() + CACHE_TTL_MS);

  // Remove existing entry with same cache key
  keywordCache = keywordCache.filter((e) => e.cacheKey !== cacheKey);

  const entry: KeywordCacheEntry = {
    id: generateId(),
    cacheKey,
    request,
    response,
    createdAt: now.toISOString(),
    expiresAt: expiresAt.toISOString(),
  };

  keywordCache.push(entry);

  return entry;
}

// Clear all cached keywords
export function clearKeywordCache(): void {
  keywordCache = [];
}

// Get cache stats
export function getCacheStats(): {
  totalEntries: number;
  validEntries: number;
  expiredEntries: number;
} {
  const now = new Date().toISOString();
  const validEntries = keywordCache.filter((e) => e.expiresAt > now).length;
  const expiredEntries = keywordCache.length - validEntries;

  return {
    totalEntries: keywordCache.length,
    validEntries,
    expiredEntries,
  };
}

// Format cache age for display
export function formatCacheAge(generatedAt: string): string {
  const generated = new Date(generatedAt);
  const now = new Date();
  const diffMs = now.getTime() - generated.getTime();

  const minutes = Math.floor(diffMs / (1000 * 60));
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes} minute${minutes === 1 ? '' : 's'} ago`;
  if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`;
  return `${days} day${days === 1 ? '' : 's'} ago`;
}

// Check if cache is stale (older than half the TTL)
export function isCacheStale(generatedAt: string): boolean {
  const generated = new Date(generatedAt);
  const now = new Date();
  const diffMs = now.getTime() - generated.getTime();
  return diffMs > CACHE_TTL_MS / 2;
}
