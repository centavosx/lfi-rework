import { RefObject, useEffect, useMemo, useState } from 'react'

export function useOnScreen<T extends HTMLElement = HTMLElement>(
  ref: RefObject<T>
) {
  const [isIntersecting, setIntersecting] = useState(false)

  const observer = useMemo(
    () =>
      new IntersectionObserver(([entry]) =>
        setIntersecting(entry.isIntersecting)
      ),
    [ref]
  )

  useEffect(() => {
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return isIntersecting
}
