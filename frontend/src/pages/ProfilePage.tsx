import { useEffect, useState } from 'react'
import { useProfile } from '../hooks/useAuth'

export default function ProfilePage() {
  const { profile, isLoading, update } = useProfile()
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (profile) {
      setForm({ name: profile.name, email: profile.email, password: '' })
    }
  }, [profile])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const payload = {
      name: form.name || undefined,
      email: form.email || undefined,
      password: form.password || undefined,
    }
    update.mutate(payload, {
      onSuccess: () => {
        setSaved(true)
        setForm((f) => ({ ...f, password: '' }))
        setTimeout(() => setSaved(false), 3000)
      },
    })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <p className="text-zinc-400">Loading…</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-950 px-4 py-12">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold text-white mb-1">Profile</h1>
        <p className="text-zinc-400 text-sm mb-8">
          Role:{' '}
          <span className="text-zinc-300 font-medium">{profile?.role}</span>
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-zinc-300 mb-1">Full name</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full bg-zinc-800 border border-zinc-700 text-white rounded px-3 py-2 text-sm focus:outline-none focus:border-yellow-400"
            />
          </div>

          <div>
            <label className="block text-sm text-zinc-300 mb-1">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full bg-zinc-800 border border-zinc-700 text-white rounded px-3 py-2 text-sm focus:outline-none focus:border-yellow-400"
            />
          </div>

          <div>
            <label className="block text-sm text-zinc-300 mb-1">
              New password{' '}
              <span className="text-zinc-500">(leave blank to keep current)</span>
            </label>
            <input
              type="password"
              minLength={8}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full bg-zinc-800 border border-zinc-700 text-white rounded px-3 py-2 text-sm focus:outline-none focus:border-yellow-400"
              placeholder="••••••••"
            />
          </div>

          {update.isError && (
            <p className="text-red-400 text-sm">
              {update.error instanceof Error ? update.error.message : 'Update failed'}
            </p>
          )}

          {saved && (
            <p className="text-green-400 text-sm">Profile updated successfully.</p>
          )}

          <button
            type="submit"
            disabled={update.isPending}
            className="bg-yellow-400 hover:bg-yellow-300 disabled:opacity-50 text-black font-semibold px-5 py-2 rounded transition-colors"
          >
            {update.isPending ? 'Saving…' : 'Save changes'}
          </button>
        </form>
      </div>
    </div>
  )
}
