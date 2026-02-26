import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-slideshow-image',
  template: `
    <div class="image-container">
      <img [src]="safeResourceUrl()" />
    </div>
  `,
  styles: [
    `
      .image-container {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        display: flex;
        justify-content: center;
        align-items: center;

        img {
          width: 100%;
          height: auto;
          vertical-align: middle;
        }
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SlideshowImageComponent {
  safeResourceUrl = input.required<SafeResourceUrl>();
}
