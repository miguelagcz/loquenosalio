import Link from "next/link";

export function Footer() {
  return (
    <footer className="mx-auto mt-16 max-w-6xl border-t border-black/10 px-4 py-12 dark:border-white/10 sm:px-6">
      <h2 className="text-5xl font-bold uppercase leading-[0.95] tracking-tight sm:text-7xl">
        lo que no
        <br />
      salió bien
      </h2>

      <div className="mt-10 grid grid-cols-2 gap-8 text-xs font-bold uppercase tracking-wide sm:grid-cols-4">
        <div>
          <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-neutral-400 dark:text-neutral-600">
            archivo
          </p>
          <ul className="space-y-1.5 text-neutral-600 dark:text-neutral-400">
            <li>
              <Link href="/" className="hover:text-black dark:hover:text-white">
                fotos
              </Link>
            </li>
            <li>
              <Link href="/videos" className="hover:text-black dark:hover:text-white">
                videos
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-neutral-400 dark:text-neutral-600">
            contacto
          </p>
          <ul className="space-y-1.5 text-neutral-600 dark:text-neutral-400">
            <li>hola@miguelcruz.mx</li>
            <li>Ciudad de México</li>
          </ul>
        </div>

        <div className="col-span-2 sm:col-span-2">
          <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-neutral-400 dark:text-neutral-600">
            redes
          </p>
          <ul className="flex gap-4 text-neutral-600 dark:text-neutral-400">
            <li>
              <a href="#" className="hover:text-black dark:hover:text-white">
                instagram
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-black dark:hover:text-white">
                behance
              </a>
            </li>
          </ul>
        </div>
      </div>

      <p className="mt-10 text-[10px] font-bold uppercase tracking-wide text-neutral-400 dark:text-neutral-600">
        lo que no salió bien — miguel cruz, {new Date().getFullYear()}
      </p>
    </footer>
  );
}