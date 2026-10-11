// หาระยะทางถนนด้วย OSRM (เดโมสาธารณะ) ถ้าล้มเหลวจะประมาณจากเส้นตรง x 1.3
function haversine(a, b) {
  const R = 6371, rad = (x) => (x * Math.PI) / 180;
  const dLat = rad(b.lat - a.lat), dLon = rad(b.lon - a.lon);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

export async function GET(req) {
  const p = new URL(req.url).searchParams;
  const [aLat, aLon, bLat, bLon] = ['aLat', 'aLon', 'bLat', 'bLon'].map((k) => Number(p.get(k)));
  if ([aLat, aLon, bLat, bLon].some((n) => !Number.isFinite(n))) {
    return Response.json({ error: 'พิกัดไม่ถูกต้อง' }, { status: 400 });
  }
  try {
    const r = await fetch(`https://router.project-osrm.org/route/v1/driving/${aLon},${aLat};${bLon},${bLat}?overview=false`, {
      headers: { 'User-Agent': 'bus-fare-calculator-student-project/1.0' },
    });
    const d = await r.json();
    const route = d.routes?.[0];
    if (!route) throw new Error('no route');
    return Response.json({ km: route.distance / 1000, minutes: route.duration / 60, source: 'osrm' });
  } catch {
    const km = haversine({ lat: aLat, lon: aLon }, { lat: bLat, lon: bLon }) * 1.3;
    return Response.json({ km, minutes: (km / 15) * 60, source: 'estimate' });
  }
}
