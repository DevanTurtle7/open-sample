import { useState, useEffect } from 'react'
import * as Tone from 'tone'
import Tile from './components/Tile'

function App(): JSX.Element {
  const [audioMap, setAudioMap] = useState({})
  const [keysPressed, setKeysPressed] = useState<Set<string>>(new Set())

  useEffect(() => {
    Tone.loaded()
  }, [])

  useEffect(() => {
    const handleKeyDown = (event): void => {
      if (event.key in audioMap && !keysPressed.has(event.key)) {
        console.log(`Key pressed: "${event.key}"`)
        const { audio, startTime } = audioMap[event.key]
        audio.start(0, startTime)
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
        audio.stop()
        setKeysPressed((prev) => new Set([...prev].filter((x) => x != event.key)))
      }
    }

    window.addEventListener('keyup', handleKeyUp)

    return (): void => {
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [audioMap, keysPressed, setKeysPressed])

  const onAudioChange = (key: string, audio: Tone.Player, startTime: number): void => {
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

  const getTiles = (): JSX.Element[] => {
    const tiles: JSX.Element[] = []

    for (let i = 0; i < 16; i++) {
      tiles.push(
        <Tile
          onAudioChange={onAudioChange}
          deletePrevKey={deletePrevKey}
          updateStartTime={updateStartTime}
          keysPressed={keysPressed}
          key={`tile${i}`}
        />
      )
    }

    return tiles
  }

  return (
    <>
      <h1>open sample</h1>
      <div className="tiles-container">{getTiles()}</div>
    </>
  )
}

export default App
