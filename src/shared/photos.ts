/**
 * Curated photo library for the demos.
 *
 * Each entry has a remote source (Unsplash, free to hotlink) and a local SVG
 * fallback shipped with the project. The <Photo /> component below swaps in
 * the fallback automatically if the remote image fails to load, so the demo
 * keeps working offline or behind a firewall.
 */

const u = (id: string, w = 1600) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

export interface PhotoEntry {
  src: string;
  fallback: string;
}

export const PHOTOS = {
  // Architecture / exteriors
  facade:   { src: u('photo-1486406146926-c627a92ad1ab'), fallback: './demo/facade.svg' },
  tower:    { src: u('photo-1449157291145-7efd050a4d0e'), fallback: './demo/facade.svg' },
  atrium:   { src: u('photo-1487958449943-2429e8be8625'), fallback: './demo/atrium.svg' },
  skyline:  { src: u('photo-1480714378408-67cf0d13bc1b'), fallback: './demo/rooftop.svg' },
  curves:   { src: u('photo-1493397212122-2b85dda8106b'), fallback: './demo/atrium.svg' },
  night:    { src: u('photo-1477959858617-67f85cf4f1df'), fallback: './demo/rooftop.svg' },

  // Interiors
  lobby:     { src: u('photo-1497366754035-f200968a6e72'), fallback: './demo/lobby.svg' },
  lounge:    { src: u('photo-1517502884422-41eaead166d4'), fallback: './demo/lounge.svg' },
  openspace: { src: u('photo-1497215728101-856f4ea42174'), fallback: './demo/openspace.svg' },
  office:    { src: u('photo-1497215842964-222b430dc094'), fallback: './demo/office.svg' },
  desk:      { src: u('photo-1524758631624-e2822e304c36'), fallback: './demo/office.svg' },
  coworking: { src: u('photo-1527192491265-7e15c55b1ed2'), fallback: './demo/openspace.svg' },

  // Meetings
  boardroom:  { src: u('photo-1568992687947-868a62a9f521'), fallback: './demo/conference.svg' },
  conference: { src: u('photo-1505409859467-3a796fd5798e'), fallback: './demo/conference.svg' },
  meeting:    { src: u('photo-1556761175-b413da4baf72'),    fallback: './demo/meeting.svg' },
  team:       { src: u('photo-1522071820081-009f0129c71c'), fallback: './demo/meeting.svg' },

  // Infrastructure
  parking:  { src: u('photo-1506521781263-d8422e82f27a'), fallback: './demo/parking.svg' },
  security: { src: u('photo-1557597774-9d273605dfa9'),    fallback: './demo/security.svg' },

  // Editorial / news
  news1: { src: u('photo-1454165804606-c3d57bc86b40', 1200), fallback: './demo/news-1.svg' },
  news2: { src: u('photo-1521737711867-e3b97375f902', 1200), fallback: './demo/news-2.svg' },
  news3: { src: u('photo-1600880292203-757bb62b4baf', 1200), fallback: './demo/news-3.svg' },
} satisfies Record<string, PhotoEntry>;

export type PhotoKey = keyof typeof PHOTOS;

/** Resolve a photo by key, falling back to the facade shot. */
export const photo = (key: PhotoKey): PhotoEntry => PHOTOS[key] ?? PHOTOS.facade;
