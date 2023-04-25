import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import Player, { Options } from '@vimeo/player';
import { ITraining } from 'src/app/core/interfaces/training.interface';

@Component({
  selector: 'app-video-player',
  templateUrl: './video-player.component.html',
  styleUrls: ['./video-player.component.scss'],
})
export class VideoPlayerComponent implements OnInit, AfterViewInit {
  @ViewChild('videoPlayer', { static: false }) videoPlayer: ElementRef;

  @Input() video: ITraining;


  vimeoPlayer;

  constructor() { }

  ngOnInit() {

  }

  ngAfterViewInit(): void {
    this.initPlayer();
  }

  initPlayer() {
    const options: Options = {
      title: true,
      url: this.video.vimeoID,
      width: window.screen.width,
      responsive: true,
      loop: false,
      controls: this.video.isAvailable
    };
    this.vimeoPlayer = new Player(this.videoPlayer.nativeElement, options);

  }

}
