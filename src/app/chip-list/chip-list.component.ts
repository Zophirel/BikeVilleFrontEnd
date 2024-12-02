import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'app-chip-list',
    templateUrl: './chip-list.component.html',
    styleUrls: ['./chip-list.component.scss'],
    imports: [CommonModule]
})
export class ChipListComponent implements OnInit {
  @Input() chipNames: string[] = []; // Input list of chip names
  selectedChips: boolean[] = []; // To track the selection state of each chip

  ngOnInit() {
    // Initialize the selection state based on the number of chips
    this.selectedChips = new Array(this.chipNames.length).fill(false);
  }

  toggleChipSelection(index: number) {
    this.selectedChips[index] = !this.selectedChips[index];
  }
}
