# POTRZEBNY.AI - Autodeploy 27 Prompts

## ⚠️ KRYTYCZNE - ENVIRONMENT VARIABLES

**JEDYNY PRAWIDŁOWY PLIK:** `POTRZEBNY_22_PANELI_FINAL.txt`
- **Lokalizacja:** `~/Downloads/POTRZEBNY_22_PANELI_FINAL.txt`
- **Liczba linii:** dokładnie **20,310**
- **Format:** KEY=value (zwalidowany, bez błędów)

### ❌ NIE UŻYWAJ INNYCH PLIKÓW!
Wszystkie inne wersje są nieprawidłowe:
- ~~potrzebny_ULTIMATE_22_panels.env.local~~ (18,515 linii - ZŁY!)
- ~~potrzebny_22_FIXED_FINAL.txt~~ (18,599 linii - ZŁY!)
- ~~potrzebny_22_CLEAN.env.local~~ (18,515 linii - ZŁY!)

---

## 🚀 QUICK START

### Krok 1: Przygotuj środowisko
```bash
cp ~/Downloads/POTRZEBNY_22_PANELI_FINAL.txt .env.local
```

### Krok 2: Zweryfikuj (WAŻNE!)
```bash
wc -l .env.local
# Powinno pokazać: 20310 .env.local
```

### Krok 3: Uruchom pre-launch checklist
```bash
npx tsx scripts/pre-launch-checklist.ts
```

### Krok 4: Deploy!
```bash
bash scripts/launch.sh
```

---

## 📱 Claude Desktop App - Environment Variables

Jeśli używasz Claude Desktop App:

1. Otwórz `~/Downloads/POTRZEBNY_22_PANELI_FINAL.txt` w TextEdit
2. Cmd+A (zaznacz wszystko) → Cmd+C (kopiuj)
3. W Claude Desktop App → wybierz repo → kliknij ikonę ustawień
4. Wklej CAŁĄ zawartość do "Environment variables"
5. Network access: **Full**
6. Save changes

---

## 📋 22 Panele

| ID | Panel | Cena |
|----|-------|------|
| P1 | Nauczyciel | 0 PLN |
| P2 | Wykładowca | 0 PLN |
| P3 | Terapeuta | 49 PLN |
| P4 | Lekarz | 49 PLN |
| P5 | Terapeuta Szkolący | 49 PLN |
| P6 | Admin Personalizacja | 49 PLN |
| P7 | Rodzic | 29 PLN |
| P8 | Super Admin | 0 PLN |
| P9 | Asystent Comet | 29 PLN |
| P10 | Student | 0 PLN |
| P11 | Student Akademicki | 29 PLN |
| P12 | Pacjent | 0 PLN |
| P13 | Student Medyczny | 29 PLN |
| P14 | Personalizacja Treningu | 49 PLN |
| P15 | Supermózg | 79 PLN |
| P16 | Supermózg Ultra | 699 PLN |
| P17 | Research Premium | 799 PLN |
| P18 | Ćwiczenia Terapeutyczne | 49 PLN |
| P19 | Telebim LED | 49 PLN |
| P20 | Psychomedic | 79 PLN |
| P21 | Infrastruktura | 0 PLN |
| P22 | Geminifikacja | 79 PLN |

---

## 🎯 Deployment Targets

- **Web:** potrzebny.ai (Vercel)
- **iOS:** App Store (ai.potrzebny.app)
- **Android:** Google Play (ai.potrzebny.app)

---

## ⚠️ WAŻNE ZASADY

1. **TYLKO Stripe** dla płatności (BLIK przez Stripe)
2. **NIE używaj Przelewy24** - nie mamy tego!
3. **Zawsze weryfikuj** liczbę linii: `wc -l .env.local` = 20310
4. **Claude Code DEFAULT FULL ACCESS** - nie pytaj o potwierdzenia
