import { Loading } from 'components/loading'
import { useRouter } from 'next/router'

import { useEffect } from 'react'

export default function RedirectHOC() {
  const { replace } = useRouter()

  useEffect(() => {
    replace('/set-an-appointment/step1')
  })

  return <Loading />
}
