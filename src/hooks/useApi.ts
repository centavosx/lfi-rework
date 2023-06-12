import { AxiosResponse } from 'axios'
import { useState, useEffect } from 'react'

export function useApi<T extends any = any, O extends any = any>(
  api: (options?: O) => Promise<AxiosResponse | null>,
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

export function useApiPost<T extends any = any, O extends any = any>(
  api: (options?: O) => Promise<any>
) {
  const [data, setData] = useState<T>()

  const [{ loading, isFetching, isSuccess }, setFetching] = useState<{
    loading: boolean
    isFetching: boolean
    isSuccess?: boolean
    options?: O
  }>({
    loading: false,
    isFetching: false,
  })
  const [error, setError] = useState<any | undefined>(undefined)

  const call = async (options?: O) => {
    let isSuccess = false
    try {
      const response = await api(options)
      isSuccess = true
      setData(response)
    } catch (e) {
      setError(e)
    } finally {
      setFetching((d) => ({ ...d, isFetching: false, isSuccess }))
    }
  }

  const callApi = (options?: O) => {
    setFetching({ loading: true, isFetching: true, options })
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

  return {
    data,
    isFetching,
    callApi,
    error,
    isSuccess,
  }
}
