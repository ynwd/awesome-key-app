import fetchData from "@/app/lib/fetch";
import { SearchParam } from "@/app/lib/types";
import CopiesTable from "@/app/ui/copy/table";
import { lusitana } from "@/app/ui/fonts";

export default async function Page(props: {
    searchParams?: Promise<SearchParam>;
}) {

    const searchParams = await props.searchParams;
    let query = searchParams?.query
    const limit = Number(searchParams?.limit) || 10;
    const page = Number(searchParams?.page) || 1;
    const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/copies`;
    const res = await fetchData(url, page, limit, query = "")

    return <>
        <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>Copies Page</h1>
        <CopiesTable data={res.data} total={res.total} page={page} />
    </>
}