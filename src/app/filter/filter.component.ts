import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';
import { ChipListComponent } from '../chip-list/chip-list.component';

@Component({
    selector: 'app-filter',
    imports: [MatChipsModule, CommonModule, ChipListComponent],
    templateUrl: './filter.component.html',
    styleUrl: './filter.component.scss'
})
export class FilterComponent {
  isSelected: boolean = false;
  @Input() subcategories: string[] = ['sub1', 'sub2', 'sub3', 'sub4', 'sub5', 'sub6', 'sub7', 'sub8', 'sub9', 'sub10'];
  showFilters: boolean = false;
}
