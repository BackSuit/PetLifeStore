import { useRouter } from "next/router"
import { useEffect } from "react"
import { ARTICLE_ROUTE } from "src/constanst/routes"

export default function Category() {
  const { push } = useRouter()
  useEffect(() => {
    push(ARTICLE_ROUTE)
  }, [push])
  return null
}
