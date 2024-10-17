import { useEffect, useState } from 'react'

interface Props {
  onAudioChange: (key: string, audio: HTMLAudioElement, startTime: number) => void
  deletePrevKey: (prevKey: string) => void
  updateStartTime: (key: string, startTime: number) => void
  keysPressed: Set<string>
}

const Tile = ({
  onAudioChange,
  deletePrevKey,
  updateStartTime,
  keysPressed
}: Props): JSX.Element => {
  const [activationKey, setActivationKey] = useState<string>()
  const [audio, setAudio] = useState<HTMLAudioElement>()
  const [startTime, setStartTime] = useState<number>(0)

  useEffect(() => {
    if (audio != undefined && activationKey != undefined) {
      onAudioChange(activationKey, audio, startTime)
    }
  }, [audio, activationKey])

  const onKeyInputChange = (event): void => {
    setActivationKey(event.target.value.toLowerCase())

    if (activationKey != undefined) {
      deletePrevKey(activationKey)
    }
  }

  const onFileUpload = (event): void => {
    const url = URL.createObjectURL(event.target.files[0])
    const audio = new Audio(url)
    audio.load()
    setAudio(audio)
  }

  const onVolumeChange = (event): void => {
    if (audio != undefined) {
      audio.volume = event.target.value
    }
  }

  const onStartTimeChange = (event): void => {
    setStartTime(event.target.value)

    if (audio != undefined && activationKey != undefined) {
      console.log('updating start time')
      updateStartTime(activationKey, event.target.value)
    }
  }

  const getClassName = (): string => {
    let className = 'tile'

    if (activationKey != undefined && keysPressed.has(activationKey)) {
      className += ' tile-active'
    }

    return className
  }

  return (
    <div className={getClassName()}>
      <input type="text" maxLength={1} onChange={onKeyInputChange} />
      <input type="file" onChange={onFileUpload} />
      <input type="range" min={0} max={1} step={0.01} onChange={onVolumeChange} />
      <input type="number" min={0} onChange={onStartTimeChange} />
    </div>
  )
}

export default Tile
