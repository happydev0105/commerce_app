import { Component, Input, OnInit } from '@angular/core';
import { ITraining } from 'src/app/core/interfaces/training.interface';

@Component({
  selector: 'app-video-player-card',
  templateUrl: './video-player-card.component.html',
  styleUrls: ['./video-player-card.component.scss'],
})
export class VideoPlayerCardComponent implements OnInit {
  @Input() video: ITraining;
  @Input() showDescription = true;
  constructor() { }

  ngOnInit() { }

}
