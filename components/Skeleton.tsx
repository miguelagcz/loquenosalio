export default function Skeleton({
  className = "",
}: {
  className?: string;
}) {
  return (
    <div
      className={`
        relative
        overflow-hidden
        bg-zinc-800
        rounded-xl

        before:absolute
        before:inset-0
        before:-translate-x-full
        before:animate-[shimmer_1.5s_infinite]
        before:bg-gradient-to-r
        before:from-transparent
        before:via-white/10
        before:to-transparent

        ${className}
      `}
    />
  );
}