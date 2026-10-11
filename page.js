'use client';

import { useState } from 'react';
import { BUS_TYPES, estimateFare } from '../lib/fares';

function PlaceField({ label, placeholder, value, onPick }) {
  const [q, setQ] = useState('');
  const [opts, setOpts] = useState([]);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  async function search() {
    setErr('');
    setOpts([]);
    if (q.trim().length < 2) return;
    setBusy(true);
    try {
      const r = await fetch(`/api/geocode?q=${encodeURIComponent(q)}`);
      const d = await r.json();
      if (!r.ok) throw new Error(d.error);
      if (!d.results.length) setErr('ไม่พบสถานที่ ลองพิมพ์ชื่อให้เฉพาะเจาะจงขึ้น');
      setOpts(d.results);
    } catch (e) {
      setErr(e.message || 'เกิดข้อผิดพลาด');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="card">
      <h2>{label}</h2>
      <form
        className="row"
        onSubmit={(e) => {
          e.preventDefault();
          search();
        }}
      >
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={placeholder} />
        <button type="submit" disabled={busy}>{busy ? '…' : 'ค้นหา'}</button>
      </form>
      {err && <div className="err">{err}</div>}
      {opts.length > 0 && (
        <ul className="opts">
          {opts.map((o, i) => (
            <li key={i}>
              <button
                type="button"
                onClick={() => {
                  onPick(o);
                  setOpts([]);
                }}
              >
                {o.name}
              </button>
            </li>
          ))}
        </ul>
      )}
      {value && <div className="picked">เลือกแล้ว: {value.name}</div>}
    </div>
  );
}

export default function Page() {
  const [from, setFrom] = useState(null);
  const [to, setTo] = useState(null);
  const [result, setResult] = useState(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  async function calc() {
    setErr('');
    setResult(null);
    setBusy(true);
    try {
      const qs = new URLSearchParams({ aLat: from.lat, aLon: from.lon, bLat: to.lat, bLon: to.lon });
      const r = await fetch(`/api/route?${qs}`);
      const d = await r.json();
      if (!r.ok) throw new Error(d.error);
      setResult(d);
    } catch (e) {
      setErr(e.message || 'คำนวณไม่สำเร็จ');
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="wrap">
      <h1>🚌 คำนวณค่ารถเมล์</h1>
      <p className="sub">ประมาณค่าโดยสารรถเมล์กรุงเทพฯ จากที่หนึ่งไปอีกที่หนึ่ง</p>

      <PlaceField label="ต้นทาง" placeholder="เช่น อนุสาวรีย์ชัยสมรภูมิ" value={from} onPick={setFrom} />
      <PlaceField label="ปลายทาง" placeholder="เช่น สยามพารากอน" value={to} onPick={setTo} />

      <button className="primary" disabled={!from || !to || busy} onClick={calc}>
        {busy ? 'กำลังคำนวณ…' : 'คำนวณค่ารถเมล์'}
      </button>
      {err && <div className="err">{err}</div>}

      {result && (
        <section className="card" style={{ marginTop: 16 }}>
          <h2>
            ระยะทางประมาณ {result.km.toFixed(1)} กม. · ใช้เวลาประมาณ {Math.round(result.minutes)} นาที (ถนน)
          </h2>
          {BUS_TYPES.map((t) => (
            <div className="fare" key={t.key}>
              <div>
                {t.label}
                <small>{t.note}</small>
              </div>
              <b>{estimateFare(t, result.km)} ฿</b>
            </div>
          ))}
          <p className="note">
            ราคาเป็นค่าประมาณจากระยะทางถนน ไม่ใช่ราคาตามสายรถเมล์จริง เพราะเส้นทางและอัตราค่าโดยสารจริงอาจต่างกัน
            {result.source === 'estimate' && ' (ระบบหาเส้นทางไม่ได้ จึงประมาณระยะจากเส้นตรง)'}
          </p>
        </section>
      )}
    </main>
  );
}
