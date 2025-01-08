import { lusitana } from "@/app/ui/fonts";
import KeysTable from "@/app/ui/key/table";

export default async function Page() {
    return <>
        <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>Keys Page</h1>
        <KeysTable />
    </>
}