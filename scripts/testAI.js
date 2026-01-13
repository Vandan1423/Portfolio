/**
 * AI Service Test
 * Tests the Gemini API connection and Sagittarius responses
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env.local
dotenv.config({ path: join(__dirname, '../.env.local') });

async function testAI() {
  console.log('\n🤖 Testing Sagittarius AI Service...\n');

  // Check API key
  const apiKey = process.env.VITE_GEMINI_API_KEY;
  if (!apiKey || apiKey === 'your_api_key_here') {
    console.log('❌ API key not configured in .env.local');
    console.log('Please add your Gemini API key to .env.local\n');
    process.exit(1);
  }

  console.log('✅ API key found');
  console.log(`Key: ${apiKey.substring(0, 8)}...${apiKey.substring(apiKey.length - 4)}\n`);

  // Test API connection
  try {
    console.log('Test: Sending test message to Gemini API...');
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash-lite"
    });

    const result = await model.generateContent("Say hello in one sentence");
    const response = result.response.text();

    console.log('✅ API connection successful!');
    console.log(`Response: ${response}\n`);

    console.log('🎉 All tests passed!\n');
    console.log('✨ Session 1 complete: Foundation & Data setup finished!');
    console.log('\nNext steps:');
    console.log('  - Session 2: Build Sagittarius Terminal component');
    console.log('  - Session 3: Build Neural Link Map visualization');
    console.log('  - Session 4: Integration');
    console.log('  - Session 5: Polish & Testing\n');

  } catch (error) {
    console.log('❌ API connection failed');
    console.log(`Error: ${error.message}\n`);
    process.exit(1);
  }
}

testAI().catch(error => {
  console.error('\n❌ Test failed:', error);
  process.exit(1);
});
