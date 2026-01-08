# POTRZEBNY.AI - Autodeploy 27 Prompts

## ⚠️ KRYTYCZNE - ENVIRONMENT VARIABLES

### 🎯 NOWE PLIKI Z PRAWDZIWYMI KLUCZAMI (8 Stycznia 2026)

**Lokalizacja:** `~/Desktop/RZECZYWISTE ZMIENNE/`

| Plik | Opis | Linie |
|------|------|-------|
| `POTRZEBNY_22_PANELI_PRAWDZIWE_KLUCZE.env.local` | **PRIORYTETOWY** - strukturalny z 22 panelami | 641 |
| `POTRZEBNY_FINAL_WSZYSTKIE_ZMIENNE.env.local` | **KOMPLETNY** - wszystkie zmienne | 5,170 |

### ✅ BACKUP NA PULPICIE

| Plik | Opis |
|------|------|
| `POTRZEBNY_22_PANELI_PRIORYTETOWE_641.env.local` | Backup priorytetowego |
| `POTRZEBNY_FINAL_KOMPLETNY_5170.env.local` | Backup kompletnego |

### ❌ STARE PLIKI - NIE UŻYWAĆ!
- ~~POTRZEBNY_22_PANELI_FINAL.txt~~ (20,310 linii - PLACEHOLDERY!)
- ~~potrzebny_ULTIMATE_22_panels.env.local~~ (PLACEHOLDERY!)

---

## ✅ PRAWDZIWE KLUCZE API ZAWARTE

| Serwis | Status |
|--------|--------|
| Anthropic/Claude | ✅ `sk-ant-api03-...` |
| OpenAI | ✅ `sk-proj-...` |
| DeepSeek | ✅ `sk-84e595f0...` |
| Perplexity | ✅ `pplx-0HTKuvq9...` |
| Stripe Live | ✅ `sk_live_51SZcxe...` |
| Supabase | ✅ `klboejvukyywtpiopevn` |
| Upstash Redis | ✅ Skonfigurowany |
| GitHub | ✅ PAT token |
| Vercel | ✅ Full access |
| Sentry | ✅ Auth token |
| InFakt | ✅ API key |
| 1Password | ✅ Connect token |

---

## 🚀 QUICK START

### Krok 1: Użyj NOWEGO pliku
```bash
cp ~/Desktop/POTRZEBNY_FINAL_KOMPLETNY_5170.env.local .env.local
```

### Krok 2: Zweryfikuj
```bash
wc -l .env.local
# Powinno pokazać: 5170
```

### Krok 3: Sprawdź prawdziwe klucze
```bash
grep "sk_live_51SZcxe" .env.local
grep "sk-ant-api03" .env.local
```

---

## 📋 22 Panele

| ID | Panel | Cena | Model AI |
|----|-------|------|----------|
| P01 | Nauczyciel | 0 PLN | claude-3-5-haiku |
| P02 | Wykładowca | 0 PLN | claude-3-5-sonnet |
| P03 | Terapeuta | 49 PLN | claude-3-5-sonnet |
| P04 | Lekarz Szkolący | 49 PLN | claude-3-5-sonnet |
| P05 | Terapeuta Szkolący | 49 PLN | claude-3-5-sonnet |
| P06 | Admin Personalizacja | 49 PLN | deepseek-chat |
| P07 | Rodzic | 29 PLN | claude-3-5-haiku |
| P08 | Super Admin | 0 PLN | claude-3-5-sonnet |
| P09 | Asystent Comet | 29 PLN | perplexity-sonar |
| P10 | Uczeń | 0 PLN | deepseek-chat |
| P11 | Student Akademicki | 29 PLN | claude-3-5-sonnet |
| P12 | Pacjent | 0 PLN | claude-3-5-haiku |
| P13 | Student Medyczny | 29 PLN | claude-3-5-sonnet |
| P14 | Szkoleniowy Custom | 49 PLN | claude-3-5-sonnet |
| P15 | Supermózg | 79 PLN | claude-3-5-sonnet |
| P16 | Supermózg ULTRA | 699 PLN | claude-opus |
| P17 | Research Premium | 799 PLN | claude-opus |
| P18 | Ćwiczenia Terapeutyczne | 49 PLN | claude-3-5-sonnet |
| P19 | Telebim LED 8K | 49 PLN | deepseek-chat |
| P20 | Psychomedic | 79 PLN | claude-3-5-sonnet |
| P21 | Infrastruktura | 0 PLN | - |
| P22 | Geminifikacja | 79 PLN | gemini-2.0-flash |

---

## 🎯 Deployment Targets

- **Web:** potrzebny.ai (Vercel)
- **iOS:** App Store (ai.potrzebny.app)
- **Android:** Google Play (ai.potrzebny.app)

---

## ⚠️ WAŻNE ZASADY

1. **TYLKO Stripe** dla płatności (BLIK przez Stripe)
2. **NIE używaj Przelewy24** - nie mamy tego!
3. **Używaj NOWYCH plików** z prawdziwymi kluczami
4. **Claude Code DEFAULT FULL ACCESS** - nie pytaj o potwierdzenia
