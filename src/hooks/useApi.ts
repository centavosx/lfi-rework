import { AxiosResponse } from 'axios'
import { useState, useEffect } from 'react'

export function useApi<T extends any = any, O extends any = any>(
  api: (options?: O) => Promise<AxiosResponse>,
  noRefetchOnMount?: boolean,
  initialOptionData?: O
) {
  const [data, setData] = useState<T>()

  const [{ loading, isFetching }, setFetching] = useState<{
    loading: boolean
    isFetching: boolean
    options?: O
  }>({
    loading: !noRefetchOnMount,
    isFetching: !noRefetchOnMount,
    options: initialOptionData,
  })
  const [error, setError] = useState<any | undefined>(undefined)

  const call = async (options?: O) => {
    try {
      const response = await api(options)
      setData(response?.data)
    } catch (e) {
      setError(e)
    } finally {
      setFetching((d) => ({ ...d, isFetching: false }))
    }
  }

  const refetch = (options?: O) => {
    setFetching(() => ({ loading: true, isFetching: true, options }))
  }

  useEffect(() => {
    if (isFetching && loading) {
      setFetching((d) => {
        setError(undefined)
        call(d.options)
        return { ...d, loading: false }
      })
    }
  }, [isFetching, loading])

  return { data, isFetching, refetch, error }
}
