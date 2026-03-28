import z, { ZodType } from 'zod'
import { useSessionAuthStore } from './model'

const DEFAULT_HEADERS = { 'Content-Type': 'application/json' }

export const refresh = (() => {
  let cacheRefreshPromise: Promise<string> | null = null

  const fn = async () => {
    const { refreshToken, rememberMe } = useSessionAuthStore.getState()

    const response = await fetch('/api/auth/refresh', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: refreshToken
        ? JSON.stringify({
            refreshToken,
            expiresInMins: 0,
          })
        : null,
    })

    const json = await response.json()

    if (!response.ok) {
      throw new Error('Необходимо заного пройти аутентификацию')
    }

    const newTokens = z
      .object({
        accessToken: z.string(),
        refreshToken: z.string(),
      })
      .parse(json)

    useSessionAuthStore.getState().login(newTokens, rememberMe)

    return newTokens.accessToken
  }

  return async () => {
    if (cacheRefreshPromise) return cacheRefreshPromise

    cacheRefreshPromise = fn()

    cacheRefreshPromise.finally(() => {
      cacheRefreshPromise = null
    })

    return cacheRefreshPromise
  }
})()

export const authFetch = async <T>(
  url: string,
  schema: ZodType<T>,
  params?: Parameters<typeof fetch>[1]
) => {
  const { accessToken } = useSessionAuthStore.getState()

  if (!accessToken) {
    throw new Error('Необходимо заного пройти аутентификацию')
  }

  let response = await fetch(url, {
    ...params,
    // Кладём токен в header
    headers: {
      ...DEFAULT_HEADERS,
      Authorization: `Bearer ${accessToken}`,
      ...(params?.headers || {}),
    },
  })

  if (response.status === 401) {
    try {
      const newAccessToken = await refresh()

      response = await fetch(url, {
        ...params,
        // Кладём токен в header
        headers: {
          ...DEFAULT_HEADERS,
          Authorization: `Bearer ${newAccessToken}`,
          ...(params?.headers || {}),
        },
      })
    } catch (refreshError) {
      if (refreshError instanceof Error) {
        console.error(refreshError.message)
      }
      throw refreshError
    }
  }

  try {
    const json = await response.json()

    if (!response.ok) {
      throw new Error(json.message || 'Во время запроса возникла ошибка')
    }

    const data = schema.parse(json)

    return data
  } catch (error) {
    console.error(error)
    throw error
  }
}

export const checkAuth = async () => {
  try {
    return await authFetch<{ username: string; id: number }>(
      '/api/auth/me',
      z.object({ username: z.string(), id: z.number() })
    )
  } catch {
    return null
  }
}
