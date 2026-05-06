'use server'

import qs from 'query-string'

const BASE_URL = process.env.COIN_GECKO_API_URL
const API_KEY = process.env.COIN_GECKO_API_KEY
const DEMO_BASE_URL = 'https://api.coingecko.com/api/v3'

if (!BASE_URL) {
  throw new Error('Could not get base url')
}

if (!API_KEY) {
  throw new Error('Could not get api key')
}

const normalizeBaseUrl = (baseUrl: string) => baseUrl.replace(/\/+$/, '')

const normalizeEndpoint = (endpoint: string) => endpoint.replace(/^\/+/, '')

const buildUrl = (baseUrl: string, endpoint: string, params?: QueryParams) =>
  qs.stringifyUrl(
    {
      url: `${normalizeBaseUrl(baseUrl)}/${normalizeEndpoint(endpoint)}`,
      query: params,
    },
    { skipEmptyString: true, skipNull: true },
  )

const getApiKeyHeader = (baseUrl: string) =>
  normalizeBaseUrl(baseUrl).includes('pro-api.coingecko.com')
    ? 'x-cg-pro-api-key'
    : 'x-cg-demo-api-key'

const getErrorMessage = (errorBody: unknown, fallback: string) => {
  if (typeof errorBody === 'string') {
    return errorBody
  }

  if (!errorBody || typeof errorBody !== 'object') {
    return fallback
  }

  const body = errorBody as {
    error?: string | { status?: { error_message?: string } }
    status?: { error_message?: string }
  }

  if (typeof body.error === 'string') {
    return body.error
  }
  if (body.error && typeof body.error === 'object' && body.error.status?.error_message) {
    return body.error.status.error_message
  }
  if (body.status?.error_message) {
    return body.status.error_message
  }

  return fallback
}

const makeRequest = async (
  baseUrl: string,
  endpoint: string,
  params?: QueryParams,
  revalidate = 60,
) => {
  return fetch(buildUrl(baseUrl, endpoint, params), {
    headers: {
      [getApiKeyHeader(baseUrl)]: API_KEY,
      'Content-Type': 'application/json',
    } as Record<string, string>,
    next: { revalidate },
  })
}

export const fetcher = async <T>(
  endpoint: string,
  params?: QueryParams,
  revalidate = 60,
): Promise<T> => {
  let requestBaseUrl = BASE_URL
  let response = await makeRequest(requestBaseUrl, endpoint, params, revalidate)
  let errorBody: unknown = {}

  if (!response.ok) {
    errorBody = await response.json().catch(() => ({}))

    const errorMessage = getErrorMessage(errorBody, response.statusText)
    const shouldRetryWithDemoApi =
      response.status === 400 &&
      normalizeBaseUrl(BASE_URL).includes('pro-api.coingecko.com') &&
      /demo api key/i.test(errorMessage)

    if (shouldRetryWithDemoApi) {
      requestBaseUrl = DEMO_BASE_URL
      response = await makeRequest(requestBaseUrl, endpoint, params, revalidate)

      if (response.ok) {
        return response.json()
      }

      errorBody = await response.json().catch(() => ({}))
    }

    const shouldRetryOhlcMaxWithYear =
      normalizeEndpoint(endpoint).endsWith('/ohlc') &&
      params?.days === 'max' &&
      /past 365 days|allowed time range/i.test(getErrorMessage(errorBody, response.statusText))

    if (shouldRetryOhlcMaxWithYear) {
      response = await makeRequest(
        requestBaseUrl,
        endpoint,
        {
          ...params,
          days: 365,
        },
        revalidate,
      )

      if (response.ok) {
        return response.json()
      }

      errorBody = await response.json().catch(() => ({}))
    }

    throw new Error(
      `API Error: ${response.status}: ${getErrorMessage(errorBody, response.statusText)} `,
    )
  }

  return response.json()
}

export const getPools = async (
  id: string,
  network?: string | null,
  contractAddress?: string | null,
): Promise<PoolData> => {
  const fallback: PoolData = {
    id: '',
    address: '',
    name: '',
    network: '',
  }

  if (network && contractAddress) {
    try {
      const poolData = await fetcher<{ data: PoolData[] }>(
        `/onchain/networks/${network}/tokens/${contractAddress}/pools`,
      )

      return poolData.data?.[0] ?? fallback
    } catch (error) {
      console.log(error)
      return fallback
    }
  }

  try {
    const poolData = await fetcher<{ data: PoolData[] }>('/onchain/search/pools', { query: id })

    return poolData.data?.[0] ?? fallback
  } catch {
    return fallback
  }
}
