import { ChartAreaInteractive } from "./default/_components/chart-area-interactive";
import data from "./default/_components/data.json";
import { DataTable } from "./default/_components/data-table";
import { SectionCards } from "./default/_components/section-cards";

export default function Page() {
  return (
    <div className="@container/main flex flex-col gap-4 md:gap-6">
      <SectionCards />
      <ChartAreaInteractive />
      <DataTable data={data} />
    </div>
  );
}
