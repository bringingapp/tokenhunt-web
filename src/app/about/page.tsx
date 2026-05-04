import Header from "@/components/Header";
import Link from "next/link";

export default function AboutPage() {
  const features = [
    {
      title: "24/7 AI Token Scanner",
      icon: "🤖",
      description: "Our automated monitoring system watches Raydium, Orca, and Meteora for new token launches. Within 5 minutes of launch, we analyze 50+ risk factors to protect you from scams.",
      details: [
        "Contract analysis (Mint/Freeze authority)",
        "Liquidity lock status and duration",
        "Token distribution (Whale concentration)",
        "Social legitimacy verification"
      ]
    },
    {
      title: "Social Community Validation",
      icon: "👥",
      description: "AI is powerful, but human context is irreplaceable. Our community of expert 'Token Hunters' provides a second layer of defense through real-time voting and insights.",
      details: [
        "TikTok-style swiping interface",
        "Real-time consensus tracking",
        "Helpful community comment threads",
        "One-tap trading integration"
      ]
    },
    {
      title: "Reputation & Gamification",
      icon: "🏆",
      description: "We reward accuracy. Earn reputation points and rare badges by correctly identifying safe tokens and flagging rugs early.",
      details: [
        "Global and weekly leaderboards",
        "Daily check-in streaks",
        "Accuracy-based influencer levels",
        "Specialized badges for 'Rug Detectives'"
      ]
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-zinc-50 dark:bg-black font-sans text-black dark:text-white">
      <Header />
      <main className="flex-1 max-w-4xl mx-auto px-6 py-16">
        <section className="text-center mb-20">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-6">How TokenHunt Works</h1>
          <p className="text-xl text-zinc-600 dark:text-zinc-400">
            Dual-layer validation combining automated AI intelligence with the wisdom of the community.
          </p>
        </section>

        <div className="space-y-24">
          {features.map((feature, index) => (
            <div key={index} className={`flex flex-col md:flex-row gap-12 items-center ${index % 2 === 1 ? 'md:flex-row-reverse' : ''}`}>
              <div className="flex-1 space-y-6">
                <div className="text-5xl">{feature.icon}</div>
                <h2 className="text-3xl font-bold">{feature.title}</h2>
                <p className="text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  {feature.description}
                </p>
                <ul className="space-y-3">
                  {feature.details.map((detail, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full"></span>
                      <span className="text-zinc-700 dark:text-zinc-300">{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex-1 w-full h-64 bg-zinc-200 dark:bg-zinc-800 rounded-3xl flex items-center justify-center border border-zinc-300 dark:border-zinc-700">
                <span className="text-zinc-400 font-mono">[ Feature Illustration ]</span>
              </div>
            </div>
          ))}
        </div>

        <section className="mt-32 p-12 bg-black dark:bg-white text-white dark:text-black rounded-3xl text-center space-y-8">
          <h2 className="text-3xl font-bold">Ready to start the hunt?</h2>
          <p className="text-zinc-400 dark:text-zinc-600 max-w-md mx-auto">
            Join thousands of traders using TokenHunt to find the next gem without the fear of being rugged.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/feed" className="px-8 py-4 bg-white dark:bg-black text-black dark:text-white rounded-full font-bold transition-opacity hover:opacity-90">
              Go to Feed
            </Link>
            <Link href="/" className="px-8 py-4 border border-zinc-700 dark:border-zinc-300 rounded-full font-bold transition-colors hover:bg-zinc-800 dark:hover:bg-zinc-100">
              Back Home
            </Link>
          </div>
        </section>
      </main>
      <footer className="py-12 border-t border-zinc-200 dark:border-zinc-800 text-center text-zinc-500">
        © 2026 TokenHunt. All rights reserved.
      </footer>
    </div>
  );
}
