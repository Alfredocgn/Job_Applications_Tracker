import { ChangeEvent, FormEvent, useState } from "react"
import { useNavigate } from "react-router-dom";


interface FormData{
  username:string;
  password:string;
}
export const Login = () => {
  const navigate = useNavigate()


  const fetchLogin = async (formData: FormData) => {
    try{
      const response = await fetch('http://127.0.0.1:8000/login/',{
        method:'POST',
        headers:{
          'Content-Type':'application/json'
        },
        body:JSON.stringify(formData),
      })
      
      if(response.ok){
        const data = await response.json()
        localStorage.setItem('access_token',data.access)
        localStorage.setItem('refresh_token',data.refresh)
        navigate('/home')

      }
      else{
        throw new Error('Login Failed')
      }

    }catch(error){
      console.error(error)
    }
  }


  const initalFormData: FormData = {
    username:'',
    password:'',
  }
  const [formData,setFormData] = useState<FormData>(initalFormData)

  const handleChange = (e:ChangeEvent<HTMLInputElement>) => {
    const {name,value} = e.target
    setFormData((prevState) =>({
      ...prevState,
      [name]: value,
    }))
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    fetchLogin(formData)
    setFormData(initalFormData)
  }

  const handleSingUp = () => {
    navigate('/signup')
  }
  


  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="login__container flex flex-col border-2 rounded-xl py-4 px-8 gap-2 w-full items-center justify-center" >
          <div className="flex flex-col gap-2 border-b-2">
          <input type="text" name="username" id="username" placeholder="Username" className="p-1 rounded-md " value={formData.username} onChange={handleChange}/>
          <input type="password" name="password" id="password" placeholder="Password" className="p-1 rounded-md" value={formData.password} onChange={handleChange}/>
          <button type="submit" className="mb-2 border-2 rounded-xl p-1 w-full"> Login </button>
          </div>
          <div className="flex flex-col gap-1 w-full items-center">
          {/* <p className="text-[0.5rem] flex gap-1">Forgot your password? <button className=" hover:underline ">Click Here</button></p> */}
          <button onClick={handleSingUp} className=" mb-2 border-2 rounded-xl p-1 inline-block w-full">Sign Up</button>
          </div>
        </div>      
      </form>
    </div>
  )
}
