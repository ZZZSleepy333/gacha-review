import { Routes, Route, Link, NavLink, HashRouter } from "react-router-dom";
import CharacterList from "./components/CharacterList";
import AdminPanel from "./components/AdminPanel";
import CharacterDetail from "./components/CharacterDetail";

function App() {
  return (
    <HashRouter>
      <div className="min-h-screen bg-gray-100">
        {/* Navigation */}
        <nav className="bg-gradient-to-r from-blue-600 to-purple-600 p-4">
          <div className="container mx-auto flex justify-between items-center">
            <Link to="/" className="flex items-center space-x-2">
              <span className="text-white text-xl font-bold">
                Gacha Reviews
              </span>
            </Link>
            <div className="flex space-x-6">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `text-white hover:text-yellow-200 ${
                    isActive ? "font-bold underline" : ""
                  }`
                }
              >
                Home
              </NavLink>
              <NavLink
                to="/admin"
                className={({ isActive }) =>
                  `text-white hover:text-yellow-200 ${
                    isActive ? "font-bold underline" : ""
                  }`
                }
              >
                Admin
              </NavLink>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<CharacterList />} />
            <Route path="/admin" element={<AdminPanel />} />
            <Route path="/characters/:id" element={<CharacterDetail />} />
          </Routes>
        </main>

        {/* Footer */}
        <footer className="bg-gray-800 text-white py-8 mt-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="md:flex md:justify-between">
              <div className="mb-8 md:mb-0">
                <h2 className="text-lg font-semibold">Gacha Reviews</h2>
                <p className="mt-2 text-sm text-gray-400">
                  Your ultimate source for character analysis and reviews
                </p>
              </div>
              <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
                <div>
                  <h3 className="text-sm font-semibold tracking-wider uppercase">
                    Resources
                  </h3>
                  {/* <ul className="mt-4 space-y-2">
                    <li>
                      <a
                        href=""
                        className="text-sm text-gray-400 hover:text-white"
                      >
                        Guides
                      </a>
                    </li>
                    <li>
                      <a
                        href=""
                        className="text-sm text-gray-400 hover:text-white"
                      >
                        Tier Lists
                      </a>
                    </li>
                    <li>
                      <a
                        href=""
                        className="text-sm text-gray-400 hover:text-white"
                      >
                        Builds
                      </a>
                    </li>
                  </ul> */}
                </div>
                <div>
                  <h3 className="text-sm font-semibold tracking-wider uppercase">
                    Community
                  </h3>
                  {/* <ul className="mt-4 space-y-2">
                    <li>
                      <a
                        href=""
                        className="text-sm text-gray-400 hover:text-white"
                      >
                        Discord
                      </a>
                    </li>
                    <li>
                      <a
                        href=""
                        className="text-sm text-gray-400 hover:text-white"
                      >
                        Forums
                      </a>
                    </li>
                    <li>
                      <a
                        href=""
                        className="text-sm text-gray-400 hover:text-white"
                      >
                        Twitter
                      </a>
                    </li>
                  </ul> */}
                </div>
                <div>
                  <h3 className="text-sm font-semibold tracking-wider uppercase">
                    Legal
                  </h3>
                  {/* <ul className="mt-4 space-y-2">
                    <li>
                      <a
                        href=""
                        className="text-sm text-gray-400 hover:text-white"
                      >
                        Privacy
                      </a>
                    </li>
                    <li>
                      <a
                        href=""
                        className="text-sm text-gray-400 hover:text-white"
                      >
                        Terms
                      </a>
                    </li>
                    <li>
                      <a
                        href=""
                        className="text-sm text-gray-400 hover:text-white"
                      >
                        Cookie Policy
                      </a>
                    </li>
                  </ul> */}
                </div>
              </div>
            </div>
            <div className="mt-8 border-t border-gray-700 pt-8 md:flex md:items-center md:justify-between">
              <p className="text-sm text-gray-400">
                © {new Date().getFullYear()} Gacha Reviews. All rights reserved.
              </p>
              <div className="mt-4 md:mt-0">
                <p className="text-xs text-gray-500">
                  This is a fan-made site and is not affiliated with any game
                  company.
                </p>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </HashRouter>
  );
}

export default App;
