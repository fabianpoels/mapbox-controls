import { LngLat, Map } from 'mapbox-gl';
import BaseButton from '../base/button/Button';
import Picture from './Picture';

export type PicturePosition = [LngLat, LngLat, LngLat, LngLat]

export enum Cursor {
  Default = '',
  Move = 'move',
  Grabbing = 'grabbing',
}

export type OnUpdate = (position: PicturePosition) => void;

export class BaseMode {
  map: Map;
  picture: Picture;
  onUpdate: OnUpdate;
  static button: BaseButton;
  constructor(map: Map, picture: Picture, onUpdate: OnUpdate) {
    this.map = map;
    this.picture = picture;
    this.onUpdate = onUpdate;
  }
  destroy() {}
}

export enum Visibility {
  Visible= 'visible',
  None = 'none',
}
