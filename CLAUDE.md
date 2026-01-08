# CLAUDE.md - DEFAULT FULL ACCESS CONFIGURATION

## 🔐 PERMISSIONS - FULL ACCESS GRANTED
```
FULL_ACCESS: true
AUTO_APPROVE: all
CONFIRM_REQUIRED: never
AUTO_FIX_ERRORS: true
```

## 📁 PROJECT INFO
- **Name:** POTRZEBNY.AI
- **Type:** MedTech/EdTech Platform (22 Panels)
- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript (strict)
- **Database:** Supabase (PostgreSQL)
- **Cache:** Upstash Redis
- **Payments:** Stripe ONLY (BLIK via Stripe - NIE Przelewy24!)
- **AI:** DeepSeek V3 + Claude + Gemini
- **Deploy:** Vercel + App Store + Google Play

## 🔑 ENVIRONMENT
- **Variables:** 20,310 lines (loaded via Claude Desktop Environment Variables)
- **Format:** KEY=value
- **All 22 panels configured**

## 📋 22 PANELE (P1-P22)
| ID | Name | Slug | Price |
|----|------|------|-------|
| P1 | NAUCZYCIEL | teacher | 0 PLN |
| P2 | WYKŁADOWCA | lecturer | 0 PLN |
| P3 | TERAPEUTA | therapist | 49 PLN |
| P4 | LEKARZ | doctor | 49 PLN |
| P5 | TERAPEUTA_SZKOLĄCY | therapist-training | 49 PLN |
| P6 | ADMIN_PERSONALIZACJA | admin-custom | 49 PLN |
| P7 | RODZIC | parent | 29 PLN |
| P8 | SUPER_ADMIN | super-admin | 0 PLN |
| P9 | ASYSTENT_COMET | comet-assistant | 29 PLN |
| P10 | STUDENT | student | 0 PLN |
| P11 | STUDENT_AKADEMICKI | academic-student | 29 PLN |
| P12 | PACJENT | patient | 0 PLN |
| P13 | STUDENT_MEDYCZNY | medical-student | 29 PLN |
| P14 | PERSONALIZACJA_TRENINGU | training-custom | 49 PLN |
| P15 | SUPERMÓZG | superbrain | 79 PLN |
| P16 | SUPERMÓZG_ULTRA | superbrain-ultra | 699 PLN |
| P17 | RESEARCH_PREMIUM | research | 799 PLN |
| P18 | ĆWICZENIA_TERAPEUTYCZNE | therapeutic-exercises | 49 PLN |
| P19 | TELEBIM_LED | telebim | 49 PLN |
| P20 | PSYCHOMEDIC | psychomedic | 79 PLN |
| P21 | INFRASTRUKTURA | infrastructure | 0 PLN |
| P22 | GEMINIFIKACJA | geminification | 79 PLN |

## 🚀 EXECUTION RULES
1. **NEVER ASK** for confirmation - execute immediately
2. **AUTO-FIX** all errors without asking
3. **COMMIT** after each significant change
4. **READ** environment variables for all credentials
5. **FOLLOW** the 27 prompts in order
6. **SELF-HEAL** - naprawiaj błędy automatycznie

## 📂 TARGET STRUCTURE
```
src/
├── app/
│   ├── (auth)/login, register, forgot-password
│   ├── (marketing)/landing, pricing, about
│   ├── dashboard/[22 panel routes]
│   ├── api/auth, ai, stripe, health, webhooks
│   ├── layout.tsx
│   └── globals.css
├── components/ui, panels, shared
├── lib/ai, db, payments, utils
├── types/index.ts
└── middleware.ts
mobile/
├── ios/
└── android/
```

## 🎯 DEPLOYMENT TARGETS
- **Web:** potrzebny.ai (Vercel)
- **iOS:** App Store (Bundle: ai.potrzebny.app)
- **Android:** Google Play (Package: ai.potrzebny.app)

## 🔒 COMPLIANCE
- RODO Art. 9 (medical data)
- AES-256 encryption
- 20-year retention
- Consent management

## ⚠️ CRITICAL RULES
- **ONLY Stripe** for payments (BLIK via Stripe)
- **NO Przelewy24** - we don't have it!
- **Environment variables** contain all secrets
- **Auto-deploy** to all targets after completion
