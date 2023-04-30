import { useRouter } from 'next/router';
import React, { useState } from 'react'
import AddButton from '../components/buttons/AddButton';
import { useAuth } from '../context/auth/AuthContext';
import { createTeam } from '../utils/api/teams'

const createteam = () => {
    const router = useRouter();
    const { authUser } = useAuth();
    const [error, setError] = useState(null)

    const [form, setForm] = useState({
        role: "",
        custom: "",
        name: ""
    })



    const handleInputChange = (e) => {
        setForm({
            ...form,
            [e.currentTarget.name.toLowerCase()]: e.currentTarget.value
        })
    }
    const validateForm = () => {
        if (form.name.length === 0) {
            return false
        } else {
            if (form.role === "Create Role" && form.custom.length === 0) {
                return false
            }
        }

        return true;
    }

    const handleCreateTeam = async () => {
        if (validateForm()) {
            const role = form.role === "Create Role" ? form.custom : form.role

             await createTeam(authUser, form.name, role);
            router.push(`/teams`);
        } else {
            console.log("Error");
        }

    }

    const handleAddTeamMembers = () => {
        // Search DB for exisiting usernames to add to Team
    }

  
        return (
            <div className='flex flex-col justify-center items-center mt-24'>
                <div className="w-full sm:w-1/2 xl:w-1/3">
                    <form className="bg-white w-[90%] rounded mx-auto mb-6">
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" >
                                Team Name
                            </label>
                            <input name="name" value={form.name} onChange={handleInputChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="username" type="text" placeholder="" />
                        </div>
                        <div className="mb-8">
                            <label className="block text-gray-700 text-sm font-bold mb-2" >
                                Role
                            </label>
                            <select onChange={handleInputChange} value={form.role} className='shadow  border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ' name="Role" id="">
                                <option name="role" value="Project Manager">Project Manger</option>
                                <option name="role" value="Senior Front End Developer">Senior Front End Developer</option>
                                <option name="role" value="Senior Back End Develope">Senior Back End Developer</option>
                                <option name="role" value="Senior Full Stack Developer">Senior Full Stack Developer</option>
                                <option name="role" value="Junior Front End Developer">Junior Front End Developer</option>
                                <option name="role" value="Junior Back End Developer">Junior Back End Developer</option>
                                <option name="role" value="Junior Full Stack Developer">Junior Full Stack Developer</option>
                                <option name="role" value="Create Role">Create Role</option>
                            </select>
                            {form.role === "Create Role" && <div className='mt-4'>
                                <input name="custom" value={form.custom} onChange={handleInputChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="text" placeholder="What role would you like?" />
                            </div>}
                        </div>
                        <div className='mb-8'>
                            <div className='flex items-center space-x-4 shadow rounded border p-3 transition ease-in-out cursor-pointer duration-200 hover:bg-gray-100'>
                                <AddButton />
                                <div className='text-gray-500 font-semibold'>Add Team Members</div>
                            </div>
                        </div>
                        <div className="flex flex-col space-y-4">
                            <button onClick={handleCreateTeam} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="button">
                                Create Team
                            </button>
                        </div>
                    </form>
                    <p className="text-center text-gray-500 text-xs">
                        &copy;2020 Acme Corp. All rights reserved.
                    </p>
                </div>
            </div>
        )


}

export default createteam