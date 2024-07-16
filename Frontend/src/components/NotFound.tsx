import { useLocation } from "react-router-dom"




export const NotFound = () => {
  const location = useLocation()
  return (
    <div>
      <h2>Page Not Found {location.pathname}</h2>
      <p>The page does not exist</p>
    </div>
  )
}
