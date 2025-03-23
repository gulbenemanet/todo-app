# Yapılacaklar Listesi Uygulaması

Bu proje, kullanıcıların günlük görevlerini yönetmelerine yardımcı olan bir Todo List uygulamasıdır. React ile frontend, Node.js/Express ile backend ve MongoDB ile veritabanı yönetimi kullanılmıştır. Gemini AI entegre edilmiştir.

## Ön Gereksinimler
- Node.js ve npm
- MongoDB
- Google Generative AI API anahtarı

## Kurulum

### 1. Backend Kurulumu
```bash
cd server
npm install
```

.env dosyası oluşturun ve port, mongodb_uri ve api_key ekleyin.

### 2. Frontend Kurulumu
```bash
cd client
npm install
```
### 3. Kullanıcı ekleme
```bash curl -X POST http://localhost:5000/signUp -H "Content-Type: application/json" -d "{\"username\":\"kullanıcıadı\", \"password\":\"şifre\"}" ```


## Uygulama Çalıştırma

### 1. Backend
```bash
cd server
node index.js
```
### 2. Frontend
```bash
cd client
npm start
```

## Kullanım

- Giriş yap: http://localhost:3000
- Todo ekle: "+ To Do Ekle" butonu
- Görevleri düzenle/sil: Kalem ve çöp kutu ikonları
- Arama: Üstteki arama çubuğunu kullanın
- Çıkış: "Çıkış Yap" butonu

## Ek Notlar

- Token yönetimi otomatik olarak localStorage'da yapılmaktadır
- Dosya yükleme özelliği aktif durumda
- AI önerileri için Google Generative AI API anahtarı gereklidir