import React, { useState, useEffect, useRef} from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import MapOverlay from './mapOverlay';
import fetchAllArticles from './functions/fetchArticles';
import calculateDistance from './functions/distanceCalculation';
import { motion } from 'framer-motion';



mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

const fetchCoordinatesForPlace = async (place: string) => {
  const response = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(place)}.json?access_token=${mapboxgl.accessToken}`);
  const data = await response.json();
  if (data.features && data.features[0] && data.features[0].center) {
    return {
      lng: data.features[0].center[0],
      lat: data.features[0].center[1]
    };
  }
  return null;
};

interface Article {
  URL: string;
  location: string;
  summary: string;
  lat: number;
  lng: number;
}

const MapComponent: React.FC = () => {

  const [articles, setArticles] = useState<Article[]>([]); // This is the type of the articles state
  const [currentArticleIndex, setCurrentArticleIndex] = useState(0);

  //Overlay visibility
  const [isVisible, setIsVisible] = useState<boolean>(false);

  const mapContainer = useRef<HTMLDivElement | null>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  //@ts-ignore
  const [lng, setLng] = useState<number> (-70.9);
  //@ts-ignore
  const [lat, setLat] = useState<number>(42.35);
  //@ts-ignore
  const [zoom, setZoom] = useState<number>(1);

  useEffect(() => {
    const handleResize = () => {
      console.log(currentArticleIndex);
      //centerMapOnPlace(articles[currentArticleIndex].location);
      map.current?.setCenter([articles[currentArticleIndex].lng, articles[currentArticleIndex].lat]);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
    //Give the current index to handleresize
  }, [currentArticleIndex]);

  useEffect(() => {


    (async () => {
      try {
        //const articles = await fetchAllArticles();
        const articles = [
          {
            "URL": "https://news.example.com/article-001",
            "location": "New York City, USA",
            "summary": "A groundbreaking innovation in urban rooftop farming techniques has ignited a green revolution in the heart of New York City. This pioneering approach to agriculture is transforming the cityscape, allowing for the cultivation of fresh produce in the most unexpected places.",
            "lng": -74.0060,
            "lat": 40.7128
          },
          {
            "URL": "https://news.example.com/article-002",
            "location": "Paris, France",
            "summary": "A dramatic turn of events unfolded in the city of Paris, France, as an unexpected heavy snowstorm blanketed the romantic capital. The Eiffel Tower, typically a symbol of clear skies and sunshine, was shrouded in a rare white coat of snow, creating a breathtaking winter wonderland scene.",
            "lng": 2.3522,
            "lat": 48.8566
          },
          {
            "URL": "https://news.example.com/article-003",
            "location": "Tokyo, Japan",
            "summary": "Tokyo experienced a technological breakthrough as scientists unveiled a revolutionary transportation system that promises to redefine urban commuting. The innovative project aims to reduce congestion and improve the efficiency of daily travel.",
            "lng": 139.6503,
            "lat": 35.6762
          },
          {
            "URL": "https://news.example.com/article-004",
            "location": "Rio de Janeiro, Brazil",
            "summary": "The vibrant streets of Rio de Janeiro came alive as local artists collaborated to create an enormous mural celebrating the city's rich cultural diversity. The mural has become a symbol of unity and an inspiration to residents and visitors alike.",
            "lng": -43.1729,
            "lat": -22.9068
          },
          {
            "URL": "https://news.example.com/article-005",
            "location": "Sydney, Australia",
            "summary": "Sydney hosted its annual energy conference, showcasing the latest advancements in sustainable energy solutions. The city is positioning itself as a global leader in renewable energy, with a focus on reducing its carbon footprint.",
            "lng": 151.2093,
            "lat": -33.8688
          },
          {
            "URL": "https://news.example.com/article-006",
            "location": "London, UK",
            "summary": "In a vibrant celebration of London's rich cultural tapestry, a collective of local artists has come together to create a sprawling mural that pays tribute to the city's diverse heritage.",
            "lng": -0.1276,
            "lat": 51.5074
          }
        ]


        setArticles(articles); // This will log the actual articles object

        for (const article of articles) {
          console.log(article.location);
          addMarker(article.location, articles.indexOf(article));
        }

        const carouselTimer = 16000;
        //@ts-ignore
        const intervalId = setInterval(() => {
          setCurrentArticleIndex((prevIndex) => {
            const nextIndex = (prevIndex + 1) % articles.length;
            centerMapOnPlace(articles[nextIndex].location);


            setTimeout(() => {
              // Now we use nextIndex to get the correct marker
              const markerElement = document.getElementById(`marker-${nextIndex}`);
              if (markerElement) {
                markerElement.style.zIndex = '50';
                setTimeout(() => {
                  markerElement.style.zIndex = '0';
                }, carouselTimer);
              }
              setIsVisible(true); // This is correct since it's part of the React state update
            }, 3000);

            return nextIndex;
          });
        }, carouselTimer);

      } catch (error) {
        console.error('Error fetching articles:', error);
      }
    })();
    if (map.current) return; // initialize map only once

    map.current = new mapboxgl.Map({
      container: mapContainer.current as HTMLElement,
      style: 'mapbox://styles/tng039/clofkt020004r01ph5qku32fq',
      center: [18.97120537171555, 69.6797867627084],  // Initial center
      zoom: 14,
      interactive: false
    });

    setTimeout(() => {
      if(map.current != null){
        map.current.flyTo({center: [18.97120537171555, 69.6797867627084], duration: 10000, zoom: 1});
      }
    }, 3000);


  }, []);

  const centerMapOnPlace = async (place: string) => {
    setIsVisible(false);

    const coords = await fetchCoordinatesForPlace(place);
    if (coords && map.current) {
      // Fly to the location

      //doesnt work
      const zoomCalculation = () => {
        let nearbyMarkers = 0;

        for (const article of articles){
          //@ts-ignore
          const distance = calculateDistance(coords.lng, coords.lat, article.lng, article.lat);
          console.log(distance)
          if (distance < 10000) {
            nearbyMarkers++;
          }
        }
        return nearbyMarkers;

      };


      zoomCalculation();
      map.current.flyTo({center: [coords.lng, coords.lat], duration: 3000, zoom: (Math.random() * (6 - 3) + 3)});

    }
  };

  const addMarker = async (place: string, markerId: number) => {
    const coords = await fetchCoordinatesForPlace(place);
    if (coords && map.current) {

    const el = document.createElement('div');
    el.className = 'custom-marker'; // Add the custom class here
    el.id = `marker-${markerId}`;

    const marker = new mapboxgl.Marker(el)
      .setLngLat([coords.lng, coords.lat])
      .addTo(map.current);

    //used for testing
    marker.getElement()?.addEventListener('click', () => {
    centerMapOnPlace(coords.lng + ',' + coords.lat);
    setTimeout(() => {
      setIsVisible(true);
      console.log(isVisible)
    }, 3000);
    });
    }
  }
  return (

  <div ref={mapContainer} className='w-screen h-screen'>
     <div className="absolute flex items-center justify-center w-screen h-screen z-50">
     <div className="absolute flex items-center justify-center w-screen h-screen z-48">
      <motion.img
        src="logo.png"
        alt=""
        className="scale-50"
        initial={{ scale: 0.5, y: 0 }} // Initial state: middle of the screen, scaled down to 50%
        animate={{ scale: 0.3, y: '-45vh' }} // Animate to: top of the screen, scaled down to 40%
        transition={{ duration: 1, delay: 10}} // Define the transition duration
      />
    </div>
      </div>
  {isVisible && <div className='bg-black opacity-40 w-screen h-screen z-49 absolute'> </div>}
  {isVisible && <MapOverlay article={articles[currentArticleIndex]} />}
  </div>);
};

export default MapComponent;
