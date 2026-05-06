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

const makeRequest = async (baseUrl: string, endpoint: string, params?: QueryParams, revalidate = 60) => {
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
  let response = await makeRequest(BASE_URL, endpoint, params, revalidate)
  let errorBody: CoinGeckoErrorBody = {}

  if (!response.ok) {
    errorBody = await response.json().catch(() => ({}))

    const errorMessage = errorBody.error || errorBody.status?.error_message || response.statusText
    const shouldRetryWithDemoApi =
      response.status === 400 &&
      normalizeBaseUrl(BASE_URL).includes('pro-api.coingecko.com') &&
      /demo api key/i.test(errorMessage)

    if (shouldRetryWithDemoApi) {
      response = await makeRequest(DEMO_BASE_URL, endpoint, params, revalidate)

      if (response.ok) {
        return response.json()
      }

      errorBody = await response.json().catch(() => ({}))
    }

    throw new Error(
      `API Error: ${response.status}: ${errorBody.error || errorBody.status?.error_message || response.statusText} `,
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
