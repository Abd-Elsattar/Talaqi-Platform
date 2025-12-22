// ImageUrlService: Utility for composing and retrieving absolute image URLs.
// Centralizes logic to convert backend media paths into safe, cacheable URLs
// used across item cards, profiles, and assistant sources.

import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ImageUrlService {
  private readonly baseUrl = environment.apiUrl.replace('/api', '');

  resolve(imageUrl?: string): string {
    if (!imageUrl) {
      return '/images/lost-and-found-.png';
    }

    if (imageUrl.startsWith('http')) {
      return imageUrl;
    }

    if (imageUrl.startsWith('/')) {
      return this.baseUrl + imageUrl;
    }

    return `${this.baseUrl}/uploads/${imageUrl}`;
  }
}
