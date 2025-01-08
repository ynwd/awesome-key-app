import { lusitana } from '@/app/ui/fonts';


export default async function Page() {
    const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/stats`;
    const res = await fetch(url, { method: "GET" })
    const data = await res.json();

    return (
        <main className='h-screen'>
            <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
                Dashboard
            </h1>
            <div className='flex flex-wrap gap-x-3 text-white'>
                <div className=' p-20 border bg-blue-700 rounded-lg'>
                    Keys: {data.totalKeys}
                </div>
                <div className=' p-20 border bg-blue-700  rounded-lg'>
                    Copies: {data.totalCopies}
                </div>
                <div className=' p-20 border bg-blue-700  rounded-lg'>
                    Staff: {data.totalStaff}
                </div>
            </div>
        </main>
    );
}