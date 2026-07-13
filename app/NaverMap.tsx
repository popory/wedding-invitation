"use client";

import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    naver?: any;
  }
}

const NAVER_MAP_CLIENT_ID = "06o9zzzecf";
const VENUE_ADDRESS = "서울특별시 강남구 선릉로 757";

export function NaverMap() {
  const mapElement = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const initializeMap = () => {
      if (!mapElement.current || !window.naver?.maps) return;

      window.naver.maps.Service.geocode(
        { query: VENUE_ADDRESS },
        (status: number, response: any) => {
          if (status !== window.naver.maps.Service.Status.OK || !response.v2.addresses[0]) {
            setFailed(true);
            return;
          }

          const venue = response.v2.addresses[0];
          const position = new window.naver.maps.LatLng(Number(venue.y), Number(venue.x));
          const map = new window.naver.maps.Map(mapElement.current, {
            center: position,
            zoom: 17,
            zoomControl: true,
            zoomControlOptions: {
              position: window.naver.maps.Position.TOP_RIGHT,
            },
          });

          const marker = new window.naver.maps.Marker({ position, map });
          const infoWindow = new window.naver.maps.InfoWindow({
            content: '<div class="naverMapLabel"><strong>더채플앳 청담</strong><span>6층 채플홀</span></div>',
          });
          infoWindow.open(map, marker);
        },
      );
    };

    if (window.naver?.maps?.Service) {
      initializeMap();
      return;
    }

    const existingScript = document.querySelector<HTMLScriptElement>("script[data-naver-map]");
    if (existingScript) {
      existingScript.addEventListener("load", initializeMap, { once: true });
      return () => existingScript.removeEventListener("load", initializeMap);
    }

    const script = document.createElement("script");
    script.dataset.naverMap = "true";
    script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${NAVER_MAP_CLIENT_ID}&submodules=geocoder`;
    script.async = true;
    script.addEventListener("load", initializeMap, { once: true });
    script.addEventListener("error", () => setFailed(true), { once: true });
    document.head.appendChild(script);

    return () => script.removeEventListener("load", initializeMap);
  }, []);

  return (
    <div className="mapFrame">
      <div ref={mapElement} className="naverMap" aria-label="더채플앳 청담 네이버 지도" />
      {failed && (
        <a className="mapFallback" href="https://naver.me/5ne4oSX1" target="_blank" rel="noreferrer">
          네이버 지도에서 위치 확인하기
        </a>
      )}
    </div>
  );
}
