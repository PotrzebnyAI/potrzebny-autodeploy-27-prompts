#!/usr/bin/env npx tsx
/**
 * POTRZEBNY.AI - Pre-Launch Checklist
 * Weryfikuje że wszystko jest gotowe przed deploymentem
 */

import { existsSync, readFileSync } from 'fs';
import { resolve } from 'path';

interface CheckResult {
  name: string;
  status: 'OK' | 'FAIL' | 'WARN';
  message: string;
}

const results: CheckResult[] = [];

function check(name: string, condition: boolean, successMsg: string, failMsg: string, isWarning = false) {
  results.push({
    name,
    status: condition ? 'OK' : (isWarning ? 'WARN' : 'FAIL'),
    message: condition ? successMsg : failMsg
  });
}

async function runChecks() {
  console.log('\n🔍 POTRZEBNY.AI - PRE-LAUNCH CHECKLIST\n');
  console.log('=' .repeat(60));

  // 1. Check .env.local exists
  const envPath = resolve(process.cwd(), '.env.local');
  const envExists = existsSync(envPath);
  check('Environment File', envExists, '.env.local found', '.env.local NOT FOUND - copy POTRZEBNY_22_PANELI_FINAL.txt!');

  // 2. Check line count (should be 20,310)
  if (envExists) {
    const content = readFileSync(envPath, 'utf-8');
    const lineCount = content.split('\n').length;
    const isCorrectCount = lineCount >= 20300 && lineCount <= 20320;
    check(
      'Environment Lines', 
      isCorrectCount, 
      `${lineCount} lines (correct!)`,
      `${lineCount} lines - WRONG! Should be ~20,310 from POTRZEBNY_22_PANELI_FINAL.txt`
    );

    // 3. Check for critical variables
    const criticalVars = [
      'NEXT_PUBLIC_SUPABASE_URL',
      'SUPABASE_SERVICE_ROLE_KEY',
      'STRIPE_SECRET_KEY',
      'ANTHROPIC_API_KEY',
      'OPENAI_API_KEY',
      'GOOGLE_AI_API_KEY',
      'UPSTASH_REDIS_REST_URL'
    ];

    for (const varName of criticalVars) {
      const hasVar = content.includes(`${varName}=`);
      check(`Var: ${varName}`, hasVar, 'Present', 'MISSING!');
    }

    // 4. Check all 22 panels configured
    for (let i = 1; i <= 22; i++) {
      const panelNum = i.toString().padStart(2, '0');
      const hasPanel = content.includes(`PANEL_${panelNum}_NAME=`);
      check(`Panel ${panelNum}`, hasPanel, 'Configured', 'NOT FOUND!');
    }
  }

  // 5. Check package.json
  const pkgPath = resolve(process.cwd(), 'package.json');
  check('package.json', existsSync(pkgPath), 'Found', 'NOT FOUND - run npm init');

  // 6. Check node_modules
  const nmPath = resolve(process.cwd(), 'node_modules');
  check('Dependencies', existsSync(nmPath), 'Installed', 'NOT FOUND - run npm install');

  // 7. Check TypeScript config
  const tsPath = resolve(process.cwd(), 'tsconfig.json');
  check('TypeScript', existsSync(tsPath), 'Configured', 'NOT FOUND');

  // Print results
  console.log('\n📋 RESULTS:\n');
  
  let hasFailures = false;
  for (const r of results) {
    const icon = r.status === 'OK' ? '✅' : r.status === 'WARN' ? '⚠️' : '❌';
    console.log(`${icon} ${r.name}: ${r.message}`);
    if (r.status === 'FAIL') hasFailures = true;
  }

  console.log('\n' + '='.repeat(60));
  
  if (hasFailures) {
    console.log('\n❌ PRE-LAUNCH CHECK FAILED!\n');
    console.log('Fix the issues above before deploying.');
    console.log('\nCRITICAL: Make sure you copied the correct env file:');
    console.log('  cp ~/Downloads/POTRZEBNY_22_PANELI_FINAL.txt .env.local');
    console.log('\nThe file MUST have exactly 20,310 lines!');
    process.exit(1);
  } else {
    console.log('\n✅ ALL CHECKS PASSED! Ready for deployment.\n');
    console.log('Run: bash scripts/launch.sh');
    process.exit(0);
  }
}

runChecks().catch(console.error);
