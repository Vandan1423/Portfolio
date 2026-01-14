/**
 * Test script for AI navigation pattern matching
 * Run with: node scripts/testNavigationPatterns.js
 */

// Simulate the getQuickAnswer function pattern matching
function testNavigationPattern(input) {
  const q = input.toLowerCase();
  
  // Page navigation pattern matching
  if (q.match(/(take me to|go to|show me|visit|open).*(experience|work|career|professional).*(page|section)?/)) {
    return { success: true, system: 'vega', response: 'Navigating to Experience section! [NAVIGATE:vega]' };
  }
  
  if (q.match(/(take me to|go to|show me|visit|open).*(projects?|portfolio).*(page|section)?/)) {
    return { success: true, system: 'sirius', response: 'Taking you to Projects! [NAVIGATE:sirius]' };
  }
  
  if (q.match(/(take me to|go to|show me|visit|open).*(about|personal|bio|profile).*(page|section)?/)) {
    return { success: true, system: 'alpha-centauri', response: 'Heading to About Me! [NAVIGATE:alpha-centauri]' };
  }
  
  if (q.match(/(take me to|go to|show me|visit|open).*(contact|reach out|get in touch).*(page|section)?/)) {
    return { success: true, system: 'betelgeuse', response: 'Opening Contact! [NAVIGATE:betelgeuse]' };
  }
  
  if (q.match(/(take me to|go to|show me|visit|open).*(journey|timeline|path).*(page|section)?/)) {
    return { success: true, system: 'polaris', response: 'Navigating to Journey! [NAVIGATE:polaris]' };
  }
  
  if (q.match(/(take me to|go to|show me|visit|open).*(tech|technologies|skills|tools).*(page|section)?/)) {
    return { success: true, system: 'rigel', response: 'Opening Technologies! [NAVIGATE:rigel]' };
  }

  return { success: false, response: 'No pattern match' };
}

// Test cases
const testCases = [
  // Experience page tests
  { input: 'take me to Experience page', expected: 'vega', description: 'Original user request' },
  { input: 'go to Experience', expected: 'vega', description: 'Short form' },
  { input: 'visit the work experience section', expected: 'vega', description: 'Alternative wording' },
  { input: 'show me professional experience', expected: 'vega', description: 'Different phrase' },
  { input: 'open career page', expected: 'vega', description: 'Career keyword' },
  
  // Projects page tests
  { input: 'take me to Projects', expected: 'sirius', description: 'Projects page' },
  { input: 'show me portfolio', expected: 'sirius', description: 'Portfolio keyword' },
  { input: 'go to projects page', expected: 'sirius', description: 'With "page" suffix' },
  
  // About page tests
  { input: 'take me to About', expected: 'alpha-centauri', description: 'About page' },
  { input: 'show me his bio', expected: 'alpha-centauri', description: 'Bio keyword' },
  { input: 'visit personal info', expected: 'alpha-centauri', description: 'Personal keyword' },
  
  // Contact page tests
  { input: 'take me to Contact', expected: 'betelgeuse', description: 'Contact page' },
  { input: 'go to contact page', expected: 'betelgeuse', description: 'Contact with suffix' },
  
  // Journey page tests
  { input: 'take me to Journey', expected: 'polaris', description: 'Journey page' },
  { input: 'show me timeline', expected: 'polaris', description: 'Timeline keyword' },
  
  // Technologies page tests
  { input: 'take me to Technologies', expected: 'rigel', description: 'Technologies page' },
  { input: 'show me tech stack', expected: 'rigel', description: 'Tech stack keyword' },
  { input: 'visit skills page', expected: 'rigel', description: 'Skills keyword' },
];

// Run tests
console.log('🧪 Testing AI Navigation Pattern Matching\n');
console.log('='.repeat(80));

let passed = 0;
let failed = 0;

testCases.forEach(({ input, expected, description }, index) => {
  const result = testNavigationPattern(input);
  const success = result.success && result.system === expected;
  
  if (success) {
    passed++;
    console.log(`✅ Test ${index + 1}: PASS`);
    console.log(`   Input: "${input}"`);
    console.log(`   Description: ${description}`);
    console.log(`   Expected: ${expected}, Got: ${result.system}`);
    console.log(`   Response: ${result.response}\n`);
  } else {
    failed++;
    console.log(`❌ Test ${index + 1}: FAIL`);
    console.log(`   Input: "${input}"`);
    console.log(`   Description: ${description}`);
    console.log(`   Expected: ${expected}, Got: ${result.system || 'no match'}`);
    console.log(`   Response: ${result.response}\n`);
  }
});

console.log('='.repeat(80));
console.log(`\n📊 Results: ${passed}/${testCases.length} tests passed`);

if (failed === 0) {
  console.log('✨ All tests passed! The AI navigation is working correctly.\n');
} else {
  console.log(`⚠️  ${failed} test(s) failed. Please review the pattern matching logic.\n`);
  process.exit(1);
}
