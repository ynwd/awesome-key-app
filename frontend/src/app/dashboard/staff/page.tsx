import { lusitana } from "@/app/ui/fonts";
import StaffTable from "@/app/ui/staff/table";
import { pages } from "next/dist/build/templates/app-page";

async function getStaff(page = 1, limit = 10, query = ""): Promise<any> {
    const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/staff`;

    const res = await fetch(`${url}?page=${page}&limit=${limit}&query=${query}`);
    // console.log(res)
    if (!res.ok) {
        throw new Error('Failed to fetch todos');
    }
    return res.json();
}

export default async function Page(props: {
    searchParams?: Promise<{
        query?: string;
        page?: number;
        limit?: number
    }>;
}) {

    const searchParams = await props.searchParams;
    const query = searchParams?.query
    const limit = Number(searchParams?.limit) || 10;
    const page = Number(searchParams?.page) || 1;
    const res = await getStaff(page, limit, query);

    return <>
        <div className="flex justify-between">
            <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>Staff Page</h1>
        </div>
        <StaffTable data={res.data} total={res.total} page={page} />
    </>
}