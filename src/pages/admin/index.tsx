import { PageLoading } from 'components/loading'
import { useUserGuard } from 'hooks'

export default function Admin() {
  const { isLoading, isReplacing } = useUserGuard()

  if (isLoading || isReplacing) return <PageLoading />
}
