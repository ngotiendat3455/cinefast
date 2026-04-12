import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'

export default function Header() {
  const { user, accessToken, logout } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <header className="bg-zinc-900 border-b border-zinc-800 px-6 py-4">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <Link to="/" className="text-xl font-bold text-white tracking-tight">
          Cine<span className="text-yellow-400">Fast</span>
        </Link>

        <nav className="flex items-center gap-4">
          <Link
            to="/"
            className="text-sm text-zinc-300 hover:text-white transition-colors"
          >
            Discover
          </Link>
          {accessToken ? (
            <>
              <span className="text-sm text-zinc-400">
                {user?.name}
                <span className="ml-2 text-xs bg-zinc-700 text-zinc-300 px-2 py-0.5 rounded">
                  {user?.role}
                </span>
              </span>
              <Link
                to="/profile"
                className="text-sm text-zinc-300 hover:text-white transition-colors"
              >
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="text-sm bg-zinc-700 hover:bg-zinc-600 text-white px-3 py-1.5 rounded transition-colors"
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm text-zinc-300 hover:text-white transition-colors"
              >
                Sign in
              </Link>
              <Link
                to="/register"
                className="text-sm bg-yellow-400 hover:bg-yellow-300 text-black font-medium px-3 py-1.5 rounded transition-colors"
              >
                Register
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
