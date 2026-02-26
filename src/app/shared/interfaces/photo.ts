import { SafeResourceUrl } from '@angular/platform-browser';

export interface PhotoData {
  name: string;
  path: string;
  dateTaken: string;
  safeResourceUrl: SafeResourceUrl | undefined;
}
