import { Component, computed, input, output } from '@angular/core';
import {
  IonBadge,
  IonIcon,
  IonItem,
  IonItemOption,
  IonItemOptions,
  IonItemSliding,
  IonList,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { trash } from 'ionicons/icons';
import { PhotoData } from 'src/app/shared/interfaces/photo';

@Component({
  selector: 'app-photo-list',
  template: `
    <ion-list lines="none">
      @for (photo of photoList(); track photo.name) {
      <ion-item-sliding>
        <ion-item>
          <img [src]="photo.safeResourceUrl" />
          <ion-badge slot="end" color="light">
            {{ photo.daysAgo }}
          </ion-badge>
        </ion-item>
        <ion-item-options side="end">
          <ion-item-option (click)="delete.emit(photo.name)" color="danger">
            <ion-icon name="trash" slot="icon-only"></ion-icon>
          </ion-item-option>
        </ion-item-options>
      </ion-item-sliding>
      }
    </ion-list>
  `,
  imports: [
    IonBadge,
    IonIcon,
    IonItem,
    IonItemOption,
    IonItemOptions,
    IonItemSliding,
    IonList,
  ],
  styles: [``],
})
export class PhotoListComponent {
  photos = input.required<PhotoData[]>();
  delete = output<string>();

  photoList = computed(() =>
    this.photos().map((photo) => ({
      ...photo,
      daysAgo: this.calculateDaysAgo(photo.dateTaken),
    }))
  );

  constructor() {
    addIcons({ trash });
  }

  private calculateDaysAgo(date: string) {
    const now = new Date();
    const takenDate = new Date(date);
    const oneDayInMin = 24 * 60 * 60 * 1000;
    const diffDays = Math.round(
      Math.abs(takenDate.getTime() - now.getTime()) / oneDayInMin
    );

    if (diffDays === 0) {
      return 'today';
    } else if (diffDays === 1) {
      return 'yesterday';
    } else {
      return `${diffDays} days ago`;
    }
  }
}
