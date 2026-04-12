import { Link } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

export default function HomePage() {
  const { user, accessToken } = useAuthStore()

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-4">
          Cine<span className="text-yellow-400">Fast</span>
        </h1>
        <p className="text-zinc-400 mb-8 max-w-sm">
          Lightning-fast movie ticket booking with real-time seat selection.
        </p>

        {accessToken ? (
          <div className="space-y-2">
            <p className="text-zinc-300">
              Welcome back, <span className="text-white font-medium">{user?.name}</span>!
            </p>
            <Link
              to="/profile"
              className="inline-block mt-4 bg-yellow-400 hover:bg-yellow-300 text-black font-semibold px-6 py-2 rounded transition-colors"
            >
              View Profile
            </Link>
          </div>
        ) : (
          <div className="flex gap-3 justify-center">
            <Link
              to="/register"
              className="bg-yellow-400 hover:bg-yellow-300 text-black font-semibold px-6 py-2 rounded transition-colors"
            >
              Get started
            </Link>
            <Link
              to="/login"
              className="bg-zinc-800 hover:bg-zinc-700 text-white font-semibold px-6 py-2 rounded transition-colors"
            >
              Sign in
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
