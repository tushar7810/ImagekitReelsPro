'use client'
import axios from 'axios';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

const RegisterPage = () => {
    const [fullname, setFullname] = useState('')
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [conformPassword, setConformPassword] = useState('')
    const router = useRouter()

    const handleRegister = async(e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if(password !== conformPassword){
            alert("Password not matched")
            return
        }
        const formdata = new FormData()
        formdata.append("email",email)
        formdata.append("fullname",fullname)
        formdata.append("username",username)
        formdata.append("password",password)
        try {
            const {data} = await axios.post('/api/auth/register', formdata ,{
                headers: {
                    "Content-Type" : "application/json"
                },
            })

            if(!data) {
                throw new Error(data.error || "Registration failed")
            }
            
            console.log(data);
            router.push('/login')

        } catch (error) {
            console.log(error);
        }
    }
  return (
    <div className='flex justify-center items-center min-h-screen bg-blue-600'>
        <form 
            onSubmit={handleRegister}
            className='bg-white p-6 rounded shadow-md w-full max-w-sm'
        >
            <h2 className='text-2xl font-bold mb-4 text-center text-black'>Register</h2>
            <div className='mb-4'>
                <label htmlFor='fullname' className='block text-gray-700 mb-2'>Fullname</label>
                <input 
                    type='text' 
                    id='fullname' 
                    value={fullname}
                    onChange={(e) => setFullname(e.target.value)}
                    className='w-full px-3 py-2 border rounded'
                    required
                />
            </div>
            <div className='mb-4'>
                <label htmlFor='username' className='block text-gray-700 mb-2'>Username</label>
                <input 
                    type='text' 
                    id='username' 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className='w-full px-3 py-2 border rounded'
                    required
                />
            </div>
            <div className='mb-4'>
                <label htmlFor='email' className='block text-gray-700 mb-2'>Email</label>
                <input 
                    type='email' 
                    id='email' 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className='w-full px-3 py-2 border rounded'
                    required
                />
            </div>
            <div className='mb-4'>
                <label htmlFor='password' className='block text-black mb-2'>Password</label>
                <input 
                    type='password' 
                    id='password' 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className='w-full px-3 py-2 border rounded text-black'
                    required
                />
            </div>
            <div className='mb-4'>
                <label htmlFor='conformPassword' className='block text-gray-700 mb-2'>Conform Password</label>
                <input 
                    type='password' 
                    id='conformPassword' 
                    value={conformPassword}
                    onChange={(e) => setConformPassword(e.target.value)}
                    className='w-full px-3 py-2 border rounded'
                    required
                />
            </div>
            <button 
                type='submit'
                className='w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition-colors'
            >
                Register
            </button>
        </form>
    </div>
  );
}

export default RegisterPage;
