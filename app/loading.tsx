/** Skeleton del home: misma estructura que el bento real (a todo el ancho). */
// [cm, rm, cd, rd]: columnas/filas en móvil y en escritorio
const CELLS: [number, number, number, number][] = [
  [4, 3, 6, 4], [2, 2, 3, 3], [2, 3, 3, 4], [2, 2, 3, 3], [4, 2, 8, 3], [2, 3, 3, 4],
  [2, 2, 3, 3], [4, 3, 6, 4], [2, 2, 3, 3], [2, 4, 3, 5], [2, 2, 3, 3], [4, 2, 6, 4],
];

const span =
  "[grid-column:span_var(--cm)] [grid-row:span_var(--rm)] lg:[grid-column:span_var(--cd)] lg:[grid-row:span_var(--rd)]";

type Vars = React.CSSProperties & Record<`--${string}`, number>;

export default function Loading() {
  return (
    <main className="min-h-screen bg-white text-black dark:bg-black dark:text-white">
      <section className="w-full px-2 pb-2 pt-14 sm:px-3 sm:pb-3 sm:pt-3">
        <div className="@container">
          <div className="grid auto-rows-[calc((100cqw-24px)/4)] grid-cols-4 gap-2 [grid-auto-flow:dense] lg:auto-rows-[calc((100cqw-88px)/12)] lg:grid-cols-12">
            {/* TÍTULO */}
            <div
              style={{ "--cm": 4, "--rm": 2, "--cd": 8, "--rd": 4 } as Vars}
              className={`${span} flex animate-pulse flex-col justify-end gap-3 rounded-2xl bg-black/15 p-5 dark:bg-white/20 sm:p-8`}
            >
              <div className="h-10 w-2/3 rounded-md bg-black/10 dark:bg-white/20 sm:h-16" />
              <div className="h-10 w-1/2 rounded-md bg-black/10 dark:bg-white/20 sm:h-16" />
            </div>

            {/* MÉTRICAS */}
            <div
              style={{ "--cm": 4, "--rm": 1, "--cd": 4, "--rd": 4 } as Vars}
              className={`${span} flex animate-pulse items-center justify-around gap-2 rounded-2xl bg-black/[0.06] px-4 dark:bg-white/[0.08] lg:flex-col lg:items-start lg:justify-center lg:gap-8 lg:px-8`}
            >
              {[0, 1, 2].map((n) => (
                <div key={n} className="space-y-2">
                  <div className="h-6 w-14 rounded bg-black/10 dark:bg-white/10 lg:h-10 lg:w-24" />
                  <div className="h-2 w-10 rounded bg-black/10 dark:bg-white/10" />
                </div>
              ))}
            </div>

            {/* FOTOS */}
            {CELLS.map(([cm, rm, cd, rd], i) => (
              <div
                key={i}
                style={{ "--cm": cm, "--rm": rm, "--cd": cd, "--rd": rd } as Vars}
                className={`${span} animate-pulse rounded-2xl bg-black/[0.06] dark:bg-white/[0.08]`}
              />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}