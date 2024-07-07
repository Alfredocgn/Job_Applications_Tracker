import { useState,ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router-dom";


interface SignUpData{

  username:string;
  first_name:string;
  last_name:string;
  email:string;
  password:string;
  password2:string;

}

export const SignUp = () => {
  
  const navigate = useNavigate()

  const fetchSignUpData = async (data:SignUpData) => {

    try{
      const response = await fetch('http://127.0.0.1:8000/signup/',{
        method:'POST',
        headers:{
          'Content-Type':'application/json'
        },
        body:JSON.stringify(data)
      })

      if(response.ok){
        navigate('/')
      }else{
        throw new Error('Sign up Failed')
      }

    }catch(error){
      console.error(error)
    }

    

  }


  const initialSignUpData :SignUpData ={
    username:'',
    first_name:'',
    last_name:'',
    email:'',
    password:'',
    password2:'',

  }
  const [signUpData,setSignUpData] = useState<SignUpData>(initialSignUpData)


  const handleChange = (e:ChangeEvent<HTMLInputElement>) =>{
    const {name,value} = e.target
    setSignUpData((prevState) => ({
      ...prevState,
      [name]:value,

    }))
  }

  const handleSubmit = (e:FormEvent) => {
    e.preventDefault()
    fetchSignUpData(signUpData)
    setSignUpData(initialSignUpData)
  }



  return (
    <form onSubmit={handleSubmit} className="flex flex-col border-2 rounded-xl py-6 px-6 gap-2">
      <input type="text" placeholder="Name" id="first_name" name="first_name" className="p-1 rounded-md" value={signUpData.first_name} onChange={handleChange} />
      <input type="text" placeholder="Last Name" id="last_name" name="last_name"  className="p-1 rounded-md" value={signUpData.last_name} onChange={handleChange} />
      <input type="text" placeholder="Username" id="username" name="username"  className="p-1 rounded-md" value={signUpData.username} onChange={handleChange}/>
      <input type="email" placeholder="Email" id="email" name="email"  className="p-1 rounded-md" value={signUpData.email} onChange={handleChange} />
      <input type="password" placeholder="Password" id="password" name="password"  className="p-1 rounded-md" value={signUpData.password} onChange={handleChange}/>
      <input type="password" placeholder="Repeat Password" id="password2" name="password2"  className="p-1 rounded-md" value={signUpData.password2} onChange={handleChange}/>
      <button className="border-2 p-1 rounded-xl mt-2" type="submit">Submit</button>
    </form>
  )
}
