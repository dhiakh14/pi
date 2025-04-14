import { trigger, transition, style, animate } from '@angular/animations';

export const fadeAnimation = trigger('fadeAnimation', [
  transition(':enter', [
    style({ opacity: 0 }),  // Start with opacity 0
    animate('0.5s ease-in-out', style({ opacity: 1 }))  // Animate to opacity 1
  ]),
  transition(':leave', [
    style({ opacity: 1 }),  // Start with opacity 1
    animate('0.5s ease-in-out', style({ opacity: 0 }))  // Animate to opacity 0
  ])
]);
