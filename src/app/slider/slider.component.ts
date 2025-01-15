import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { Product } from '../product/product.module';
import { ChangeDetectorRef } from '@angular/core';
import { CacheService } from '../services/cache/cache.service';

@Component({
    selector: 'app-slider',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './slider.component.html',
    styleUrl: './slider.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SliderComponent implements  OnDestroy, OnChanges{

  @Input() data : Product[]  = [];

  currentInterval : any;
  sliderSelectedDot : number = 0;
  currentTitle: string = "";
  currentDescription: string = "";
  image : string = "";

  constructor(private cdRef : ChangeDetectorRef, private cacheService: CacheService) {
    if(this.cacheService.has("homeProducts")){
      
      this.data = this.cacheService.get("sliderSelectedDot")!;
    }
    this.sliderInterval();
  }

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

      this.currentDescription = this.data[this.sliderSelectedDot].description;
      this.image = this.data[this.sliderSelectedDot].largePhoto;
      this.cdRef.detectChanges();
    
    }, 1500 );

  }

  ngOnChanges(_: SimpleChanges): void {
    if(this.sliderSelectedDot == this.data.length - 1){
      this.sliderSelectedDot = 0;
    } else {
      this.sliderSelectedDot += 1;
    }
    this.currentTitle = this.data[this.sliderSelectedDot].name;

    this.currentDescription = this.data[this.sliderSelectedDot].description;
    this.image = this.data[this.sliderSelectedDot].largePhoto;
    this.cdRef.detectChanges();
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
