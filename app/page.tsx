import Link from "next/link";

export default function HomePage() {
  return (
    <div className="page relative z-10 flex flex-col items-center justify-center min-h-[80vh]">
      <section className="hero">
        <h1 className="hero-title animate-fade-in inline-flex flex-col gap-2">
          <span>Understand Your Food</span>
          <span className="bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent">
            Like Never Before.
          </span>
        </h1>
        <p className="hero-subtitle max-w-2xl mx-auto">
          Uncover hidden nutrition, health impacts, and dietary risks instantly using AI barcode scanning, advanced image recognition, or manual input.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link href="/scan" className="primary-btn px-8 shadow-xl">
            Start Scanning
            <svg className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 5l7 7-7 7M5 5l7 7-7 7"></path></svg>
          </Link>
          <Link href="/profile" className="secondary-btn px-8">
            Set Health Profile
          </Link>
        </div>
      </section>

      <section className="grid md:grid-cols-3 gap-6 w-full max-w-5xl mt-12">
        <div className="card group hover:-translate-y-1">
          <div className="w-12 h-12 bg-white/5 rounded-xl border border-white/10 flex items-center justify-center text-2xl mb-4 group-hover:bg-emerald-500/20 transition-colors">📦</div>
          <h3 className="card-title text-xl">Barcode Scan</h3>
          <p className="card-text text-base">
            Instantly analyze packaged food using global databases to uncover hidden additives and allergens.
          </p>
        </div>

        <div className="card group hover:-translate-y-1">
          <div className="w-12 h-12 bg-white/5 rounded-xl border border-white/10 flex items-center justify-center text-2xl mb-4 group-hover:bg-blue-500/20 transition-colors">📷</div>
          <h3 className="card-title text-xl">AI Recognition</h3>
          <p className="card-text text-base">
            Identify local street food using deep learning. Just snap a picture to estimate its nutrition.
          </p>
        </div>

        <div className="card group hover:-translate-y-1">
          <div className="w-12 h-12 bg-white/5 rounded-xl border border-white/10 flex items-center justify-center text-2xl mb-4 group-hover:bg-rose-500/20 transition-colors">❤️</div>
          <h3 className="card-title text-xl">Health Score</h3>
          <p className="card-text text-base">
            Get an intuitive, color-coded health score that aligns with your daily dietary limitations.
          </p>
        </div>
      </section>
    </div>
  );
}
