import type { Lang } from '../i18n';

export interface GalleryImage {
  src: string;
  width: number;
  height: number;
  alt: Record<Lang, string>;
}

export const galleryImages: GalleryImage[] = [
  {
    src: '/images/gallery/white-cane-street.jpg',
    width: 1080,
    height: 810,
    alt: {
      bg: 'Обучение по ориентиране и мобилност – придвижване с бял бастун по тактилна пътека в центъра на града',
      en: 'Orientation and mobility training – walking with a white cane along a tactile path in the city center',
    },
  },
  {
    src: '/images/gallery/braille-training-children.jpg',
    width: 1080,
    height: 810,
    alt: {
      bg: 'Деца се запознават с брайлова пишеща машина по време на обучение в центъра',
      en: 'Children exploring a Braille typewriter during a training session at the center',
    },
  },
  {
    src: '/images/gallery/computer-training-1.jpg',
    width: 1080,
    height: 810,
    alt: {
      bg: 'Обучение по компютърна грамотност – потребители работят с компютри и екранни четци',
      en: 'Computer literacy training – clients working with computers and screen readers',
    },
  },
  {
    src: '/images/gallery/computer-training-2.jpg',
    width: 1080,
    height: 810,
    alt: {
      bg: 'Група потребители в компютърната зала на центъра',
      en: 'A group of clients in the computer room of the center',
    },
  },
  {
    src: '/images/gallery/mobility-training-indoor.jpg',
    width: 1080,
    height: 810,
    alt: {
      bg: 'Дете се учи да заобикаля препятствия с бял бастун с помощта на обучител',
      en: 'A child learning to navigate around obstacles with a white cane, guided by a trainer',
    },
  },
  {
    src: '/images/gallery/white-cane-children.jpg',
    width: 1600,
    height: 1200,
    alt: {
      bg: 'Демонстрация на използването на бял бастун пред група деца',
      en: 'Demonstrating the use of a white cane to a group of children',
    },
  },
  {
    src: '/images/gallery/showdown-sport.jpg',
    width: 960,
    height: 720,
    alt: {
      bg: 'Спортна дейност – състезание по шоудаун (тенис на маса за незрящи)',
      en: 'Sports activity – a showdown match (table tennis for the blind)',
    },
  },
  {
    src: '/images/gallery/community-meeting-1.jpg',
    width: 1080,
    height: 810,
    alt: {
      bg: 'Среща на общността – потребители на центъра на празнично събитие',
      en: 'Community meeting – clients of the center at a festive event',
    },
  },
  {
    src: '/images/gallery/community-meeting-2.jpg',
    width: 1080,
    height: 810,
    alt: {
      bg: 'Групова снимка от събитие на фондацията',
      en: 'Group photo from a foundation event',
    },
  },
  {
    src: '/images/gallery/office-visit.jpg',
    width: 1440,
    height: 1920,
    alt: {
      bg: 'Посещение в офиса на фондацията',
      en: 'A visit to the foundation office',
    },
  },
  {
    src: '/images/gallery/kindness-poster.jpg',
    width: 1080,
    height: 810,
    alt: {
      bg: 'Плакат, изработен от деца: „Доброто – езикът, който глухите могат да чуят и който слепите могат да видят“',
      en: 'A poster made by children: "Kindness – the language the deaf can hear and the blind can see"',
    },
  },
];
