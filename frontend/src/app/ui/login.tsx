"use client"

import { useState } from "react"
import Link from 'next/link';

export default function Login() {

    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setTimeout(() => {
            setLoading(false)
            const linkElement: any = document.querySelector('a[href="/dashboard"]')!;
            linkElement.click();
        }, 1000)
    }

    return <>
        <Link href="/dashboard" />
        <form onSubmit={handleSubmit} className=" max-w-md mx-auto bg-slate-300 p-6 rounded-lg">
            <div className="mb-6">
                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900" >Email address</label>
                <input type="email" id="email" className="block px-4 py-2 w-full text-gray-700 bg-white border border-gray-200 rounded-md focus:border-blue-500 focus:outline-none focus:ring" placeholder="john.doe@company.com" required />
            </div>
            <div className="mb-6">
                <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900">Password</label>
                <input type="password" id="password" className="block px-4 py-2 w-full text-gray-700 bg-white border border-gray-200 rounded-md focus:border-blue-500 focus:outline-none focus:ring" placeholder="•••••••••" required />
            </div>
            <button type="submit" disabled={loading} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                {loading ? "Logging in..." : "Login"}
            </button>
        </form>
    </>

}