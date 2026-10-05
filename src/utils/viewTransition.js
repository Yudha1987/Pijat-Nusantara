export const VT =
  typeof document !== 'undefined' &&
  typeof document.startViewTransition === 'function'
    ? { viewTransition: true }
    : null