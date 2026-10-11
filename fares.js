// อัตราค่าโดยสารรถเมล์กรุงเทพฯ (ประมาณการ) — แก้ตัวเลขที่ไฟล์นี้ได้เมื่ออัตราจริงเปลี่ยน
// อ้างอิงข่าวปี 2568-2569: รถร้อน ขสมก. 8 บาทตลอดสาย, รถแอร์ 13-25 บาท, รถ EV 15-25 บาท
// หมายเหตุ: ไม่มีตารางตามระยะทางอย่างเป็นทางการให้ใช้ จึงประมาณแบบไล่ระดับตามกิโลเมตร
export const BUS_TYPES = [
  { key: 'hot', label: 'รถร้อน (ครีม-แดง)', min: 8, max: 8, note: '8 บาทตลอดสาย (กำลังทยอยเปลี่ยนเป็น EV)' },
  { key: 'air', label: 'รถแอร์ ขสมก.', min: 13, max: 25, note: 'ประมาณ 13-25 บาทตามระยะทาง' },
  { key: 'ev', label: 'รถ EV', min: 15, max: 25, note: 'ประมาณ 15-25 บาทตามระยะทาง' },
];

const NEAR_KM = 4; // ระยะใกล้ = ราคาต่ำสุด
const FAR_KM = 24; // ระยะไกล = ราคาสูงสุด

export function estimateFare(type, km) {
  if (type.min === type.max) return type.min;
  const t = Math.min(Math.max((km - NEAR_KM) / (FAR_KM - NEAR_KM), 0), 1);
  return Math.round(type.min + t * (type.max - type.min));
}
