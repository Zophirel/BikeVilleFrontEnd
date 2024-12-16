import { Component,OnInit } from '@angular/core';
import { NavbarComponent } from '../../navbar/navbar.component';
import { RouterModule } from '@angular/router';


//npm install tw-elements
@Component({
  selector: 'app-about',
  standalone: true,
  imports: [NavbarComponent, RouterModule, NavbarComponent],
  templateUrl: './about.component.html',
  styleUrl: './about.component.css'
})
export class AboutComponent {
}
