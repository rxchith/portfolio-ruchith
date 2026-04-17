import * as THREE from "three";
import { WorkTimelinePoint } from "../types";

export const WORK_TIMELINE: WorkTimelinePoint[] = [
  {
    point: new THREE.Vector3(0, 0, 0),
    year: '2020 — 2024',
    title: 'National Institute of Engineering',
    subtitle: 'B.E. in Computer Science',
    position: 'right',
  },
  {
    point: new THREE.Vector3(2, 12, -15),
    year: '2024',
    title: 'Google UX Design',
    subtitle: 'Professional Specialization',
    position: 'left',
  },
  {
    point: new THREE.Vector3(-3, -12, -30),
    year: '2024 — 2025',
    title: 'The Bear House',
    subtitle: 'UI and Graphic Designer',
    position: 'right',
  },
  {
    point: new THREE.Vector3(1, 10, -45),
    year: '2025 — Present',
    title: 'Pluto',
    subtitle: 'Product Designer',
    position: 'left',
  },
  {
    point: new THREE.Vector3(-2, -15, -60),
    year: 'FUTURE',
    title: '????',
    subtitle: '????',
    position: 'right',
  }
];