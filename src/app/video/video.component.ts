import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.scss']
})
export class VideoComponent implements OnInit {

  id!: string;
  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.id = "" + this.route.snapshot.paramMap.get('id');
  }

}
