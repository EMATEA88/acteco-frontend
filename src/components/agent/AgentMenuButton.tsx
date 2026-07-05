import { List } from "@phosphor-icons/react";

interface Props {
  onClick: () => void;
}

export default function AgentMenuButton({
  onClick,
}: Props) {
  return (
    <button
      onClick={onClick}
      className="
        w-11
        h-11
        rounded-xl
        bg-[#161A1E]
        border
        border-white/5
        flex
        items-center
        justify-center
        text-white
        hover:bg-[#1D232A]
        transition
      "
    >
      <List
        size={24}
        weight="bold"
      />
    </button>
  );
}