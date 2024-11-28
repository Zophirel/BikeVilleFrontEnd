import { Component, input, Input } from '@angular/core';

@Component({
  selector: 'app-product-tile',
  standalone: true,
  imports: [],
  templateUrl: './product-tile.component.html',
  styleUrl: './product-tile.component.css'
})

export class ProductTileComponent {
  @Input() image : string = "";
  @Input() title : string = "";
  @Input() price : number = 0;
}
