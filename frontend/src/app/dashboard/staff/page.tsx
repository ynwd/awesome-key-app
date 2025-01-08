import { lusitana } from "@/app/ui/fonts";
import StaffTable from "@/app/ui/staff/table";

export default function Page() {



    return <>
        <div className="flex justify-between">
            <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>Staff Page</h1>
        </div>
        <StaffTable />
    </>
}