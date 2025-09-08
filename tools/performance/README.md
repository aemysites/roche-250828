# Performance Testing Tools

This directory contains tools for testing and monitoring Core Web Vitals, specifically Cumulative Layout Shift (CLS) issues.

## Tools Overview

### 1. Lighthouse CLI Tool (`test-performance.js`)

A Node.js script that uses Lighthouse to measure Core Web Vitals programmatically.

**Usage:**
```bash
# Quick CLS test only
node tools/performance/test-performance.js http://localhost:3000 --quick

# Full performance audit
node tools/performance/test-performance.js http://localhost:3000

# Test any URL
node tools/performance/test-performance.js https://your-site.com --quick
```

**Output:**
- CLS, LCP, FID scores with color-coded ratings
- Performance score (0-100)
- Saves detailed JSON report to `performance-report.json`

### 2. Real-time CLS Monitor (`inject-cls-monitor.js`)

A browser injection script that provides real-time CLS monitoring with visual feedback.

**Usage:**
1. Open your site in a browser (e.g., http://localhost:3000)
2. Open browser Developer Tools → Console
3. Copy and paste the entire contents of `inject-cls-monitor.js`
4. Watch the dashboard appear in the top-right corner

**Features:**
- Live CLS/LCP/FID monitoring
- Visual alerts (red border flash) when layout shifts occur
- Detailed log of each layout shift with timestamps
- Removable dashboard overlay

## Core Web Vitals Thresholds

| Metric | Good | Needs Improvement | Poor |
|--------|------|-------------------|------|
| **CLS** | ≤ 0.1 | 0.1 - 0.25 | > 0.25 |
| **LCP** | ≤ 2.5s | 2.5s - 4.0s | > 4.0s |
| **FID** | ≤ 100ms | 100ms - 300ms | > 300ms |
