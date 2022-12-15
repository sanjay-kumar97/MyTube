import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.scss']
})
export class VideoComponent implements OnInit {

  id!: string;
  videoData: any;
  constructor(private route: ActivatedRoute, private api: ApiService) { }

  ngOnInit(): void {
    this.id = "" + this.route.snapshot.paramMap.get('id');
    this.videoData = this.api.readSpecificVideoData(this.id);
    console.log(this.videoData);
  }



}
