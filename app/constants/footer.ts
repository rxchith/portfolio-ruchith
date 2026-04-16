import { getPath } from "../utils/getPath";
import { FooterLink } from "../types";

export const FOOTER_LINKS: FooterLink[] = [
  {
    name: 'LinkedIn',
    hoverText: 'Connect with me',
    icon: getPath('icons/linkedin.svg'),
    url: 'https://www.linkedin.com/in/mohit-virli-4780b6112/',
  },
  {
    name: 'Behance',
    hoverText: 'Full Portfolio',
    icon: getPath('icons/behance.svg'),
    url: 'https://www.behance.net/ruchithramesh/projects',
  },
  {
    name: 'Spotify',
    hoverText: 'Curated playlists',
    icon: getPath('icons/spotify.svg'),
    url: 'https://open.spotify.com/user/21hr4w2hzp4ceidewwsb4bxoy',
  },
  {
    name: 'Instagram',
    hoverText: '@clevirli',
    icon: getPath('icons/instagram.svg'),
    url: 'https://www.instagram.com/clevirli/',
  },
  {
    name: 'Resume',
    hoverText: 'Download',
    icon: getPath('icons/file.svg'),
    url: getPath('Ruchith - Resume.pdf'),
  }
];