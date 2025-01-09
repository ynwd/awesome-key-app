import fetchData from "@/app/lib/fetch";
import { SearchParam } from "@/app/lib/types";
import { lusitana } from "@/app/ui/fonts";
import KeysTable from "@/app/ui/key/table";

export default async function Page(props: {
    searchParams?: Promise<SearchParam>;
}) {

    const searchParams = await props.searchParams;
    let query = searchParams?.query
    const limit = Number(searchParams?.limit) || 10;
    const page = Number(searchParams?.page) || 1;
    const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/keys`;
    const res = await fetchData(url, page, limit, query = "")

    return <>
        <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>Keys Page</h1>
        <KeysTable data={res.data} total={res.total} page={page} />
    </>
}