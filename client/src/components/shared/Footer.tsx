import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">FM</span>
              </div>
              <span className="font-bold text-white text-lg">FreelanceMarket</span>
            </div>
            <p className="text-sm leading-relaxed max-w-xs">
              Connecting talented freelancers with clients who need great work done.
            </p>
          </div>

          {/* For Clients */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-4">For Clients</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/post-project" className="hover:text-white transition-colors">Post a Project</Link></li>
              <li><Link to="/projects" className="hover:text-white transition-colors">Browse Freelancers</Link></li>
              <li><Link to="/dashboard" className="hover:text-white transition-colors">Dashboard</Link></li>
            </ul>
          </div>

          {/* For Freelancers */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-4">For Freelancers</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/projects" className="hover:text-white transition-colors">Find Work</Link></li>
              <li><Link to="/dashboard" className="hover:text-white transition-colors">My Projects</Link></li>
              <li><Link to="/profile" className="hover:text-white transition-colors">My Profile</Link></li>
            </ul>
          </div>

        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-sm text-center">
          © {new Date().getFullYear()} FreelanceMarket. All rights reserved.
        </div>
      </div>
    </footer>
  )
}