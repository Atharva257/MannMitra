import { Link } from "react-router-dom";

function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-purple-50 flex flex-col">
      {/* Hero Section */}
      <header className="flex-1 flex flex-col items-center justify-center text-center px-6">
        <img
          src="public/MannMitra.png"
          alt="MannMitra Logo"
          className="w-20 h-20 mb-4"
        />
        <h1 className="text-4xl md:text-5xl font-bold text-blue-700 mb-4">
          Welcome to MannMitra 🌿
        </h1>
        <p className="text-lg text-gray-700 max-w-2xl mb-8">
          Your companion for mental well-being. Assess your mood, talk to our AI
          chatbot, stay connected with trusted contacts, and get help when you
          need it the most.
        </p>
        <div className="flex gap-4">
          <Link
            to="/register"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
          >
            Get Started
          </Link>
          <Link
            to="/login"
            className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition"
          >
            Login
          </Link>
        </div>
      </header>

      {/* Features Section */}
      <section className="py-12 px-6 bg-white shadow-inner">
        <h2 className="text-2xl font-bold text-center text-purple-700 mb-8">
          What You Can Do with MannMitra
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          <div className="bg-blue-50 p-6 rounded-xl shadow hover:shadow-lg transition">
            <h3 className="font-semibold text-blue-700 mb-2">📊 Assess Yourself</h3>
            <p className="text-gray-600">
              Take PHQ-9 assessments to track your mood and mental health over
              time.
            </p>
          </div>
          <div className="bg-green-50 p-6 rounded-xl shadow hover:shadow-lg transition">
            <h3 className="font-semibold text-green-700 mb-2">💬 Chat with AI</h3>
            <p className="text-gray-600">
              Talk to our AI-powered chatbot for support and guidance whenever
              you need it.
            </p>
          </div>
          <div className="bg-purple-50 p-6 rounded-xl shadow hover:shadow-lg transition">
            <h3 className="font-semibold text-purple-700 mb-2">🚨 Crisis Support</h3>
            <p className="text-gray-600">
              If things feel overwhelming, our crisis module connects you to
              helplines.
            </p>
          </div>
          <div className="bg-pink-50 p-6 rounded-xl shadow hover:shadow-lg transition">
            <h3 className="font-semibold text-pink-700 mb-2">👥 Trusted Contacts</h3>
            <p className="text-gray-600">
              Add people you trust and feel safe knowing they’re just a call
              away.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t mt-12 py-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between px-6">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <img
              src="public/MannMitra.png"
              alt="Logo"
              className="w-6 h-6"
            />
            <span className="text-gray-700 font-medium">
              MannMitra — Caring for Your Mind
            </span>
          </div>
          <div className="flex gap-6 text-gray-600 text-sm">
            <Link to="/about" className="hover:underline">About</Link>
            <Link to="/contact" className="hover:underline">Contact</Link>
            <Link to="/privacy" className="hover:underline">Privacy Policy</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
