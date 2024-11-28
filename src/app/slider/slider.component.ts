import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-slider',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './slider.component.html',
  styleUrl: './slider.component.css'
})
export class SliderComponent implements OnInit {
  sliderImages : any = [
    {title : "Title1", description : "Description1", image : "assets/slider/1.webp"}, 
    {title : "Title2", description : "Description2", image : "assets/slider/2.webp"}, 
    {title : "Title3", description : "Description3", image : "assets/slider/3.webp"}
  ];

  currentInterval : any;
  sliderSelectedDot : number = 0;
  currentTitle: string = this.sliderImages[0].title;
  currentDescription: string = this.sliderImages[0].description;

  sliderInterval(){
    console.log(this.sliderSelectedDot);

    if(this.currentInterval){
      clearInterval(this.currentInterval);
    }
    
    this.currentInterval = setInterval(() => {
      if(this.sliderSelectedDot == this.sliderImages.length - 1){
        this.sliderSelectedDot = 0;
      } else {
        this.sliderSelectedDot += 1;
      }
      this.currentTitle = this.sliderImages[this.sliderSelectedDot].title;
      this.currentDescription = this.sliderImages[this.sliderSelectedDot].description;
    }, 3000 );
  }

  ngOnInit() {
    this.sliderInterval();
  }

  selectDot(index : number) {
    console.log(`index: ${index}`);
    this.sliderSelectedDot = index;
    this.currentTitle = this.sliderImages[this.sliderSelectedDot].title;
    this.currentDescription = this.sliderImages[this.sliderSelectedDot].description;
    this.sliderInterval();
  }
}
