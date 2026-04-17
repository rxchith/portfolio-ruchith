import { getPath } from "../utils/getPath";
import { FooterLink } from "../types";

export const FOOTER_LINKS: FooterLink[] = [
  {
    name: 'LinkedIn',
    hoverText: 'Connect with me',
    icon: getPath('icons/linkedin.svg'),
    url: 'https://linkedin.com/in/rxchith/',
  },
  {
    name: 'Behance',
    hoverText: 'Full Portfolio',
    icon: getPath('icons/behance.svg'),
    url: 'https://www.behance.net/ruchithramesh/projects',
  },
  {
    name: 'Spotify',
    hoverText: 'Check out my Playlists',
    icon: getPath('icons/spotify.svg'),
    url: 'https://open.spotify.com/user/31tzzis7gdhls2nxuvrupnopmxgm',
  },
  {
    name: 'Instagram',
    hoverText: '@rxchith',
    icon: getPath('icons/instagram.svg'),
    url: 'https://www.instagram.com/rxchith/',
  },
  {
    name: 'Resume',
    hoverText: 'Download Resume',
    icon: getPath('icons/file.svg'),
    url: getPath('Ruchith_Ramesh_Resume_Latest.pdf'),
  }
];