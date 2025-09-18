import { AvatarQuality } from '@heygen/streaming-avatar';

export const AVATARS = [
  {
    avatar_id: '02ff8a0894e044f09b2f6505e6db8108',
    name: 'Иван Белов',
  },
  {
    avatar_id: '57bdc431d0754ac9a4f9c5ea3234dee4',
    name: 'Валерия',
  },
  {
    avatar_id: 'fbfa00dd13d64e798fbf60a383856252',
    name: 'Валерия (СМ)',
  },
  {
    avatar_id: 'b2aa134b1f354f11890e7af4d2188a8f',
    name: 'Валерия (ПСБ)',
  },
  {
    avatar_id: 'Dexter_Doctor_Standing2_public',
    name: 'Dexter Doctor Standing',
  },
  {
    avatar_id: 'Ann_Therapist_public',
    name: 'Ann Therapist',
  },
  {
    avatar_id: 'Shawn_Therapist_public',
    name: 'Shawn Therapist',
  },
  {
    avatar_id: 'Bryan_FitnessCoach_public',
    name: 'Bryan Fitness Coach',
  },
  {
    avatar_id: 'Elenora_IT_Sitting_public',
    name: 'Elenora Tech Expert',
  },
];

export const QUALITIES = [
  { key: AvatarQuality.Low, label: 'Низкое' },
  { key: AvatarQuality.Medium, label: 'Среднее' },
  { key: AvatarQuality.High, label: 'Высокое' },
];

export const LANGUAGE_LIST = [
  { label: 'Русский', value: 'ru', key: 'ru' },
  { label: 'English', value: 'en', key: 'en' },
  { label: 'Spanish', value: 'es', key: 'es' },
  { label: 'Italian', value: 'it', key: 'it' },
  { label: 'German', value: 'de', key: 'de' },
  { label: 'French', value: 'fr', key: 'fr' },
];

export const KNOWLEDGE = [
  { key: '1', value: undefined, label: 'Без базы знаний' },
  { key: '2', value: 'f2fbd3bc5bfb4825abb0a21c23f785f4', label: 'СМ'},
  { key: '3', value: '24f2dcf7140642d2995913335c72b343', label: 'ПСБ' },
  { key: '4', value: 'caf755dd70604587940481eda9502bf2', label: 'РТК' },
];
