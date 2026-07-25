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
    name: 'Resume',
    hoverText: 'Download Resume',
    icon: getPath('icons/file.svg'),
    url: getPath('Ruchith_Ramesh_Product_Designer.pdf'),
  }
];