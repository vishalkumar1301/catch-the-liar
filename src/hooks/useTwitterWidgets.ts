import { useEffect } from 'react';

export default function useTwitterWidgets() {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (!window.twttr) {
        const script = document.createElement('script');
        script.src = 'https://platform.twitter.com/widgets.js';
        script.async = true;
        
        script.onload = () => {
          if (window.twttr) {
            window.twttr.widgets.load();
          }
        };

        document.body.appendChild(script);
      } else {
        window.twttr.widgets.load();
      }
    }
  }, []);
}
