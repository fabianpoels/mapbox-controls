import { CircleLayer, FillLayer, GeoJSONSourceRaw, ImageSourceRaw, LineLayer, RasterLayer } from 'mapbox-gl';
import centroid from '@turf/centroid';
import type { Feature, FeatureCollection, Point, Polygon } from 'geojson';
import type { PicturePosition } from './types';

interface PictureOptions {
  id: string;
  url: string;
  width: number;
  height: number;
  position: PicturePosition;
}

class Picture {
  id: string;
  url: string;
  width: number;
  height: number;
  position: PicturePosition;
  locked: boolean;

  constructor(options: PictureOptions) {
    this.id = options.id;
    this.url = options.url;
    this.width = options.width;
    this.height = options.height;
    this.position = options.position;
    this.locked = false;
  }

  get coordinates() {
    return this.position.map((p) => [p.lng, p.lat]);
  }

  get asPolygon(): Feature<Polygon> {
    return {
      type: 'Feature',
      properties: { id: this.id },
      geometry: {
        type: 'Polygon',
        coordinates: [[...this.coordinates, this.coordinates[0]]],
      },
    };
  }

  get asPoints(): FeatureCollection<Point> {
    return {
      type: 'FeatureCollection',
      features: this.coordinates.map((point, i) => ({
        type: 'Feature',
        properties: { index: i },
        geometry: { type: 'Point', coordinates: point },
      })),
    };
  }

  get imageSource(): { id: string; source: ImageSourceRaw } {
    return {
      id: `${this.id}-raster`,
      source: { type: 'image', url: this.url, coordinates: this.coordinates },
    };
  }

  get polygonSource(): { id: string; source: GeoJSONSourceRaw } {
    return {
      id: `${this.id}-polygon`,
      source: { type: 'geojson', data: this.asPolygon },
    };
  }

  get asRasterLayer(): RasterLayer {
    return {
      id: `${this.id}-raster`,
      type: 'raster',
      source: this.imageSource.id,
      paint: { 'raster-fade-duration': 0, 'raster-opacity': 0.5 },
    };
  }

  get asFillLayer(): FillLayer {
    return ({
      id: `${this.id}-fill`,
      type: 'fill',
      source: this.polygonSource.id,
      paint: { 'fill-opacity': 0 },
    });
  }

  get asLineLayer(): LineLayer {
    return ({
      id: `${this.id}-contour`,
      type: 'line',
      source: `${this.id}-polygon`,
      layout: {
        'line-cap': 'round',
        'line-join': 'round',
      },
      paint: {
        'line-dasharray': [0.2, 2],
        'line-color': 'rgb(61, 90, 254)',
        'line-width': 2,
      },
    });
  }

  get asCircleLayer(): CircleLayer {
    return ({
      id: `${this.id}-circle`,
      type: 'circle',
      source: `${this.id}-polygon`,
      paint: {
        'circle-radius': 5,
        'circle-color': 'rgb(61, 90, 254)',
        'circle-stroke-width': 3,
        'circle-stroke-color': '#fff',
      },
    });
  }

  get centroid() {
    return centroid(this.asPolygon);
  }

  oppositePointTo(index: number): number {
    if (index === 0) return 2;
    if (index === 1) return 3;
    if (index === 2) return 0;
    if (index === 3) return 1;
    throw Error('invalid corner index');
  }
}

export default Picture;
