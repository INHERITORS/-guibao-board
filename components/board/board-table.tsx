import { ArrowDown, ArrowRight, ArrowUp } from "lucide-react";
import type { BoardRow } from "@/lib/types";

export function BoardTable({ rows }: { rows: BoardRow[] }) {
  return (
    <div className="overflow-hidden rounded-md border border-ink/12 bg-white/75">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[860px] border-collapse text-left">
          <thead className="bg-ink text-paper">
            <tr>
              <Header>排名</Header>
              <Header>策展名称</Header>
              <Header>策展人</Header>
              <Header>A</Header>
              <Header>B</Header>
              <Header>C</Header>
              <Header>基础</Header>
              <Header>风云</Header>
              <Header>本月</Header>
              <Header>YTD</Header>
              <Header>升跌</Header>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.curationSlug} className="border-t border-ink/10">
                <Cell className="font-semibold">{row.rank}</Cell>
                <Cell className="font-semibold">{row.curationName}</Cell>
                <Cell>{row.curatorName}</Cell>
                <Cell>{row.delivery}</Cell>
                <Cell>{row.quality}</Cell>
                <Cell>{row.content}</Cell>
                <Cell>{row.baseTotal}</Cell>
                <Cell className="text-cinnabar">+{row.fengyun}</Cell>
                <Cell className="font-semibold">{row.monthTotal}</Cell>
                <Cell>{row.ytd}</Cell>
                <Cell>
                  <Trend value={row.rankChange} />
                </Cell>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Header({ children }: { children: React.ReactNode }) {
  return <th className="whitespace-nowrap px-4 py-3 text-sm font-semibold">{children}</th>;
}

function Cell({
  children,
  className = ""
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <td className={`whitespace-nowrap px-4 py-3 text-sm text-ink ${className}`}>{children}</td>;
}

function Trend({ value }: { value: number }) {
  if (value > 0) {
    return (
      <span className="inline-flex items-center gap-1 text-jade">
        <ArrowUp size={16} /> {value}
      </span>
    );
  }

  if (value < 0) {
    return (
      <span className="inline-flex items-center gap-1 text-cinnabar">
        <ArrowDown size={16} /> {Math.abs(value)}
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 text-ink/55">
      <ArrowRight size={16} /> 0
    </span>
  );
}
