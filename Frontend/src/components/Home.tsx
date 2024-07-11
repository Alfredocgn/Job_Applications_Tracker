import { useEffect, useState } from "react"
import {apiFetch} from '../utils/utils'
import { useNavigate } from "react-router-dom";


export interface Application {
  title:string;
  applied_date:string;
  description_job?:string ;
  interview_date?: string | null;
  response_date?:string | null;
  status:string;
  company:{name:string,industry:string,location:string};
  id?:number;
}

export const Home = () => {

  const navigate = useNavigate()

  const [data,setData] = useState<Application[] |undefined>()
  const [loading,setLoading] = useState<boolean>(false);
  const [error,setError] = useState<boolean>(false);

  useEffect(()=> {
    fetchAplications()
  },[])

  const fetchAplications = async () => {

    setLoading(true)

    try{
      const response = await apiFetch('http://localhost:8000/applications/')
      if(response.ok){
        setLoading(false)
        const applications = await response.json()
        console.log(applications)

        setData(applications.results)
      }
      
    }catch(error){
      setLoading(false)
      setError(true)
      console.error('Error fetching applications',error)
    }
  }

  if(loading){
    return <div>Loading appplications...</div>
  }

  if(error){
    return <div>Error fetching data</div>
  }

  const handleNewApplicationButton = () => {
    navigate('/new')
  }

  return (
    <div className="flex flex-col items-center  gap-2 ">
      <h1>Applications</h1>
      <table>
        <thead>
          <tr>
            <th className="w-[10rem] text-center border-2">Title</th>
            <th className="w-[10rem] text-center border-2">Applied Date</th>
            <th className="w-[10rem] text-center border-2">Status</th>
            <th className="w-[10rem] text-center border-2">Response Date</th>
            <th className="w-[10rem] text-center border-2">Interview Date</th>
            <th className="w-[10rem] text-center border-2">Description</th>
            <th className="w-[10rem] text-center border-2">Company</th>
            <th className="w-[10rem] text-center border-2">Company Location</th>
            <th className="w-[10rem] text-center border-2">Company Industry</th>
          </tr>
        </thead>
        <tbody >
          {data ? (
            data.map((application) => (
              <tr key={application.id} >
                <td className="w-[10rem] text-center border-2">{application.title}</td>
                <td className="w-[10rem] text-center border-2">{application.applied_date}</td>
                <td className="w-[10rem] text-center border-2">{application.status}</td>
                <td className="w-[10rem] text-center border-2">{application.response_date}</td>
                <td className="w-[10rem] text-center border-2">{application.interview_date}</td>
                <td className="w-[10rem] text-center border-2">{application.description_job}</td>
                <td className="w-[10rem] text-center border-2">{application.company.name}</td>
                <td className="w-[10rem] text-center border-2">{application.company.location}</td>
                <td className="w-[10rem] text-center border-2">{application.company.industry}</td>
              </tr>
            ))
          ):(
            <tr>
              <td colSpan={9} >No applications added</td>
            </tr>
          )}
        </tbody>
      </table>
      <button className=" mb-2 border-2 rounded-xl px-4 py-2 inline-block " onClick={handleNewApplicationButton}> Add Application </button>
    </div>
  )
}
