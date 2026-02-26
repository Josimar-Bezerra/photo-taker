import { inject, Injectable, ResourceRef } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import * as CordovaSQLiteDriver from 'localforage-cordovasqlitedriver';
import { createStorage, getFromStorage } from '../utils/storage';
import { PhotoData } from '../interfaces/photo';

@Injectable({ providedIn: 'root' })
export class StorageService {
  ionicStorage = inject(Storage);

  storage = createStorage(this.ionicStorage, CordovaSQLiteDriver);
  loadedPhotos: ResourceRef<PhotoData[]> = getFromStorage(
    this.storage,
    'photos',
    [],
  );

  savePhotos(photos: PhotoData[]) {
    const storage = this.storage.value();

    if (!storage || !photos) return;
    storage.set('photos', photos);
  }
}
