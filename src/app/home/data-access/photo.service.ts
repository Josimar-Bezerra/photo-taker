import {
  computed,
  effect,
  inject,
  Injectable,
  linkedSignal,
  signal,
} from '@angular/core';
import { catchError, EMPTY, Subject, switchMap } from 'rxjs';
import { PhotoData } from 'src/app/shared/interfaces/photo';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  Camera,
  CameraResultType,
  CameraSource,
  ImageOptions,
  Photo,
} from '@capacitor/camera';
import { Platform } from '@ionic/angular';
import { DomSanitizer } from '@angular/platform-browser';
import { Directory, Filesystem } from '@capacitor/filesystem';
import { Capacitor } from '@capacitor/core';
import { StorageService } from 'src/app/shared/data-access/storage.service';

@Injectable({ providedIn: 'root' })
export class PhotoService {
  platform = inject(Platform);
  sanitizer = inject(DomSanitizer);
  storageService = inject(StorageService);

  options: ImageOptions = {
    quality: 50,
    width: 600,
    allowEditing: false,
    resultType: this.platform.is('capacitor')
      ? CameraResultType.Uri
      : CameraResultType.DataUrl,
    source: CameraSource.Camera,
  };

  loadedPhotos = this.storageService.loadedPhotos;

  photos = linkedSignal({
    source: this.loadedPhotos.value,
    computation: (photos) => photos ?? [],
  });

  photosWithSafeUrl = computed(() =>
    this.photos().map((photo) => ({
      ...photo,
      safeResourceUrl: this.sanitizer.bypassSecurityTrustUrl(photo.path),
    })),
  );

  hasTakenPhotoToday = computed(() =>
    this.photos().find(
      (photo) =>
        new Date().setHours(0, 0, 0, 0) ===
        new Date(photo.dateTaken).setHours(0, 0, 0, 0),
    )
      ? true
      : false,
  );

  add$ = new Subject<void>();

  constructor() {
    this.add$
      .pipe(
        switchMap(() => Camera.getPhoto(this.options)),
        switchMap((photo) => this.writeFile(photo)),
        catchError(() => EMPTY),
        takeUntilDestroyed(),
      )
      .subscribe(({ uniqueName, filePath, permanentFile }) =>
        this.photos.update((photos) => [
          ...photos,
          {
            name: uniqueName,
            path: permanentFile
              ? Capacitor.convertFileSrc(permanentFile.uri)
              : filePath!,
            dateTaken: new Date().toISOString(),
          } as PhotoData,
        ]),
      );

    effect(() => {
      const photos = this.photos();
      if (this.loadedPhotos.status() === 'resolved') {
        this.storageService.savePhotos(photos);
      }
    });
  }

  async writeFile(photo: Photo) {
    const uniqueName = Date.now().toString();

    if (this.platform.is('capacitor') && photo.path) {
      const photoOnFileSystem = await Filesystem.readFile({
        path: photo.path,
      });

      const filePath = uniqueName + '.jpeg';
      const permanentFile = await Filesystem.writeFile({
        data: photoOnFileSystem.data,
        path: filePath,
        directory: Directory.Data,
      });

      return { uniqueName, filePath, permanentFile };
    }

    return { uniqueName, filePath: photo.dataUrl };
  }
}
