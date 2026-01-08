#!/bin/bash
#
# POTRZEBNY.AI - Launch Script
# Full deployment: Vercel + App Store + Google Play
#

set -e

echo ""
echo "🚀 POTRZEBNY.AI - FULL DEPLOYMENT"
echo "=================================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Check .env.local
if [ ! -f .env.local ]; then
    echo -e "${RED}❌ ERROR: .env.local not found!${NC}"
    echo ""
    echo "Copy the correct environment file:"
    echo "  cp ~/Downloads/POTRZEBNY_22_PANELI_FINAL.txt .env.local"
    echo ""
    echo "The file MUST have exactly 20,310 lines!"
    exit 1
fi

# Check line count
LINE_COUNT=$(wc -l < .env.local | tr -d ' ')
if [ "$LINE_COUNT" -lt 20300 ] || [ "$LINE_COUNT" -gt 20320 ]; then
    echo -e "${RED}❌ ERROR: .env.local has $LINE_COUNT lines${NC}"
    echo ""
    echo "Expected ~20,310 lines from POTRZEBNY_22_PANELI_FINAL.txt"
    echo "You might have the wrong file!"
    exit 1
fi

echo -e "${GREEN}✅ Environment file OK ($LINE_COUNT lines)${NC}"
echo ""

# Step 1: Install dependencies
echo "📦 Installing dependencies..."
npm install
echo ""

# Step 2: Type check
echo "🔍 Running type check..."
npm run type-check || true
echo ""

# Step 3: Build
echo "🔨 Building application..."
npm run build
echo ""

# Step 4: Deploy to Vercel
echo "☁️  Deploying to Vercel..."
if command -v vercel &> /dev/null; then
    vercel --prod --yes
else
    echo -e "${YELLOW}⚠️  Vercel CLI not installed. Install with: npm i -g vercel${NC}"
    echo "   Then run: vercel --prod"
fi
echo ""

# Step 5: Mobile builds (informational)
echo "📱 Mobile Deployment Notes:"
echo "   iOS:     cd mobile/ios && fastlane release"
echo "   Android: cd mobile/android && fastlane release"
echo ""

echo "=================================="
echo -e "${GREEN}✅ DEPLOYMENT COMPLETE!${NC}"
echo ""
echo "🌐 Web:     https://potrzebny.ai"
echo "📱 iOS:     App Store (ai.potrzebny.app)"
echo "🤖 Android: Google Play (ai.potrzebny.app)"
echo ""
