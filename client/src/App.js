import { Routes, Route, Link, HashRouter, NavLink } from "react-router-dom";
import CharacterList from "./components/CharacterList";
import AdminPanel from "./components/AdminPanel";
import CharacterDetail from "./components/CharacterDetail";
import DarkModeToggle from "./components/DarkModeToggle";
import { DarkModeProvider } from "./contexts/DarkModeContext";

function App() {
  return (
    <DarkModeProvider>
      <HashRouter>
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 dark:text-white transition-colors duration-200">
          {/* Navigation */}
          <nav className="bg-gradient-to-r from-blue-600 to-purple-600 p-4">
            <div className="container mx-auto flex justify-between items-center">
              <Link to="/" className="flex items-center space-x-2">
                <span className="text-white text-xl font-bold">
                  Housamo Reviews
                </span>
              </Link>
              <div className="flex items-center space-x-6">
                <DarkModeToggle />
                {/* <NavLink
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
                </NavLink> */}
              </div>
            </div>
          </nav>

          {/* Main Content */}
          <main className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<CharacterList />} />
              <Route path="/housamovn" element={<AdminPanel />} />
              <Route path="/characters/:id" element={<CharacterDetail />} />
            </Routes>
          </main>

          {/* Footer */}
          <footer className="bg-gray-800 text-white py-8 mt-12 sticky">
            {/* Footer content remains unchanged */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="md:flex md:justify-between">
                <div className="mb-8 md:mb-0">
                  <h2 className="text-lg font-semibold">Housamo Reviews</h2>
                  <p className="mt-2 text-sm text-gray-400">
                    Trang tổng hợp Review được làm bởi Tokyo Afterschool
                    Summoners VN
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
                  {/*<div>
                    <h3 className="text-sm font-semibold tracking-wider uppercase">
                      Resources
                    </h3>
                    <ul className="mt-4 space-y-2">
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
                    </ul>
                  </div>*/}
                  <div>
                    <h3 className="text-sm font-semibold tracking-wider uppercase">
                      Community
                    </h3>
                    <ul className="mt-4 space-y-2">
                      <li>
                        <a
                          href="https://discord.gg/9Pg6AYEaym"
                          className="text-sm text-gray-400 hover:text-white"
                        >
                          Discord
                        </a>
                      </li>
                      {/*<li>
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
                      </li>*/}
                    </ul>
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
                  © {new Date().getFullYear()} HousamoVN Reviews. All rights
                  reserved.
                </p>
                <div className="mt-4 md:mt-0">
                  <p className="text-xs text-gray-500">
                    Đây là một dự án phi lợi nhuận không liên quan đến bất kỳ
                    công ty nào.
                  </p>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </HashRouter>
    </DarkModeProvider>
  );
}

export default App;
