'use client';

import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://platform.twitter.com/widgets.js";
    script.async = true;
    script.charset = "utf-8";
    document.body.appendChild(script);
  }, []);

  return (
    <div
      dangerouslySetInnerHTML={{
        __html: `<blockquote class="twitter-tweet"><p lang="en" dir="ltr">M4 Mac Mini AI Cluster<br><br>Uses <a href="https://twitter.com/exolabs?ref_src=twsrc%5Etfw">@exolabs</a> with Thunderbolt 5 interconnect (80Gbps) to run LLMs distributed across 4 M4 Pro Mac Minis.<br><br>The cluster is small (iPhone for reference). It’s running Nemotron 70B at 8 tok/sec and scales to Llama 405B (benchmarks soon). <a href="https://t.co/9fx39IP4ZZ">pic.twitter.com/9fx39IP4ZZ</a></p>&mdash; Alex Cheema - e/acc (@alexocheema) <a href="https://twitter.com/alexocheema/status/1855238474917441972?ref_src=twsrc%5Etfw">November 9, 2024</a></blockquote>`,
      }}
    />
  );
}
