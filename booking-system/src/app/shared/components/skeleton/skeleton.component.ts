import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-skeleton',
  standalone: true,
  template: `
    <div class="animate-pulse space-y-3" [class]="className">
      @if (showImage) {
        <div class="bg-gray-200 rounded-xl" [style.height.px]="imageHeight"></div>
      }
      @if (showTitle) {
        <div class="h-5 bg-gray-200 rounded w-3/4"></div>
      }
      @if (showText) {
        <div class="space-y-2">
          <div class="h-3 bg-gray-200 rounded"></div>
          <div class="h-3 bg-gray-200 rounded w-5/6"></div>
        </div>
      }
      @if (showAction) {
        <div class="h-10 bg-gray-200 rounded-lg w-full"></div>
      }
    </div>
  `,
})
export class SkeletonComponent {
  @Input() showImage = true;
  @Input() showTitle = true;
  @Input() showText = true;
  @Input() showAction = true;
  @Input() imageHeight = 192;
  @Input() className = '';
}
