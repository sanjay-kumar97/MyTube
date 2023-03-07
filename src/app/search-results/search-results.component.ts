import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { ApiService } from '../services/api.service';

@Component({
  providers: [HeaderComponent],
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.scss']
})
export class SearchResultsComponent implements OnInit, OnDestroy {

  constructor(private route: ActivatedRoute, private header: HeaderComponent, private router: Router, private api: ApiService) { }
  searchTerm!: String;
  loader: boolean = true;
  videoData: any;
  videoArr!: Array<any>;
  userData: any;

  ngOnInit(): void {
    this.searchTerm = "" + this.route.snapshot.paramMap.get('term');
    this.router.routeReuseStrategy.shouldReuseRoute = () => { return false; };
    console.log("Searched: ", this.searchTerm);
    this.videoData = this.api.readVideoData();
    this.userData = this.api.readUserData();
    setTimeout(() => this.getVideosToDisplay(this.searchTerm), 1000);
  }

  getVideosToDisplay(title: any) {
    console.log(title, this.videoData);
    let keys = Object.keys(this.videoData);
    this.videoArr = new Array<any>;
    for (let i = 0; i < keys.length; i++) {
      if ((this.videoData[keys[i]].title.toLowerCase()).includes(title.toLowerCase())) {
        console.log('YESSS', this.videoData[keys[i]].title);
        this.videoData[keys[i]].time = this.findTime(this.videoData[keys[i]].time);
        this.videoArr.push(this.videoData[keys[i]]);
      } else {
        console.log('NOOOO', this.videoData[keys[i]].title);
      }
    }
    setTimeout(() => this.loader = false, 2000);
  }

  ngOnDestroy(): void {
    // this.header.clearSearchInput();
    this.ngOnInit();
  }


  findTime(prevDate: any) {
    var currDate = new Date().getTime();
    var result;
    console.log({ prevDate, currDate });
    var diffInMs = getDifferenceInMs(prevDate, currDate);
    var seconds = Math.floor(diffInMs / 1000);
    var minutes = Math.floor(seconds / 60);
    var hours = Math.floor(minutes / 60);
    var days = Math.floor(hours / 24);
    var weeks = Math.floor(days / 7);
    var months = Math.floor(days / 30);
    var years = Math.floor(months / 12);
    console.log({ years, months, weeks, days, hours, minutes, seconds });
    if (years != 0) {
      result = years + " ";
      result += (years == 1) ? "year" : "years";
    } else if (months != 0) {
      result = months + " ";
      result += (months == 1) ? "month" : "months";
    } else if (weeks != 0) {
      result = weeks + " ";
      result += (weeks == 1) ? "week" : "weeks";
    } else if (days != 0) {
      result = days + " ";
      result += (days == 1) ? "day" : "days";
    } else if (hours != 0) {
      result = hours + " ";
      result += (hours == 1) ? "hour" : "hours";
    } else if (minutes != 0) {
      result = minutes + " ";
      result += (minutes == 1) ? "minute" : "minutes";
    } else {
      result = seconds + " ";
      result += (seconds == 1) ? "second" : "seconds";
    }
    console.log('Final', result);

    function getDifferenceInMs(date1: number, date2: number) {
      const diffInMs = Math.abs(date2 - date1);
      return diffInMs;
    }

    return result;
  }
}
