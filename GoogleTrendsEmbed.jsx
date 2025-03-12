import React, { useEffect } from 'react';

const GoogleTrendsEmbed = () => {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://ssl.gstatic.com/trends_nrtr/4017_RC01/embed_loader.js";
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      if (window.trends) {
        window.trends.embed.renderExploreWidgetTo(
          document.getElementById("trends-widget"),
          "TIMESERIES",
          {
            comparisonItem: [{ keyword: "bitcoin", geo: "", time: "today 3-m" }],
            category: 0,
            property: "",
          },
          {
            exploreQuery: "date=today%203-m&q=bitcoin&hl=ko",
            guestPath: "https://trends.google.com:443/trends/embed/",
          }
        );
      }
    };
  }, []);

  return <div id="trends-widget" className="w-full h-96"></div>;
};

export default GoogleTrendsEmbed;
