export {};

declare global {
  interface Window {
    twttr: {
      widgets: {
        load: () => void;
      };
      _e?: Array<() => void>;
    };
  }
} 