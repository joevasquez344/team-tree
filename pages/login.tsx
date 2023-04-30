import { NextPage } from 'next';
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import { useAuth } from '../context/auth/AuthContext';
import useCheckbox from '../hooks/inputs/useCheckbox';
import ProtectedRoute from '../components/ProtectedRoute';

const Login: NextPage = () => {
    const router = useRouter();
    const { login, authUser }: any = useAuth();
    const [form, setForm] = useState({
        email: '',
        password: ''
    })
    const handleInputChange = (e: any) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
    }
    const { passwordHidden, handlePasswordCheckbox } = useCheckbox()

    const handleLogin = () => {
        login(form.email, form.password)
    }

    return (
            <div className='flex flex-col justify-center items-center mt-24'>
                <div className="w-full sm:w-1/2 xl:w-1/3">
                    <form className="bg-white w-[90%] rounded mx-auto mb-6">
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" >
                                Email
                            </label>
                            <input onChange={handleInputChange} name="email" value={form.email} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="username" type="text" placeholder="Email" />
                        </div>
                        <div className="mb-6">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                Password
                            </label>
                            <input onChange={handleInputChange} name="password" value={form.password} className="shadow appearance-none border border-red-500 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" id="password" type={passwordHidden ? "password" : "text"} placeholder="******************" />
                            <p className="text-red-500 text-xs italic">Please choose a password.</p>
                            <div className='flex items-center mt-2 space-x-2 text-sm'>
                                <input className='cursor-pointer' onChange={handlePasswordCheckbox} type="checkbox" />
                                <span>Show Password</span>
                            </div>
                        </div>
                        <div className="flex flex-col space-y-4">
                            <button onClick={handleLogin} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="button">
                                Sign In
                            </button>
                            <div>Don't have an account? <span onClick={() => router.push(`/register`)} className='text-blue-700 font-bold cursor-pointer'>Register</span></div>
                        </div>
                    </form>
                    <p className="text-center text-gray-500 text-xs">
                        &copy;2020 Acme Corp. All rights reserved.
                    </p>
                </div>
            </div>
    )
}

export default Login