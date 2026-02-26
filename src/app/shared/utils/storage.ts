import { resource, ResourceRef } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

export function createStorage(ionicStorage: Storage, driver: any) {
  return resource({
    loader: async () => {
      const storage = await ionicStorage.create();
      storage.defineDriver(driver);
      return storage;
    },
  });
}

export function getFromStorage(
  storage: ResourceRef<Storage | undefined>,
  key: string,
  defaultValue?: any
) {
  return resource({
    params: () => storage.value(),
    loader: async ({ params }) => {
      const value = await params.get(key);
      return value ?? defaultValue;
    },
    defaultValue,
  });
}
