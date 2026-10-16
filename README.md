# Drone Dashboard (Frontend)

เว็บหน้าบ้านสำหรับ Assignment #2 สร้างด้วย React + Vite
เรียกข้อมูลผ่าน Drone API Server ของ Assignment #1 เท่านั้น

## หน้าที่มี

1. **View Config**: แสดงข้อมูล config ของโดรน (Drone ID, Name, Light, Country)
2. **Temperature Log**: ฟอร์มกรอกอุณหภูมิ (°C) แล้วส่งบันทึก log
3. **View Logs**: ตารางแสดง log ล่าสุดก่อน หน้าละ 12 รายการ มี pagination

## วิธี Run

1. ติดตั้ง dependencies

```bash
   npm install
```

2. สร้างไฟล์ `.env` จาก `.env.example` แล้วใส่ค่า

```env
   VITE_API_URL=
   VITE_DRONE_ID=
```

3. เริ่มเว็บ

```bash
   npm run dev
```

4. เปิด http://localhost:5173

## Links

- API Server (Assignment #1): https://drone-api-server-1lc5.onrender.com/configs/67010310
- เว็บที่ deploy แล้ว: https://drone-frontend-snowy.vercel.app