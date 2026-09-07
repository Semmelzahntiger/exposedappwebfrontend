import { useState } from 'react'
import './App.css'

function extractVideoId(input: string): string | null {
  const trimmed = input.trim()
  // Bare numeric id
  if (/^\d+$/.test(trimmed)) return trimmed
  // .../video/1234567890123456789
  const match = trimmed.match(/\/video\/(\d+)/)
  if (match) return match[1]
  return null
}

function App() {
  const [url, setUrl] = useState('')
  const [videoId, setVideoId] = useState<string | null>(null)
  const [error, setError] = useState('')

  const load = () => {
    const id = extractVideoId(url)
    if (!id) {
      setError('Could not find a video id. Paste a full TikTok video URL or a numeric id.')
      setVideoId(null)
      return
    }
    setError('')
    setVideoId(id)
  }

  return (
    <div className="flex flex-col gap-3 items-center justify-start min-h-screen p-6">
      <div className="flex gap-2 items-center w-full max-w-xl">
        <input
          className="flex-1 border rounded px-2 py-1"
          type="text"
          value={url}
          placeholder="Paste TikTok video URL"
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && load()}
        />
        <button className="border rounded px-3 py-1" onClick={load}>
          Load
        </button>
      </div>

      {error && <p className="text-red-600 text-sm">{error}</p>}

      {videoId && (
        <iframe
          key={videoId}
          title="TikTok player"
          src={
            `https://www.tiktok.com/player/v1/${videoId}?` +
            'autoplay=1&muted=0&loop=1' +
            '&controls=1&progress_bar=0&play_button=1&volume_control=1&description=0' +
            '&fullscreen_button=0&timestamp=0&music_info=0&description=0&rel=0&native_context_menu=0'
          }
          width={325}
          height={575}
          allow="autoplay; fullscreen"
          style={{ border: 'none', borderRadius: 8 }}
        />
      )}
    </div>
  )
}

export default App
