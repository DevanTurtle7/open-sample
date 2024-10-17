import { useEffect, useState } from 'react'
import * as Tone from 'tone'

interface Props {
  onAudioChange: (key: string, audio: Tone.Player, startTime: number) => void
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
  const [audio, setAudio] = useState<Tone.Player>()
  const [startTime, setStartTime] = useState<number>(0)
  const [volume, setVolume] = useState<number>(0)
  const [playbackRate, setPlaybackRate] = useState<number>(1)

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
    const player = new Tone.Player(url, () => {
      setAudio(player)
    }).toDestination()

    player.volume.value = volume
    player.playbackRate = playbackRate
  }

  const onVolumeChange = (event): void => {
    setVolume(Number(event.target.value))

    if (audio != undefined) {
      audio.volume.value = Number(event.target.value)
    }
  }

  const onStartTimeChange = (event): void => {
    setStartTime(Number(event.target.value))

    if (audio != undefined && activationKey != undefined) {
      console.log('updating start time')
      updateStartTime(activationKey, Number(event.target.value))
    }
  }

  const onSpeedChange = (event): void => {
    setPlaybackRate(Number(event.target.value))

    if (audio != undefined) {
      audio.playbackRate = Number(event.target.value)
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
      <input
        type="range"
        defaultValue={0}
        min={-20}
        max={20}
        step={0.01}
        onChange={onVolumeChange}
      />
      <input type="number" defaultValue={0} min={0} onChange={onStartTimeChange} />
      <input type="number" defaultValue={1} onChange={onSpeedChange} />
    </div>
  )
}

export default Tile
