import React from 'react'
import { useRouter } from 'next/router'



const Avatar = ({ user }: any) => {
    const router = useRouter();

    const status = user.status === "Clocked In" ? "bg-green-400" : "bg-red-400"
    return (
        <span onClick={() => router.push(`/profile/${user.username}`)} className="relative inline-block mr-5 cursor-pointer">
            <img
                className="h-10 w-10 rounded-full"
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                alt=""
            />
            <span className={`absolute top-0 right-0 block h-2.5 w-2.5 rounded-full ${status} ring-2 ring-white`} />
        </span>
    )
}

export default Avatar