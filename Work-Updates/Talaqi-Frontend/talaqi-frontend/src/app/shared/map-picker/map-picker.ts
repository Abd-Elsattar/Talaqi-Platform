import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnDestroy,
  AfterViewInit,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import type { Map as MapLibreMap, LngLatLike } from 'maplibre-gl';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

interface SelectedLocation {
  latitude: number;
  longitude: number;
  address: string | null;
  city: string | null;
  governorate: string | null;
}

@Component({
  selector: 'app-map-picker',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './map-picker.html',
  styleUrls: ['./map-picker.css'],
})
export class MapPickerComponent implements AfterViewInit, OnDestroy {
  @Input() height = '350px';
  @Input() initialCenter: LngLatLike | null = null; // [lng, lat]
  @Input() initialZoom = 10;
  @Input() language = 'ar';
  @Output() locationSelected = new EventEmitter<SelectedLocation>();

  private map: MapLibreMap | null = null;
  private marker: maplibregl.Marker | null = null;
  private geolocateCtrl: maplibregl.GeolocateControl | null = null;
  @ViewChild('mapContainer', { static: true }) mapContainer!: ElementRef<HTMLDivElement>;

  ngAfterViewInit(): void {
    const container = this.mapContainer?.nativeElement;
    if (!container) return;

    this.map = new maplibregl.Map({
      container,
      style: {
        version: 8,
        sources: {
          osm: {
            type: 'raster',
            tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
            tileSize: 256,
            attribution: '© OpenStreetMap contributors',
          },
        },
        layers: [
          {
            id: 'osm-tiles',
            type: 'raster',
            source: 'osm',
            minzoom: 0,
            maxzoom: 19,
          },
        ],
      },
      center: this.initialCenter ?? [31.2357, 30.0444],
      zoom: this.initialZoom,
      attributionControl: { compact: true },
    });

    this.map.addControl(new maplibregl.NavigationControl({ visualizePitch: true }), 'top-right');
    this.map.addControl(new maplibregl.ScaleControl({ unit: 'metric' }));
    this.geolocateCtrl = new maplibregl.GeolocateControl({
      positionOptions: { enableHighAccuracy: true },
      trackUserLocation: false,
      showAccuracyCircle: false,
    });
    this.map.addControl(this.geolocateCtrl, 'top-right');

    this.geolocateCtrl.on('geolocate', (pos) => {
      const lat = Number(pos.coords.latitude.toFixed(6));
      const lng = Number(pos.coords.longitude.toFixed(6));

      if (this.marker) {
        this.marker.setLngLat([lng, lat]);
      } else {
        this.marker = new maplibregl.Marker({ color: '#0d6efd' })
          .setLngLat([lng, lat])
          .addTo(this.map!);
      }

      this.reverseGeocode(lat, lng, this.language).then((details) => {
        this.locationSelected.emit({
          latitude: lat,
          longitude: lng,
          address: details.address,
          city: details.city,
          governorate: details.governorate,
        });
      });
    });

    this.map.on('click', async (e) => {
      const lng = Number(e.lngLat.lng.toFixed(6));
      const lat = Number(e.lngLat.lat.toFixed(6));

      if (this.marker) {
        this.marker.setLngLat([lng, lat]);
      } else {
        this.marker = new maplibregl.Marker({ color: '#0d6efd' })
          .setLngLat([lng, lat])
          .addTo(this.map!);
      }

      const details = await this.reverseGeocode(lat, lng, this.language);
      this.locationSelected.emit({
        latitude: lat,
        longitude: lng,
        address: details.address,
        city: details.city,
        governorate: details.governorate,
      });
    });
  }

  ngOnDestroy(): void {
    if (this.marker) {
      this.marker.remove();
      this.marker = null;
    }
    if (this.map) {
      this.map.remove();
      this.map = null;
    }
  }

  private async reverseGeocode(
    lat: number,
    lng: number,
    lang: string
  ): Promise<{ address: string | null; city: string | null; governorate: string | null }> {
    try {
      const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&accept-language=${encodeURIComponent(
        lang
      )}&addressdetails=1`;
      const resp = await fetch(url, {
        headers: {
          'User-Agent': 'Talaqi-Platform/1.0 (map-picker)',
        },
      });
      if (!resp.ok) {
        return { address: null, city: null, governorate: null };
      }
      const data = await resp.json();
      const addr = data.address ?? {};

      const streetParts: string[] = [];
      if (addr.road) streetParts.push(addr.road);
      if (addr.neighbourhood) streetParts.push(addr.neighbourhood);
      if (addr.suburb) streetParts.push(addr.suburb);
      if (addr.quarter) streetParts.push(addr.quarter);
      const address = streetParts.length ? streetParts.join(', ') : null;

      const city = addr.city || addr.town || addr.village || addr.municipality || null;
      const governorate = addr.state || addr.region || addr.county || null;

      return { address, city, governorate };
    } catch {
      return { address: null, city: null, governorate: null };
    }
  }

  emitCenterSelection(): void {
    if (!this.map) return;
    const center = this.map.getCenter();
    const lng = Number(center.lng.toFixed(6));
    const lat = Number(center.lat.toFixed(6));

    if (this.marker) {
      this.marker.setLngLat([lng, lat]);
    } else {
      this.marker = new maplibregl.Marker({ color: '#0d6efd' })
        .setLngLat([lng, lat])
        .addTo(this.map);
    }

    this.reverseGeocode(lat, lng, this.language).then((details) => {
      this.locationSelected.emit({
        latitude: lat,
        longitude: lng,
        address: details.address,
        city: details.city,
        governorate: details.governorate,
      });
    });
  }
}
