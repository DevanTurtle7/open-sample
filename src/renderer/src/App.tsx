import { useState, useEffect } from 'react'
import Tile from './components/tile'

function App(): JSX.Element {
  const [audioMap, setAudioMap] = useState({})
  const [keysPressed, setKeysPressed] = useState<Set<string>>(new Set())

  useEffect(() => {
    const handleKeyDown = (event): void => {
      if (event.key in audioMap && !keysPressed.has(event.key)) {
        console.log(`Key pressed: "${event.key}"`)
        const { audio, startTime } = audioMap[event.key]
        audio.currentTime = startTime
        audio.play()
        setKeysPressed((prev) => new Set([...prev, event.key]))
      }
    }

    window.addEventListener('keypress', handleKeyDown)

    return (): void => {
      window.removeEventListener('keypress', handleKeyDown)
    }
  }, [audioMap, keysPressed, setKeysPressed])

  useEffect(() => {
    const handleKeyUp = (event): void => {
      console.log(`Key lifted: "${event.key}"`)

      if (event.key in audioMap) {
        const { audio } = audioMap[event.key]
        audio.pause()
        setKeysPressed((prev) => new Set([...prev].filter((x) => x != event.key)))
      }
    }

    window.addEventListener('keyup', handleKeyUp)

    return (): void => {
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [audioMap, keysPressed, setKeysPressed])

  const onAudioChange = (key: string, audio: HTMLAudioElement, startTime: number): void => {
    console.log(`setting audio with start time: ${startTime}`)
    setAudioMap({ ...audioMap, [key]: { audio, startTime: startTime } })
  }

  const deletePrevKey = (prevKey: string): void => {
    setAudioMap((prev) => {
      delete prev[prevKey]
      return prev
    })
  }

  const updateStartTime = (key: string, startTime: number): void => {
    if (key in audioMap) {
      setAudioMap({ ...audioMap, [key]: { ...audioMap[key], startTime } })
    }
  }

  console.log(audioMap)

  return (
    <>
      <h1>open sample</h1>
      <Tile
        onAudioChange={onAudioChange}
        deletePrevKey={deletePrevKey}
        updateStartTime={updateStartTime}
        keysPressed={keysPressed}
      />
      <Tile
        onAudioChange={onAudioChange}
        deletePrevKey={deletePrevKey}
        updateStartTime={updateStartTime}
        keysPressed={keysPressed}
      />
      <Tile
        onAudioChange={onAudioChange}
        deletePrevKey={deletePrevKey}
        updateStartTime={updateStartTime}
        keysPressed={keysPressed}
      />
    </>
  )
}

export default App
