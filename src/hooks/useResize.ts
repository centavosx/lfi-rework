import { useState, useEffect } from 'react'

export const useResize = () => {
  const [ui, setUi] = useState<UIEvent>()

  useEffect(() => {
    window?.addEventListener('resize', (v) => {
      setUi(v)
    })
    return () => {
      window?.removeEventListener('resize', (v) => {
        setUi(v)
      })
    }
  }, [])

  return ui
}
