import { useEffect, useState } from "react"
import {apiFetch} from '../utils/utils'
import { useNavigate } from "react-router-dom";
import { MdOutlineDeleteOutline,MdOutlineModeEdit,MdCheck,MdOutlineCancelPresentation } from "react-icons/md";


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
  const [editingId,setEditingId] = useState<number | null>(null);
  const [editedApplication,setEditedApplication] = useState<Partial<Application> | null>(null);

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
        setData(applications.results)
      }
      
    }catch(error){
      setLoading(false)
      setError(true)
      console.error('Error fetching applications',error)
    }
  }

  const handleDelete = async (id:number | undefined) => {
    if(!id) return

    try {
      const response = await apiFetch(`http://localhost:8000/applications/${id}`,{
        method: "DELETE",
      })
      if(response.ok){
        setData((prevData) => prevData?.filter((application) => application.id !== id))
      }
    }catch(error){
      console.error("Error deleting application", error)
    }
  }

  const handleEditClick = (application : Application) => {

    setEditingId(application.id || null)
    setEditedApplication({
      ...application,
      status:application.status,
      interview_date:application.interview_date,
      response_date:application.response_date,
      description_job:application.description_job
    })
  }

  const handleCancelClick = () => {
    setEditingId(null)
    setEditedApplication(null)
  }

  const handleInputChange = (e:React.ChangeEvent<HTMLInputElement | HTMLSelectElement |HTMLTextAreaElement>) => {
    const {name,value} = e.target
    setEditedApplication((prev) => ({...prev, [name]:value}))
  }

  const handleSaveClick = async () => {
    if(!editedApplication || !editingId) return;
    try{
      const response = await apiFetch(`http://localhost:8000/applications/${editingId}`,{
        method:'PUT',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify(editedApplication),
        
      })

      if(response.ok){
        const updatedApplication = await response.json()
        console.log('Updated application', updatedApplication)
        
        setData((prevData) => prevData?.map((app) => app.id === editingId ? updatedApplication : app))
        setEditingId(null)
        setEditedApplication(null)

      }else {
        console.log('Error updating application',error)
      }
    }catch(error){
      console.error("Error updating application",error)
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
      <h1  className=" font-bold text-[1.5rem] pb-4 ">Applications</h1>
      <table className="mb-4">
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
            <th className="w-[10rem] text-center border-2">
              {editingId ? "Save / Cancel" : "Edit / Delete"}
            </th>
          </tr>
        </thead>
        <tbody >
          {data ? (
            data.map((application) => (
              <tr key={application.id} >
                <td className="w-[10rem] text-center border-2">{application.title}</td>
                <td className="w-[10rem] text-center border-2">{application.applied_date}</td>
                {editingId === application.id ? (
                  <>
                  <td className="w-[10rem] text-center border-2">
                    <select 
                    name="status"
                    value={editedApplication?.status || ""}
                    onChange={handleInputChange}
                    >
                      <option value="NA">Not Answer</option>
                      <option value="RE">Rejected</option>
                      <option value="IN">Interview</option>     
                    </select>
                    </td>
                    <td className="w-[10rem] text-center border-2">
                      <input type="date" name="response_date" value={editedApplication?.response_date || ""} onChange={handleInputChange} />

                    </td>
                    <td className="w-[10rem] text-center border-2">
                      <input type="date" name="interview_date" value={editedApplication?.interview_date || ""} onChange={handleInputChange} />
                    </td>
                    <td className="w-[10rem] text-center border-2">
                      <textarea  name="description_job" value={editedApplication?.description_job || ""} onChange={handleInputChange} />
                    </td>
                  </>
                ):( 
                  <>
                  <td className="w-[10rem] text-center border-2">{application.status}</td>
                  <td className="w-[10rem] text-center border-2">{application.response_date}</td>
                  <td className="w-[10rem] text-center border-2">{application.interview_date}</td>
                  <td className="w-[10rem] text-center border-2">{application.description_job}</td>                
                  </>               
                  )}

                <td className="w-[10rem] text-center border-2">{application.company.name}</td>
                <td className="w-[10rem] text-center border-2">{application.company.location}</td>
                <td className="w-[10rem] text-center border-2">{application.company.industry}</td>
                <td className="w-[10rem] text-center border-2">
                  {
                    editingId === application.id ? (
                      <div className="flex gap-2 items-center justify-center text-[1.5rem]">
                      <button onClick={handleSaveClick}><MdCheck/></button>
                      <button onClick={handleCancelClick}><MdOutlineCancelPresentation/></button>
                      </div>
                    ) : (
                      <div className="flex gap-2 items-center justify-center text-[1.5rem]">
                      <button onClick={() => handleEditClick(application)}><MdOutlineModeEdit/></button>
                      <button onClick={() => handleDelete(application.id)}><MdOutlineDeleteOutline/></button>
                      </div>
                    )
                  }

                </td>
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
