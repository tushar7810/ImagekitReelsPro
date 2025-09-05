'use client'
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter()

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const result = await signIn("credentials", {
                email,
                password,
                redirect: false
                
            })
            if (result?.error) {
                console.log(result.error);
            } else {
                router.push('/dashboard')
            }

        } catch (error) {
            console.error(error);
            // Handle error (e.g., show an error message)
        }
    };

    return (
        <div className='flex justify-center items-center min-h-screen bg-blue-600'>
            <form 
                onSubmit={handleLogin}
                className='bg-white p-6 rounded shadow-md w-full max-w-sm'
            >
        
            <h2 className='text-2xl font-bold mb-4 text-center text-black'>Login</h2>
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
                <label htmlFor='password' className='block text-gray-700 mb-2'>Password</label>
                <input 
                    type='password' 
                    id='password' 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className='w-full px-3 py-2 border rounded'
                    required
                />
            </div>
            <button 
                type='submit'
                className='w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition-colors'
            >
                Login
            </button>
        </form>
    </div>
  );
}

export default LoginPage;
