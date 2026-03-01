import { fetchCategorySlug } from "@/libs/api"
import { createContext, useContext, useEffect, useState } from "react"

let categoriesCache = []

export const GlobalContext = createContext({
  categories: [],
  imagePopup: "",
})

export default function ContextProvider({ children }) {
  const [categories, setCategories] = useState([])
  const [imagePopup, setImagePopup] = useState("")

  useEffect(() => {
    if (categoriesCache.length === 0) {
      fetchCategorySlug().then(data => {
        if (data && data.length > 0) {
          setCategories(data)
          categoriesCache = [...data]
        }
      })
    } else {
      setCategories(categoriesCache)
    }
  }, [])

  return (
    <GlobalContext.Provider value={{ categories, imagePopup, setImagePopup }}>
      {children}
    </GlobalContext.Provider>
  )
}

export const useGlobalContext = () => useContext(GlobalContext)
