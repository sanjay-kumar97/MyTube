import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HeaderComponent } from '../header/header.component';

@Component({
  providers: [HeaderComponent],
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.scss']
})
export class SearchResultsComponent implements OnInit, OnDestroy {

  constructor(private route: ActivatedRoute, private header: HeaderComponent) { }
  searchTerm!: String;

  ngOnInit(): void {
    this.searchTerm = "" + this.route.snapshot.paramMap.get('term');
  }

  ngOnDestroy(): void {
    this.header.clearSearchInput();
  }

}
