import type { NavigateFunction, To, NavigateOptions } from 'react-router-dom';

export function navigateWithTransition(
  navigate: NavigateFunction,
  to: To | number,
  options?: NavigateOptions,
): void {
  const go = () => {
    if (typeof to === 'number') {
      navigate(to);
    } else {
      navigate(to, options);
    }
  };

  if (document.startViewTransition) {
    document.startViewTransition(go);
  } else {
    go();
  }
}
