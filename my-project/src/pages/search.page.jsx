import { useParams } from "react-router-dom"

const SearchPage = () => {
    let {query} = useParams()
  return (
    <div>Search rsult {query}</div>
  )
}

export default SearchPage 