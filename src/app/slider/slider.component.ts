import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { Product } from '../product/product.module';

@Component({
    selector: 'app-slider',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './slider.component.html',
    styleUrl: './slider.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SliderComponent implements OnInit, OnDestroy {

  @Input() data : Product[]  = [];

  currentInterval : any;
  sliderSelectedDot : number = 0;
  currentTitle: string = "";
  currentDescription: string = "";
  image : string = "";

  sliderInterval(){
    console.log(this.sliderSelectedDot);

    if(this.currentInterval){
      clearInterval(this.currentInterval);
    }
    
    this.currentInterval = setInterval(() => {
      if(this.sliderSelectedDot == this.data.length - 1){
        this.sliderSelectedDot = 0;
      } else {
        this.sliderSelectedDot += 1;
      }
      this.currentTitle = this.data[this.sliderSelectedDot].name;
      console.log("DESCRIZIONE");
      console.log(this.data[this.sliderSelectedDot].description); 
      
      this.currentDescription = this.data[this.sliderSelectedDot].description;
      this.image = this.data[this.sliderSelectedDot].largePhoto;
      
    }, 3000 );
  }

  ngOnInit() {
    this.sliderInterval();
  }

  ngOnDestroy(): void {
    clearInterval(this.currentInterval);
  }

  selectDot(index : number) {
    console.log(`index: ${index}`);
    this.sliderSelectedDot = index;
    this.currentTitle = this.data[this.sliderSelectedDot].name;
    this.currentDescription = this.data[this.sliderSelectedDot].description;
    this.sliderInterval();
  }
}
