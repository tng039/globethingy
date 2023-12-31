import { motion } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { SVG } from '@svgdotjs/svg.js';
import useScrambleText from './functions/useScrambledText';

interface Article {
  URL: string;
  location: string;
  summary: string;
  lat: number;
  lng: number;
}

interface MapOverlayProps {
  article: Article;
}

const MapOverlay: React.FC<MapOverlayProps> = ({ article }) => {
  const scrambledSummary = useScrambleText(article.summary);
  const svgContainerRef = useRef<HTMLDivElement>(null);
  const summaryRef = useRef<HTMLDivElement>(null);
  const locationRef = useRef<HTMLDivElement>(null);
  const longlatRef = useRef<HTMLDivElement>(null);

  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });


  const handleResize = () => {
    const newSize = {
      width: window.innerWidth,
      height: window.innerHeight,
    };
    setWindowSize(newSize);


    updateSummaryPosition(newSize.width, newSize.height);
    updateLocationPosition(newSize.width, newSize.height);
    updateLonglatPosition(newSize.width, newSize.height);



    if (svgContainerRef.current) {
      svgContainerRef.current.innerHTML = '';
      const draw = SVG().addTo(svgContainerRef.current).size('100%', '100%');
      const width = svgContainerRef.current.clientWidth;
      const height = svgContainerRef.current.clientHeight;
 // Define your path as before
 const path = draw.path(`M ${width / 2} ${height / 2.045} L ${width / 1.95} ${height / 2.25} L ${width / 1.5} ${height / 2.25}`);
 path.stroke({ width: 2, color: '#FFFFFF' });
 path.fill('none');


 const length = path.length();


 //@ts-ignore
 path.stroke({ dasharray: length, dashoffset: length });

//@ts-ignore
 path.animate(1000).stroke({ dashoffset: 0 });
    }
  };


  const updateSummaryPosition = (width: number, height: number) => {
    if (summaryRef.current) {


      summaryRef.current.style.top = `${height / 1.6}px`;
      summaryRef.current.style.left = `${width / 2}px`;
      summaryRef.current.style.transform = 'translate(-50%, -50%)';
    }
  };

  const updateLocationPosition = (width: number, height: number) => {
    if (locationRef.current) {


      locationRef.current.style.top = `${height / 2.3}px`;
      locationRef.current.style.left = `${width / 1.7}px`;
      locationRef.current.style.transform = 'translate(-50%, -50%)';
    }
  };

  const updateLonglatPosition = (width: number, height: number) => {
    if (longlatRef.current) {


      longlatRef.current.style.top = `${height / 2.2}px`;
      longlatRef.current.style.left = `${width / 1.7}px`;
      longlatRef.current.style.transform = 'translate(-50%, -50%)';
    }
  };




  useEffect(() => {
    window.addEventListener('resize', handleResize);


    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className='relative w-screen h-full z-50'>
      <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'>
        <div ref={svgContainerRef} className='w-screen h-screen'></div>
      </div>

<motion.div
  ref={locationRef}
  className='absolute text-white font-semibold monospace text-xl shadow-lg'
  initial={{ opacity: 0 }} 
  animate={{ opacity: 100 }} 
  transition={{duration: 1 }} 
  style={{
    top: `${windowSize.height / 2}px`, 
    transform: 'translate(-50%, -50%)'
  }}
>
  {article.location}
</motion.div>

      <div
        ref={summaryRef}
        className='absolute text-white font-semibold monospace bg-black bg-opacity-50 p-5 rounded-lg'
        style={{
          top: `${windowSize.height / 2}px`,
          left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center',
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.5 }}  
        >
          {scrambledSummary}
            <div className='mt-4 relative'>
                <a
                    href={article.URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className='inline-block bg-[#F3F0CA] text-black py-1 px-3 rounded-lg text-l hover:bg-[#E1AA74] transition duration-300'
                  >
                    Read More
                </a>
            </div>
        </motion.div>
    </div>


      <div ref={longlatRef} className='absolute font-thin monospace p-2' style={{
        top: `${windowSize.height / 2}px`, 
        left: '50%',
        transform: 'translate(-50%, -50%)'
      }}>
        {article.lng},
        {article.lat}
      </div>
    </div>
  );
};

export default MapOverlay;
