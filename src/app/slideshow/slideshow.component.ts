import { Component, computed, inject, input } from '@angular/core';
import { PhotoData } from '../shared/interfaces/photo';
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonTitle,
  IonToolbar,
  ModalController,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { close } from 'ionicons/icons';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { concatMap, delay, from, of, switchMap } from 'rxjs';
import { SlideshowImageComponent } from './ui/slideshow-image.component';

@Component({
  selector: 'app-slideshow',
  template: `
    <ion-header>
      <ion-toolbar color="danger">
        <ion-title>Play</ion-title>
        <ion-buttons slot="end">
          <ion-button (click)="modalCtrl.dismiss()">
            <ion-icon name="close" slot="icon-only"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      @if (currentPhoto()?.safeResourceUrl; as safeResourceUrl) {
        <app-slideshow-image
          [safeResourceUrl]="safeResourceUrl"
        ></app-slideshow-image>
      }
    </ion-content>
  `,
  imports: [
    IonButton,
    IonButtons,
    IonContent,
    IonHeader,
    IonIcon,
    IonTitle,
    IonToolbar,
    SlideshowImageComponent,
  ],
})
export class SlideshowComponent {
  modalCtrl = inject(ModalController);
  photos = input.required<PhotoData[]>();

  reversedPhotos = computed(() => [...this.photos()].reverse());

  currentPhoto$ = toObservable(this.reversedPhotos).pipe(
    // Emit one photo at a time
    switchMap((photos) => from(photos)),
    concatMap((photo) =>
      // Creates a new stream for each individual photo
      of(photo).pipe(
        // Creating a new stream for each individual photo
        // will allow us to delay the start of the stream
        delay(500),
      ),
    ),
  );

  currentPhoto = toSignal(this.currentPhoto$);

  constructor() {
    addIcons({ close });
  }
}
