/* PluzBuzz offices, HQ first. `id` is the ISO 3166-1 numeric code the world-atlas country shapes are keyed by. */

export interface Office {
  code: string;
  country: string;
  city: string;
  id: string;
  /** [longitude, latitude] */
  ll: [number, number];
  tz: string;
  hub?: boolean;
}

export const OFFICES: Office[] = [
  { code: 'GB', country: 'United Kingdom', city: 'London', id: '826', ll: [-0.087, 51.5262], tz: 'Europe/London', hub: true },
  { code: 'IN', country: 'India', city: 'Mumbai', id: '356', ll: [72.8777, 19.076], tz: 'Asia/Kolkata' },
  { code: 'AE', country: 'United Arab Emirates', city: 'Dubai', id: '784', ll: [55.2708, 25.2048], tz: 'Asia/Dubai' },
  { code: 'US', country: 'United States', city: 'New York', id: '840', ll: [-74.006, 40.7128], tz: 'America/New_York' },
  { code: 'KE', country: 'Kenya', city: 'Nairobi', id: '404', ll: [36.8219, -1.2921], tz: 'Africa/Nairobi' },
  { code: 'UG', country: 'Uganda', city: 'Kampala', id: '800', ll: [32.5825, 0.3476], tz: 'Africa/Kampala' },
  { code: 'PL', country: 'Poland', city: 'Warsaw', id: '616', ll: [21.0122, 52.2297], tz: 'Europe/Warsaw' }
];
