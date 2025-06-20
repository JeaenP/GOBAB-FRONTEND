import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent implements OnInit {

  constructor(private router: Router) {}

  navigateTo(event: Event) {
    const path = (event.target as HTMLSelectElement).value;
    this.router.navigateByUrl(path);
  }

  ngOnInit(): void {
    
  }

}
