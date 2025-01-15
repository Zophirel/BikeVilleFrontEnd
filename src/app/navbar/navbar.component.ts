import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-navbar',
    imports: [RouterModule],
    templateUrl: './navbar.component.html',
    styleUrl: './navbar.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarComponent {
  @Input() isStackedPage: boolean = false;
  @Input() isSearchPage: boolean = false;
  isUserLoggedIn: boolean = false;
  
  constructor(){
    if(localStorage.getItem('auth')){
      this.isUserLoggedIn = true;
    }
  }

}
