import { Component, inject } from '@angular/core';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButton,
  IonButtons,
  IonIcon,
} from '@ionic/angular/standalone';
import { PhotoService } from './data-access/photo.service';
import { addIcons } from 'ionicons';
import { cameraOutline } from 'ionicons/icons';
import { PhotoListComponent } from './ui/photo-list.component';

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
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <app-photo-list
        [photos]="photoService.photosWithSafeUrl()"
      ></app-photo-list>
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
    PhotoListComponent,
  ],
})
export default class HomeComponent {
  photoService = inject(PhotoService);

  constructor() {
    addIcons({ cameraOutline });
  }
}
