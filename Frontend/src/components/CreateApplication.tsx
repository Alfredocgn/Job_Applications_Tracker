import { useNavigate } from "react-router-dom"
import { Application } from "./Home"
import { ChangeEvent, FormEvent, useState } from "react"





export const CreateApplication = () => {

  const initialApplicationForm:Application = {
    title: "",
    applied_date: "",
    status: "NA",
    company: {
      name: "",
      industry: "",
      location: "",
    },
    response_date: null,
    interview_date: null,
    description_job: "",

  }
  const navigate = useNavigate()
  const [applicationForm,setApplicationForm] = useState<Application>(initialApplicationForm)

  const fetchApplication = async (applicationData :Application) => {

    try{
      const token = localStorage.getItem("access_token")
      const response = await fetch('http://127.0.0.1:8000/applications/',{
        method:'POST',
        headers:{
          'Content-Type':'application/json',
          Authorization: `Bearer ${token}`
        },
        body:JSON.stringify(applicationData)
      })
      console.log(token)

      if (response.ok){
        navigate('/home')

        
      }
    }catch(error){
      console.log(error)
    }

  }



  const handleChange = (e:ChangeEvent<HTMLInputElement | HTMLSelectElement |HTMLTextAreaElement> ) => {
    const {name,value} = e.target

    if (name.startsWith('company.')){
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const[_,key]= name.split('.')

      setApplicationForm((prevState) => ({
        ...prevState,
        company:{
          ...prevState.company,
          [key]:value,
        }
      }))

    }else {
      setApplicationForm((prevState) => ({
        ...prevState,
        [name]:value,
      }))
    }
  }

  const handleSubmit = (e:FormEvent) => {
    e.preventDefault()
    
    console.log(applicationForm)
    fetchApplication(applicationForm)
    setApplicationForm(initialApplicationForm)

  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <div className="flex flex-col gap-2 items-start">
          <label htmlFor="title" >Application Title:</label>
          <input onChange={handleChange} type="text" name="title"  id="title" className="p-1 rounded-md w-full" value={applicationForm.title} />
        </div>
        <div className="flex gap-2 items-start flex-col">
          <label htmlFor="applied_date">Application Date: </label>
          <input onChange={handleChange} type="date" name="applied_date" id="applied_date" className="p-1 rounded-md w-full"  value={applicationForm.applied_date}/>
        </div>
        <div className="flex gap-2 items-start flex-col">
          <label htmlFor="status">Status:</label>
          <select name="status" id="status" className="p-1 rounded-md w-full" onChange={handleChange} value={applicationForm.status}>
            <option value="NA">No Answer</option>
            <option value="RE">Rejected</option>
            <option value="IN">No Interview</option>
          </select>
        </div>
        <div className="flex gap-2 items-start flex-col">
          <label htmlFor="company.name">Company Name:</label>
          <input onChange={handleChange} type="text" name="company.name" id="company.name" className="p-1 rounded-md w-full" value={applicationForm.company.name}/>
        </div>
        <div className="flex gap-2 items-start flex-col">
          <label htmlFor="company.location">Location:</label>
          <input onChange={handleChange} type="text" id="company.location"  name="company.location" className="p-1 rounded-md w-full" value={applicationForm.company.location}/>
        </div>
        <div className="flex gap-2 items-start flex-col">
          <label htmlFor="company.industry">Industry:</label>
          <input type="text" id="company.industry" name="company.industry" className="p-1 rounded-md w-full" value={applicationForm.company.industry} onChange={handleChange} />
        </div>
        <div className="flex gap-2 items-start flex-col">
          <label htmlFor="response_date">Response Date:</label>
          <input type="date" id="response_date" name="response_date" className="p-1 rounded-md w-full"  value={applicationForm.response_date ?? ""}/>
        </div>
        <div className="flex gap-2 items-start flex-col">
          <label htmlFor="interview_date">Interview Date:</label>
          <input type="date" name="interview_date" id="interview_date" className="p-1 rounded-md w-full" value={applicationForm.interview_date ?? ""} />
        </div>
        <div className="flex gap-2 items-start flex-col">
          <label htmlFor="description_job">Description:</label>
          <textarea name="description_job" id="description_job" className="p-1 rounded-md w-full" value={applicationForm.description_job} onChange={handleChange}></textarea>
        </div>
        <button className=" mb-2 border-2 rounded-xl p-1 inline-block" type="submit">Submit</button>
      </form>
    </div>
  )
}
