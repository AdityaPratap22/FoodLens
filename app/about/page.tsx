export default function AboutPage() {
  return (
    <div className="page max-w-4xl mx-auto">
      <div className="text-center mb-12 animate-fade-in">
        <h1 className="hero-title text-4xl mb-4">About FoodLens</h1>
        <p className="text-zinc-400 font-light text-xl max-w-2xl mx-auto">
          An intelligent final-year project designed to make food nutrition transparent and accessible using computer vision and AI.
        </p>
      </div>

      <div className="space-y-6">
        <div className="card animate-fade-in">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-rose-500/10 text-rose-400 rounded-xl">🎯</div>
            <h2 className="text-xl font-bold text-white">Problem Statement</h2>
          </div>
          <p className="text-zinc-400 leading-relaxed font-light">
            Consumers often lack awareness about the nutritional quality of the food they consume, 
            especially packaged foods with hidden allergens and local street foods with zero labels. 
            Existing diet trackers are tedious or unsupported in the Indian context.
          </p>
        </div>

        <div className="card animate-fade-in" style={{ animationDelay: '100ms' }}>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl">💡</div>
            <h2 className="text-xl font-bold text-white">Proposed Solution</h2>
          </div>
          <p className="text-zinc-400 leading-relaxed font-light mb-4">
            FoodLens provides a streamlined, seamless interface for health tracking:
          </p>
          <ul className="grid sm:grid-cols-2 gap-3 text-sm font-medium text-zinc-300">
            <li className="flex items-center gap-2 p-3 bg-white/5 rounded-lg border border-white/5"><span className="text-emerald-400">✓</span> Barcode scanning for packaged items</li>
            <li className="flex items-center gap-2 p-3 bg-white/5 rounded-lg border border-white/5"><span className="text-emerald-400">✓</span> Deep learning for street food recognition</li>
            <li className="flex items-center gap-2 p-3 bg-white/5 rounded-lg border border-white/5"><span className="text-emerald-400">✓</span> Intuitive color-coded Health Score system</li>
            <li className="flex items-center gap-2 p-3 bg-white/5 rounded-lg border border-white/5"><span className="text-emerald-400">✓</span> Profile personalization with allergy alerts</li>
          </ul>
        </div>

        <div className="card animate-fade-in" style={{ animationDelay: '200ms' }}>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-blue-500/10 text-blue-400 rounded-xl">🧠</div>
            <h2 className="text-xl font-bold text-white">Technologies Used</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {["Next.js 16 App Router", "Tailwind CSS V4", "TypeScript", "ZXing Barcode API", "FastAPI (Python)", "MobileNetV2 CNN Model", "OpenFoodFacts API"].map(tech => (
              <span key={tech} className="px-3 py-1.5 bg-blue-500/10 text-blue-300 border border-blue-500/20 rounded-md text-sm font-semibold">
                {tech}
              </span>
            ))}
          </div>
        </div>

        <div className="card animate-fade-in" style={{ animationDelay: '300ms' }}>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-amber-500/10 text-amber-400 rounded-xl">🎓</div>
            <h2 className="text-xl font-bold text-white">Academic Relevance</h2>
          </div>
          <p className="text-zinc-400 leading-relaxed font-light">
            This project demonstrates practical application of modern full-stack web development, machine learning integration, and human-centered design for health-tech.
          </p>
        </div>
      </div>
    </div>
  );
}
