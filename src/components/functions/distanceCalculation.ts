const calculateDistance = (x1:number, y1:number, x2:number, y2:number) => {
    // Convert lat/lon to radians
    const toRadians = (degree:number) => degree * (Math.PI / 180);
  
    const R = 6371; // Radius of the Earth in km
    const dLat = toRadians(y2 - y1);
    const dLon = toRadians(x2 - x1);
  
    const lat1 = toRadians(y1);
    const lat2 = toRadians(y2);
  
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2); 
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); 
    return R * c; // Distance in km
  };

export default calculateDistance;