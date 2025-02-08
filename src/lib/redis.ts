import { Redis } from '@upstash/redis'

export const redis = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
})

export const CACHE_KEYS = {
  RANKINGS: 'rankings',
  USER_CARDS: (userId: number) => `user:${userId}:cards`,
  USER_CONNECTIONS: (userId: number) => `user:${userId}:connections`,
}

export const CACHE_TTL = {
  RANKINGS: 300, // 5 minutes
  USER_CARDS: 60, // 1 minute
  USER_CONNECTIONS: 60, // 1 minute
} 