import { photos } from '../../assets/photos';

/**
 * The places of the 360° tour. Names are in the translations (t.immersive.tour.scenes).
 *
 * TO ADD A REAL 360° PHOTO: save it as an equirectangular JPEG (twice as wide
 * as tall, about 4096 x 2048, under 1 MB) in frontend/public/tour/<id>.jpg and
 * set `image: '/tour/<id>.jpg'` below. Until then the viewer shows a drawn
 * stand-in marked "[360° PHOTO NEEDED]".
 */
export type TourSceneId = 'gate' | 'meeshsho' | 'gulanttaa' | 'lawn' | 'zigba';

export type TourScene = {
  id: TourSceneId;
  /** The 360° photograph, when there is one */
  image?: string;
  /** An ordinary photograph for the card that opens the view */
  card?: string;
};

export const TOUR_SCENES: TourScene[] = [
  { id: 'gate', card: photos.gate },
  { id: 'meeshsho', card: photos.meeshsho },
  { id: 'gulanttaa' },
  { id: 'lawn', card: photos.lawn },
  { id: 'zigba', card: photos.zigba },
];
