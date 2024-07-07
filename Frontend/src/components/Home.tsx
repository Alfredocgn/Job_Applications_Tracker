import { useEffect, useState } from "react"
import {apiFetch} from '../utils/utils'
export const Home = () => {

  const [data,setData] = useState()

  useEffect(()=> {
    fetchAplications()
  },[])

  const fetchAplications = async () => {

    try{
      const response = await apiFetch('http://localhost:8000/applications/')
      if(response.ok){
        const applications = await response.json()
        console.log(applications.results)
        setData(applications.results)
      }
      
    }catch(error){
      console.error('Error fetching applications',error)
    }
  }

  

  return (
    <div>
      <h1>Home</h1>
      <ul>
        {data?.map((application,index) => (
          <li key={index}>{application.title}</li>

        ))}
      </ul>
    </div>
  )
}
