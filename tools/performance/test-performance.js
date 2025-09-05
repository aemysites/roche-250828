#!/usr/bin/env node

/**
 * Local Performance Testing Script
 * Tests CLS, LCP, and other Core Web Vitals metrics
 */

import lighthouse from 'lighthouse';
import * as chromeLauncher from 'chrome-launcher';
import fs from 'fs';

const TEST_URL = process.argv[2] || 'http://localhost:3000';
const OUTPUT_FILE = 'performance-report.json';

async function runLighthouse() {
  console.log(`🚀 Testing performance for: ${TEST_URL}`);
  
  const chrome = await chromeLauncher.launch({
    chromeFlags: ['--headless', '--no-sandbox', '--disable-gpu']
  });

  const options = {
    logLevel: 'info',
    output: 'json',
    onlyCategories: ['performance'],
    port: chrome.port,
    throttling: {
      rttMs: 40,
      throughputKbps: 10240,
      cpuSlowdownMultiplier: 1,
      requestLatencyMs: 0,
      downloadThroughputKbps: 0,
      uploadThroughputKbps: 0
    }
  };

  try {
    const runnerResult = await lighthouse(TEST_URL, options);
    const reportJson = runnerResult.lhr;
    
    // Extract Core Web Vitals
    const cls = reportJson.audits['cumulative-layout-shift'];
    const lcp = reportJson.audits['largest-contentful-paint'];
    const fid = reportJson.audits['max-potential-fid'];
    const performanceScore = reportJson.categories.performance.score * 100;
    
    console.log('\n📊 Core Web Vitals Results:');
    console.log('='.repeat(40));
    console.log(`Performance Score: ${performanceScore.toFixed(1)}/100`);
    console.log(`CLS: ${cls.numericValue.toFixed(4)} (${cls.score >= 0.9 ? '✅ Good' : cls.score >= 0.5 ? '⚠️  Needs Improvement' : '❌ Poor'})`);
    console.log(`LCP: ${(lcp.numericValue / 1000).toFixed(2)}s (${lcp.score >= 0.9 ? '✅ Good' : lcp.score >= 0.5 ? '⚠️  Needs Improvement' : '❌ Poor'})`);
    console.log(`FID: ${fid.numericValue.toFixed(0)}ms (${fid.score >= 0.9 ? '✅ Good' : fid.score >= 0.5 ? '⚠️  Needs Improvement' : '❌ Poor'})`);
    
    // CLS specific analysis
    if (cls.numericValue > 0.1) {
      console.log('\n🔍 CLS Analysis:');
      console.log('- Check images for missing dimensions');
      console.log('- Ensure proper aspect ratios');
      console.log('- Optimize font loading');
      console.log('- Review masonry/grid layouts');
    }
    
    // Save detailed report
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(reportJson, null, 2));
    console.log(`\n📄 Detailed report saved to: ${OUTPUT_FILE}`);
    
    return reportJson;
    
  } catch (error) {
    console.error('Error running Lighthouse:', error);
  } finally {
    await chrome.kill();
  }
}

// Quick CLS test function
async function quickCLSTest() {
  console.log('🔧 Quick CLS Test Mode');
  console.log('This will focus specifically on layout shift detection\n');
  
  const chrome = await chromeLauncher.launch({
    chromeFlags: ['--headless', '--no-sandbox']
  });

  const options = {
    logLevel: 'error',
    output: 'json',
    onlyAudits: ['cumulative-layout-shift', 'layout-shift-elements'],
    port: chrome.port
  };

  try {
    const runnerResult = await lighthouse(TEST_URL, options);
    const cls = runnerResult.lhr.audits['cumulative-layout-shift'];
    const elements = runnerResult.lhr.audits['layout-shift-elements'];
    
    console.log(`CLS Score: ${cls.numericValue.toFixed(4)}`);
    
    if (elements && elements.details && elements.details.items && elements.details.items.length > 0) {
      console.log('\n🎯 Elements causing layout shifts:');
      elements.details.items.forEach((item, index) => {
        console.log(`  ${index + 1}. ${item.node.snippet} (Score: ${item.score.toFixed(4)})`);
      });
    } else {
      console.log('\n📊 No specific layout shift elements detected in this audit');
    }
    
  } catch (error) {
    console.error('Error in quick test:', error);
  } finally {
    await chrome.kill();
  }
}

// Check if running in quick mode
if (process.argv.includes('--quick')) {
  quickCLSTest();
} else {
  runLighthouse();
}
