export default function HomePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-20 text-center">
      <h1 className="text-5xl font-bold text-gray-900 mb-6">
        Find the perfect freelancer for your project
      </h1>
      <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
        Connect with skilled professionals. Post your project, receive bids, and get work done.
      </p>
      <div className="flex gap-4 justify-center">
        <a href="/post-project" className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors">
          Post a Project
        </a>
        <a href="/projects" className="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors">
          Browse Projects
        </a>
      </div>
    </div>
  )
}
