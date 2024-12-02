import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-navbar',
    imports: [],
    templateUrl: './navbar.component.html',
    styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  @Input() isStackedPage: boolean = false;
  @Input() isSearchPage: boolean = false;
}
