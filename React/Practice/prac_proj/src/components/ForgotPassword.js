import React,{useState} from 'react'

export default function ForgotPassword() {


    const [email,setEmail] = useState('')

    const handleChange = (event) =>{

        const {name,value} = event.target

        setEmail(value)

    }

    const handleSubmit = () =>{
        console.log("submitted")
    }

    return (
        <div>
            
            <h4> Reset your password </h4>



            <input type="text" value = {email} placeholder="Enter your email" onChange={handleChange} ></input>

            <button onClick={handleSubmit}>Reset</button>

        </div>
    )
}
