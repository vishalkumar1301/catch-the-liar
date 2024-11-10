
import { useEffect } from "react";

export default function useTwitterWidgets() {
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (!("twttr" in window)) {
        const script = document.createElement("script");
        script.src = "https://platform.twitter.com/widgets.js";
        script.async = true;
        document.body.appendChild(script);

        script.onload = () => {
          // @ts-ignore
          if (window.twttr) {
            // @ts-ignore
            window.twttr.widgets.load();
          }
        };
      } else {
        // @ts-ignore
        window.twttr.widgets.load();
      }
    }
  }, []);
}
