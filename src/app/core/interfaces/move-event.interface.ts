import { Position } from './position.interface';

export interface MoveEvent {
  delta: Position;
  distance: Position;
  pointerPosition?: Position
  id: string;
}
