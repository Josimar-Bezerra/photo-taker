import { afterNextRender, Component, inject, signal } from '@angular/core';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButton,
  IonButtons,
  IonIcon,
  IonModal,
} from '@ionic/angular/standalone';
import { PhotoService } from './data-access/photo.service';
import { addIcons } from 'ionicons';
import { cameraOutline, play } from 'ionicons/icons';
import { PhotoListComponent } from './ui/photo-list.component';
import { SlideshowComponent } from '../slideshow/slideshow.component';

@Component({
  selector: 'app-home',
  template: `
    <ion-header>
      <ion-toolbar color="danger">
        <ion-title>Snapaday</ion-title>
        <ion-buttons slot="end">
          <ion-button
            (click)="photoService.add$.next()"
            [disabled]="photoService.hasTakenPhotoToday()"
          >
            <ion-icon name="camera-outline" slot="icon-only"></ion-icon>
          </ion-button>
          <ion-button (click)="modalIsOpen.set(true)">
            <ion-icon name="play" slot="icon-only"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <app-photo-list
        [photos]="photoService.photosWithSafeUrl()"
        (delete)="photoService.remove$.next($event)"
      ></app-photo-list>
      <ion-modal
        [isOpen]="modalIsOpen()"
        [canDismiss]="true"
        [presentingElement]="presentingElement()"
        (ionModalDidDismiss)="modalIsOpen.set(false)"
      >
        <ng-template>
          <app-slideshow
            [photos]="photoService.photosWithSafeUrl()"
          ></app-slideshow>
        </ng-template>
      </ion-modal>
    </ion-content>
  `,
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButton,
    IonButtons,
    IonIcon,
    IonModal,
    PhotoListComponent,
    SlideshowComponent,
  ],
})
export default class HomeComponent {
  photoService = inject(PhotoService);
  modalIsOpen = signal(false);

  presentingElement = signal<HTMLElement | null>(null);

  constructor() {
    addIcons({ cameraOutline, play });

    afterNextRender(() => {
      this.presentingElement.set(document.querySelector('.ion-page'));
    });
  }
}
