import Dialogue from "@/components/global/dialogue";
import StoryList from "@/components/global/story-list";

export default function Home() {
  return (
    <div className="flex-1 bg-main-100 pl-4 grid grid-cols-7 gap-4">
      <StoryList />
      <Dialogue />
    </div>
  );
}
