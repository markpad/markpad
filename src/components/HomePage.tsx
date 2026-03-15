import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import {
  FaFileAlt,
  FaPalette,
  FaCode,
  FaShare,
  FaEye,
  FaArrowRight,
  FaGithub,
  FaMagic,
  FaRocket,
  FaCopy,
  FaWifi,
} from 'react-icons/fa'

/**
 * Home page - Landing page for Markpad
 */
export function HomePage() {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <Helmet>
        <title>Markpad - Programmable Markdown Documents</title>
        <meta
          name="description"
          content="Write markdown, use variables, apply themes, and generate dynamic documents instantly. Offline-first, no account required."
        />
      </Helmet>

      {/* Header / Navbar */}
      <header className="bg-gray-900/80 backdrop-blur-sm border-b border-gray-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-14">
          <div className="flex items-center gap-6">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5">
              <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg">
                <FaFileAlt className="text-white text-sm" />
              </div>
              <span className="text-white font-semibold text-lg">Markpad</span>
            </Link>

            {/* Nav Links */}
            <nav className="hidden sm:flex items-center gap-1">
              <Link
                to="/documents"
                className="px-3 py-1.5 text-sm text-gray-400 hover:text-white rounded-md hover:bg-gray-800 transition-colors"
              >
                Documents
              </Link>
              <Link
                to="/templates"
                className="px-3 py-1.5 text-sm text-gray-400 hover:text-white rounded-md hover:bg-gray-800 transition-colors"
              >
                Templates
              </Link>
              <Link
                to="/themes"
                className="px-3 py-1.5 text-sm text-gray-400 hover:text-white rounded-md hover:bg-gray-800 transition-colors"
              >
                Themes
              </Link>
            </nav>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-3">
            <a
              href="https://github.com/teles/marklab"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-gray-400 hover:text-white transition-colors"
            >
              <FaGithub className="text-lg" />
            </a>
            <Link
              to="/editor"
              className="px-4 py-1.5 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-md transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-blue-500/10 via-transparent to-transparent" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-blue-500/20 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-sm mb-8">
              <FaMagic className="text-xs" />
              <span>Offline-first · No account required</span>
            </div>

            {/* Headline */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              Markdown,
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                but programmable
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
              Write markdown. Add variables. Apply themes. Generate documents from templates and
              share them instantly — all from your browser.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                to="/editor"
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition-colors text-lg"
              >
                <FaRocket />
                Open Editor
              </Link>
              <Link
                to="/templates"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white font-semibold rounded-lg border border-gray-700 transition-colors text-lg"
              >
                <FaCopy />
                Browse Templates
              </Link>
            </div>
          </div>

          {/* Preview Image / Mockup */}
          <div className="mt-16 relative">
            <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-transparent to-transparent z-10 pointer-events-none" />
            <div className="bg-gray-900 rounded-xl border border-gray-800 shadow-2xl overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-3 bg-gray-800/50 border-b border-gray-700">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                </div>
                <div className="flex-1 text-center">
                  <span className="text-gray-500 text-sm">markpad.cc/editor</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-0 h-80">
                {/* Editor Side */}
                <div className="bg-gray-900 p-4 border-r border-gray-800 font-mono text-sm">
                  <div className="text-gray-500">---</div>
                  <div className="text-cyan-400">
                    client: <span className="text-orange-300">ACME Corp</span>
                  </div>
                  <div className="text-cyan-400">
                    date: <span className="text-orange-300">2026-03-15</span>
                  </div>
                  <div className="text-cyan-400">
                    amount: <span className="text-orange-300">4,500.00</span>
                  </div>
                  <div className="text-gray-500">---</div>
                  <div className="text-gray-500 mt-2" />
                  <div className="text-purple-400 mt-1"># Invoice</div>
                  <div className="text-gray-500 mt-2" />
                  <div className="text-gray-300">{'Client: {{client}}'}</div>
                  <div className="text-gray-300">{'Date: {{date}}'}</div>
                  <div className="text-gray-300">{'Total: ${{amount}}'}</div>
                  <div className="text-gray-500 mt-2" />
                  <div className="text-gray-300">Thank you for your business.</div>
                </div>
                {/* Preview Side */}
                <div className="bg-white p-6 text-gray-800">
                  <h1 className="text-3xl font-bold text-gray-900 mb-4">Invoice</h1>
                  <div className="space-y-1 text-gray-600 mb-6">
                    <p>
                      Client: <strong>ACME Corp</strong>
                    </p>
                    <p>
                      Date: <strong>2026-03-15</strong>
                    </p>
                    <p>
                      Total: <strong>$4,500.00</strong>
                    </p>
                  </div>
                  <p className="text-gray-600">Thank you for your business.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              A document engine in your browser
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Markdown simplicity meets programmable power. Variables, templates, themes, and
              sharing — all offline-first.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="p-6 bg-gray-900 rounded-xl border border-gray-800 hover:border-gray-700 transition-colors">
              <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center mb-4">
                <FaEye className="text-blue-400 text-xl" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Live Preview</h3>
              <p className="text-gray-400">
                See changes as you type. Variables resolve instantly in the preview pane — split
                view keeps source and output side by side.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 bg-gray-900 rounded-xl border border-gray-800 hover:border-gray-700 transition-colors">
              <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center mb-4">
                <FaCode className="text-purple-400 text-xl" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Variables</h3>
              <p className="text-gray-400">
                Define data in YAML frontmatter, reference it with {'{{mustache}}'} syntax. Loops,
                conditionals, and expressions built in.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 bg-gray-900 rounded-xl border border-gray-800 hover:border-gray-700 transition-colors">
              <div className="w-12 h-12 bg-fuchsia-500/10 rounded-lg flex items-center justify-center mb-4">
                <FaPalette className="text-fuchsia-400 text-xl" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Themes</h3>
              <p className="text-gray-400">
                30+ built-in themes — from minimalist to brutalist. Tailwind CSS under the hood, so
                you can customize anything.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-6 bg-gray-900 rounded-xl border border-gray-800 hover:border-gray-700 transition-colors">
              <div className="w-12 h-12 bg-orange-500/10 rounded-lg flex items-center justify-center mb-4">
                <FaCopy className="text-orange-400 text-xl" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Templates</h3>
              <p className="text-gray-400">
                Start from reusable templates — invoices, resumes, reports. Clone, customize, and
                generate documents in seconds.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="p-6 bg-gray-900 rounded-xl border border-gray-800 hover:border-gray-700 transition-colors">
              <div className="w-12 h-12 bg-cyan-500/10 rounded-lg flex items-center justify-center mb-4">
                <FaShare className="text-cyan-400 text-xl" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Instant Sharing</h3>
              <p className="text-gray-400">
                Generate a compressed URL that contains your entire document. No server, no account
                — just a link.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="p-6 bg-gray-900 rounded-xl border border-gray-800 hover:border-gray-700 transition-colors">
              <div className="w-12 h-12 bg-pink-500/10 rounded-lg flex items-center justify-center mb-4">
                <FaWifi className="text-pink-400 text-xl" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Offline-First</h3>
              <p className="text-gray-400">
                Everything runs in your browser. Documents are stored in IndexedDB — no server, no
                sync, no latency.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Start writing programmable documents
          </h2>
          <p className="text-gray-400 text-lg mb-10">
            No account required. Works instantly. Fully offline.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/editor"
              className="inline-flex items-center gap-2 px-8 py-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition-colors text-lg"
            >
              Open Editor
              <FaArrowRight />
            </Link>
            <Link
              to="/templates"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gray-800 hover:bg-gray-700 text-white font-semibold rounded-lg transition-colors text-lg border border-gray-700"
            >
              <FaCopy />
              Browse Templates
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-6 h-6 bg-gradient-to-br from-blue-500 to-blue-600 rounded">
                <FaFileAlt className="text-white text-xs" />
              </div>
              <span className="text-gray-400 text-sm">
                Markpad — Programmable Markdown Documents
              </span>
            </div>
            <div className="flex items-center gap-6 text-sm text-gray-500">
              <Link to="/editor" className="hover:text-gray-300 transition-colors">
                Editor
              </Link>
              <Link to="/templates" className="hover:text-gray-300 transition-colors">
                Templates
              </Link>
              <Link to="/themes" className="hover:text-gray-300 transition-colors">
                Themes
              </Link>
              <a
                href="https://github.com/teles/marklab"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gray-300 transition-colors"
              >
                GitHub
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default HomePage
