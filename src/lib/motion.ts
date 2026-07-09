// Shared motion constants so every interactive effect (cursor, tilt, magnetic,
// reveals) moves with the same feel. Tune here, not per-component.

/** Snappy spring for cursor-following elements (magnetic, tilt, cursor ring). */
export const SPRING_SNAPPY = { stiffness: 200, damping: 15, mass: 0.2 } as const;

/** Softer spring for larger surfaces (3D card tilt) so panels don't jitter. */
export const SPRING_SOFT = { stiffness: 140, damping: 18, mass: 0.3 } as const;

/** The site-wide reveal ease — same curve `Reveal`/section variants use. */
export const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];
