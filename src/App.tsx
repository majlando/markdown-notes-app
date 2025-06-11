import { useState, useEffect } from 'react'
import { Sidebar } from './components/Sidebar'
import { Editor } from './components/Editor'
import { Welcome } from './components/Welcome'
import { useNoteStore } from './store/useNoteStore'
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts'

export default function App() {
  const { notes, showWelcome, dismissWelcome } = useNoteStore()
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useKeyboardShortcuts()

  if (!isClient) {
    return null // Avoid hydration mismatch
  }

  return (
    <div className="h-screen flex bg-gray-100">
      <Sidebar />
      <Editor />
      {showWelcome && <Welcome />}
    </div>
  )
}
