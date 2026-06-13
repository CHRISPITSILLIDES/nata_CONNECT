export const APP_ACTION_EVENT = 'nata-connect:action';

export function dispatchAppAction(action: string) {
  window.dispatchEvent(new CustomEvent(APP_ACTION_EVENT, { detail: action }));
}

export function subscribeToAppActions(handler: (action: string) => void) {
  const listener = (event: Event) => handler((event as CustomEvent<string>).detail);
  window.addEventListener(APP_ACTION_EVENT, listener);
  return () => window.removeEventListener(APP_ACTION_EVENT, listener);
}
