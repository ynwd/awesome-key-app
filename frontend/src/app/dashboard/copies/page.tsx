import CopiesTable from "@/app/ui/copy/table";
import { lusitana } from "@/app/ui/fonts";

export default async function Page() {
    return <>
        <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>Copies Page</h1>
        <CopiesTable />
    </>
}