import sounds from '../assets/sounds.mp3'
import { Howl } from 'howler'
import { sprite } from '../assets/sounds.json'

const sound = new Howl({ src: [sounds], sprite })

export function play (id) {
  if (id) {
    sound.play(id)
  }
}
