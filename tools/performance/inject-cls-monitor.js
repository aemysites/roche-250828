/**
 * CLS Monitor Injection Script
 * This script can be injected into your AEM site to monitor CLS in real-time
 */

// Create and inject the Web Vitals script
const script = document.createElement('script');
script.type = 'module';
script.innerHTML = `
import { onCLS, onLCP, onFID } from 'https://unpkg.com/web-vitals@3/dist/web-vitals.js';

// Create monitoring dashboard
const dashboard = document.createElement('div');
dashboard.id = 'cls-monitor';
dashboard.style.cssText = \`
    position: fixed;
    top: 10px;
    right: 10px;
    background: #fff;
    padding: 15px;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    z-index: 10000;
    min-width: 250px;
    font-family: Arial, sans-serif;
    font-size: 12px;
    border: 2px solid #ccc;
\`;

dashboard.innerHTML = \`
    <h3 style="margin: 0 0 10px 0; font-size: 14px;">🔍 CLS Monitor</h3>
    <div id="cls-score" style="margin: 5px 0; font-weight: bold;">CLS: Loading...</div>
    <div id="lcp-score" style="margin: 5px 0;">LCP: Loading...</div>
    <div id="fid-score" style="margin: 5px 0;">FID: Loading...</div>
    <div id="cls-log" style="margin-top: 10px; max-height: 150px; overflow-y: auto; background: #f8f9fa; padding: 8px; border-radius: 4px; font-family: monospace; font-size: 10px;">
        <div>Monitoring layout shifts...</div>
    </div>
    <button onclick="this.parentElement.remove()" style="margin-top: 10px; padding: 4px 8px; font-size: 10px; background: #dc3545; color: white; border: none; border-radius: 3px; cursor: pointer;">Close</button>
\`;

document.body.appendChild(dashboard);

let clsEntries = [];
let currentCLS = 0;

function updateMetric(id, value, thresholds, unit = '') {
    const element = document.getElementById(id);
    if (!element) return;
    
    let className = 'good';
    if (value > thresholds.poor) className = 'poor';
    else if (value > thresholds.good) className = 'needs-improvement';
    
    const color = className === 'good' ? '#0d7377' : className === 'needs-improvement' ? '#fa9500' : '#d73527';
    element.style.color = color;
    element.textContent = \`\${id.toUpperCase()}: \${value.toFixed(4)}\${unit}\`;
}

function logLayoutShift(entry) {
    const log = document.getElementById('cls-log');
    if (!log) return;
    
    const div = document.createElement('div');
    div.style.cssText = 'margin: 2px 0; padding: 2px 4px; background: #fff3cd; border-left: 3px solid #856404;';
    div.textContent = \`Shift: \${entry.value.toFixed(4)} at \${new Date().toLocaleTimeString()}\`;
    log.appendChild(div);
    log.scrollTop = log.scrollHeight;
}

// Monitor CLS with detailed logging
onCLS((metric) => {
    currentCLS = metric.value;
    updateMetric('cls-score', metric.value, { good: 0.1, poor: 0.25 });
    
    // Log individual layout shift entries
    metric.entries.forEach(entry => {
        if (!clsEntries.includes(entry)) {
            clsEntries.push(entry);
            logLayoutShift(entry);
            
            // Flash border to indicate layout shift
            document.body.style.border = '3px solid red';
            setTimeout(() => {
                document.body.style.border = '';
            }, 200);
        }
    });
}, { reportAllChanges: true });

// Monitor LCP
onLCP((metric) => {
    updateMetric('lcp-score', metric.value, { good: 2500, poor: 4000 }, 'ms');
});

// Monitor FID
onFID((metric) => {
    updateMetric('fid-score', metric.value, { good: 100, poor: 300 }, 'ms');
});

console.log('🔍 CLS Monitor injected! Watch the dashboard in the top-right corner.');
`;

document.head.appendChild(script);

console.log('CLS Monitor injection script loaded. Monitor will appear shortly.');
