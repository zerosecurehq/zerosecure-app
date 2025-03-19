import { useEffect, useRef } from "react";
import Globe, { GlobeMethods } from "react-globe.gl";

const Earth = () => {
  const globeRef = useRef<GlobeMethods | undefined>(undefined);

  useEffect(() => {
    if (globeRef.current) {
      const controls = globeRef.current.controls();
      if (controls) {
        controls.autoRotate = true;
        controls.autoRotateSpeed = 1;
        controls.enableZoom = false;
      }
    }
  }, []);
  
  return (
    <div className="flex items-center flex-1 justify-center order-2 lg:order-1">
      <Globe
        ref={globeRef}
        height={700}
        width={700}
        backgroundColor="rgba(0, 0, 0, 0)"
        showAtmosphere
        showGraticules
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
        bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
        labelsData={[{ lat: 40, lng: -100, text: 'Rjieka, Croatia', color: 'white', size: 15 }]}
      />
    </div>
  )
}

export default Earth