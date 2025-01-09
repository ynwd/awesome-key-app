import fetchData from "@/app/lib/fetch";
import { SearchParam } from "@/app/lib/types";
import { lusitana } from "@/app/ui/fonts";
import StaffTable from "@/app/ui/staff/table";

export default async function Page(props: {
    searchParams?: Promise<SearchParam>;
}) {

    const searchParams = await props.searchParams;
    let query = searchParams?.query
    const limit = Number(searchParams?.limit) || 10;
    const page = Number(searchParams?.page) || 1;
    const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/staff`;
    const res = await fetchData(url, page, limit, query = "")

    return <>
        <div className="flex justify-between">
            <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>Staff Page</h1>
        </div>
        <StaffTable data={res.data} total={res.total} page={page} />
    </>
}