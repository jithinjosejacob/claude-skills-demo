#!/usr/bin/env node

/**
 * CI/CD Code Review Script
 *
 * This script integrates Claude AI code review into CI/CD pipelines.
 * It reads the pr-reviewer skill instructions and uses the Anthropic API
 * to perform comprehensive code reviews.
 *
 * Environment Variables:
 *   ANTHROPIC_API_KEY - Required for Claude API access
 *   PR_NUMBER - Pull request number (optional)
 *   GITHUB_TOKEN - GitHub token for API access (optional)
 */

const Anthropic = require('@anthropic-ai/sdk');
const fs = require('fs');
const path = require('path');

// Configuration
const OUTPUT_FILE = 'claude-review-report.md';
const SKILL_PATH = '.claude/skills/pr-reviewer/SKILL.md';
const MAX_FILE_SIZE = 10000; // Max characters per file to review

/**
 * Main execution function
 */
async function main() {
  console.log('🤖 Starting AI Code Review...\n');

  // Validate environment
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error('❌ Error: ANTHROPIC_API_KEY environment variable is required');
    process.exit(1);
  }

  try {
    // Initialize Anthropic client
    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });

    // Load skill instructions
    const skillInstructions = loadSkillInstructions();

    // Collect code files
    const codeFiles = collectCodeFiles();
    console.log(`📁 Found ${codeFiles.length} files to review\n`);

    // Build review prompt
    const prompt = buildReviewPrompt(skillInstructions, codeFiles);

    // Call Claude API
    console.log('🔄 Calling Claude API...\n');
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 4096,
      messages: [{
        role: 'user',
        content: prompt
      }]
    });

    // Extract review content
    const reviewContent = message.content[0].text;

    // Save report
    fs.writeFileSync(OUTPUT_FILE, reviewContent);
    console.log(`✅ Review report saved to ${OUTPUT_FILE}\n`);

    // Print review to console
    console.log('=' .repeat(80));
    console.log(reviewContent);
    console.log('='.repeat(80));

    // Analyze review for blocking issues
    const hasBlockingIssues = analyzeReviewSeverity(reviewContent);

    if (hasBlockingIssues) {
      console.log('\n⚠️  Blocking issues found - Review requires attention');
      process.exit(1);
    } else {
      console.log('\n✅ Review completed successfully - No blocking issues');
      process.exit(0);
    }

  } catch (error) {
    console.error('❌ Error during code review:', error.message);
    if (error.status) {
      console.error(`API Status: ${error.status}`);
    }
    process.exit(1);
  }
}

/**
 * Load skill instructions from SKILL.md
 */
function loadSkillInstructions() {
  try {
    const skillPath = path.join(process.cwd(), SKILL_PATH);
    if (!fs.existsSync(skillPath)) {
      console.warn(`⚠️  Warning: Skill file not found at ${skillPath}`);
      return 'Perform a comprehensive code review focusing on code quality, security, performance, and best practices.';
    }
    return fs.readFileSync(skillPath, 'utf8');
  } catch (error) {
    console.warn('⚠️  Warning: Could not load skill instructions, using default');
    return 'Perform a comprehensive code review.';
  }
}

/**
 * Collect all relevant code files
 */
function collectCodeFiles() {
  const files = [];
  const srcDir = path.join(process.cwd(), 'src');

  // Scan src directory
  if (fs.existsSync(srcDir)) {
    scanDirectory(srcDir, files, 'src');
  }

  // Add config files
  const configFiles = ['package.json', 'config.json', 'tsconfig.json', '.eslintrc.js'];
  configFiles.forEach(file => {
    const filePath = path.join(process.cwd(), file);
    if (fs.existsSync(filePath)) {
      files.push({
        name: file,
        relativePath: file,
        content: fs.readFileSync(filePath, 'utf8')
      });
    }
  });

  return files;
}

/**
 * Recursively scan directory for code files
 */
function scanDirectory(dir, files, relativePath) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  entries.forEach(entry => {
    const fullPath = path.join(dir, entry.name);
    const relPath = path.join(relativePath, entry.name);

    // Skip node_modules, .git, etc.
    if (entry.name.startsWith('.') || entry.name === 'node_modules') {
      return;
    }

    if (entry.isDirectory()) {
      scanDirectory(fullPath, files, relPath);
    } else if (entry.isFile()) {
      // Include common code file extensions
      const ext = path.extname(entry.name).toLowerCase();
      const codeExtensions = ['.js', '.ts', '.jsx', '.tsx', '.py', '.java', '.go', '.rs', '.cpp', '.c', '.h'];

      if (codeExtensions.includes(ext)) {
        const content = fs.readFileSync(fullPath, 'utf8');

        // Skip very large files
        if (content.length <= MAX_FILE_SIZE) {
          files.push({
            name: entry.name,
            relativePath: relPath,
            content: content
          });
        } else {
          console.warn(`⚠️  Skipping large file: ${relPath} (${content.length} chars)`);
        }
      }
    }
  });
}

/**
 * Build comprehensive review prompt
 */
function buildReviewPrompt(skillInstructions, codeFiles) {
  let prompt = `${skillInstructions}\n\n`;
  prompt += '---\n\n';
  prompt += '# Code Review Request\n\n';
  prompt += `Please review the following codebase according to the skill instructions above.\n\n`;
  prompt += `**Total files**: ${codeFiles.length}\n`;
  prompt += `**Review date**: ${new Date().toISOString()}\n`;
  prompt += `**CI/CD**: GitHub Actions\n\n`;

  // Add file contents
  prompt += '## Files to Review\n\n';
  codeFiles.forEach(file => {
    prompt += `### ${file.relativePath}\n\n`;
    prompt += '```' + path.extname(file.name).slice(1) + '\n';
    prompt += file.content;
    prompt += '\n```\n\n';
  });

  prompt += '---\n\n';
  prompt += 'Please provide a comprehensive review following the format specified in the skill instructions.';

  return prompt;
}

/**
 * Analyze review content for blocking issues
 */
function analyzeReviewSeverity(reviewContent) {
  const lowerContent = reviewContent.toLowerCase();

  // Check for blocking keywords
  const blockingKeywords = [
    'critical',
    'security vulnerability',
    'changes requested',
    'blocking',
    'must fix',
    'sql injection',
    'xss',
    'authentication bypass'
  ];

  return blockingKeywords.some(keyword => lowerContent.includes(keyword));
}

// Execute
main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
