export default function Loading() {
  return (
    <main className="min-h-screen bg-black text-white">

      {/* HERO SKELETON */}
      <section className="w-full px-4 sm:px-6 pt-4 pb-6">
        <div
          className="
            relative
            mx-auto
            max-w-7xl
            h-[45vh]
            min-h-[320px]
            max-h-[520px]
            overflow-hidden
            rounded-3xl
            border
            border-white/10
            bg-white/[0.03]
            animate-pulse
          "
        >
          <div className="absolute inset-0 bg-white/[0.04]" />

          <div className="absolute bottom-0 left-0 p-6 sm:p-10 lg:p-14 w-full">
            <div className="h-3 w-28 rounded-full bg-white/10" />

            <div className="mt-5 h-10 sm:h-14 w-3/4 max-w-2xl rounded-xl bg-white/10" />

            <div className="mt-5 h-4 w-full max-w-xl rounded-full bg-white/10" />

            <div className="mt-3 h-4 w-2/3 max-w-lg rounded-full bg-white/10" />
          </div>
        </div>
      </section>

      {/* PROFILE SKELETON */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div
          className="
            rounded-3xl
            border
            border-white/10
            bg-white/[0.03]
            p-6
            sm:p-8
            lg:p-10
            animate-pulse
          "
        >
          <div className="flex flex-col sm:flex-row items-center sm:items-center gap-8">

            {/* AVATAR */}
            <div className="h-28 w-28 sm:h-32 sm:w-32 shrink-0 rounded-full bg-white/10" />

            {/* INFO */}
            <div className="flex-1 w-full text-center sm:text-left">
              <div className="h-8 w-48 mx-auto sm:mx-0 rounded-lg bg-white/10" />

              <div className="mt-4 h-4 w-full max-w-2xl mx-auto sm:mx-0 rounded-full bg-white/10" />

              <div className="mt-3 h-4 w-64 mx-auto sm:mx-0 rounded-full bg-white/10" />
            </div>

          </div>
        </div>
      </section>

      {/* STATS SKELETON */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-5">

          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="
                h-28
                rounded-2xl
                border
                border-white/10
                bg-white/[0.03]
                animate-pulse
              "
            />
          ))}

        </div>
      </section>

      {/* TABS SKELETON */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="mx-auto h-12 w-full max-w-md rounded-full bg-white/[0.05] animate-pulse" />
      </section>

      {/* GALLERY SKELETON */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-20">

        <div className="columns-1 md:columns-2 xl:columns-3 gap-6">

          {Array.from({ length: 9 }).map((_, index) => (
            <div
              key={index}
              className="
                mb-6
                break-inside-avoid
                overflow-hidden
                rounded-3xl
                border
                border-white/10
                bg-white/[0.03]
                animate-pulse
              "
            >
              <div
                className={`
                  w-full
                  bg-white/[0.05]
                  ${
                    index % 3 === 0
                      ? "h-96"
                      : index % 3 === 1
                      ? "h-72"
                      : "h-80"
                  }
                `}
              />
            </div>
          ))}

        </div>

      </section>

    </main>
  );
}