// ค้นหาสถานที่ด้วย OpenStreetMap Nominatim (ฟรี ต้องใส่ User-Agent และไม่ควรยิงถี่)
export async function GET(req) {
  const q = new URL(req.url).searchParams.get('q')?.trim();
  if (!q || q.length < 2) return Response.json({ results: [] });
  const url = `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=5&countrycodes=th&accept-language=th&q=${encodeURIComponent(q)}`;
  try {
    const r = await fetch(url, { headers: { 'User-Agent': 'bus-fare-calculator-student-project/1.0' } });
    if (!r.ok) throw new Error('geocode ' + r.status);
    const data = await r.json();
    return Response.json({
      results: data.map((d) => ({ name: d.display_name, lat: Number(d.lat), lon: Number(d.lon) })),
    });
  } catch {
    return Response.json({ error: 'ค้นหาสถานที่ไม่สำเร็จ ลองใหม่อีกครั้ง' }, { status: 502 });
  }
}
