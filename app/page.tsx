import { PublicBoard } from "@/components/board/public-board";
import { Shell } from "@/components/layout/shell";

export default function HomePage() {
  return (
    <Shell>
      <PublicBoard />
    </Shell>
  );
}
