# CI/CD Setup Guide

This guide explains how to set up AI-powered code reviews in your GitHub repository using Claude.

## Overview

The CI/CD integration automatically runs Claude AI code reviews on:
- Pull requests (opened, updated, or reopened)
- Pushes to main/develop branches
- Manual workflow triggers

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

This installs the `@anthropic-ai/sdk` package required for API integration.

### 2. Configure GitHub Secrets

Add your Anthropic API key to GitHub repository secrets:

1. Go to your repository on GitHub
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Name: `ANTHROPIC_API_KEY`
5. Value: Your Anthropic API key from https://console.anthropic.com/

### 3. Enable GitHub Actions

The workflow file is located at [.github/workflows/ai-code-review.yml](.github/workflows/ai-code-review.yml)

GitHub Actions should automatically detect and enable this workflow.

### 4. Test Locally (Optional)

You can test the review script locally before pushing:

```bash
export ANTHROPIC_API_KEY="your-api-key-here"
npm run ci-review
```

This will generate a `claude-review-report.md` file with the review results.

## How It Works

### Workflow Triggers

The workflow runs on:
- **Pull Requests**: Automatically reviews code changes
- **Push to main/develop**: Reviews merged code
- **Manual**: Can be triggered via GitHub Actions UI

### Review Process

1. **Checkout**: Pulls the latest code
2. **Setup**: Installs Node.js and dependencies
3. **Review**: Runs [scripts/ci-review.js](scripts/ci-review.js) which:
   - Loads the pr-reviewer skill instructions
   - Collects all code files from `src/`
   - Calls Claude API with comprehensive context
   - Generates a detailed review report
4. **Report**: Uploads the report as an artifact
5. **Comment**: Posts the review as a PR comment (for pull requests)
6. **Status Check**: Fails the build if critical issues are found

### Review Criteria

The AI reviews code for:

#### Code Quality
- Readability and maintainability
- Naming conventions
- Code duplication
- Function complexity
- Error handling

#### Security
- Input validation
- SQL injection vulnerabilities
- XSS vulnerabilities
- Authentication/authorization issues
- Sensitive data exposure

#### Performance
- Inefficient algorithms
- Memory leaks
- Unnecessary computations

#### Testing
- Test coverage
- Edge cases
- Test quality

#### Best Practices
- Language-specific conventions
- Framework patterns
- Project standards

## Files Overview

### Workflow Configuration
- [.github/workflows/ai-code-review.yml](.github/workflows/ai-code-review.yml) - GitHub Actions workflow

### Scripts
- [scripts/ci-review.js](scripts/ci-review.js) - Main review script that calls Claude API

### Skills
- [.claude/skills/pr-reviewer/SKILL.md](.claude/skills/pr-reviewer/SKILL.md) - Review instructions for Claude

### Configuration
- [package.json](package.json) - Node.js dependencies
- [.gitignore](.gitignore) - Ignored files

## Customization

### Modify Review Criteria

Edit [.claude/skills/pr-reviewer/SKILL.md](.claude/skills/pr-reviewer/SKILL.md) to customize:
- Review focus areas
- Severity levels
- Report format
- Specific checks

### Adjust File Scanning

Edit [scripts/ci-review.js](scripts/ci-review.js) to:
- Change max file size limit
- Add/remove file extensions
- Modify directory scanning logic
- Change API parameters

### Workflow Behavior

Edit [.github/workflows/ai-code-review.yml](.github/workflows/ai-code-review.yml) to:
- Change trigger conditions
- Modify branch names
- Adjust permissions
- Add additional steps

## Cost Considerations

Each review calls the Claude API which incurs costs based on:
- Input tokens (code + instructions sent)
- Output tokens (review report generated)

**Recommendations**:
- Run only on important branches (main, develop, release/*)
- Set file size limits (already configured)
- Use `workflow_dispatch` for manual reviews on demand
- Monitor usage in Anthropic Console

## Troubleshooting

### "ANTHROPIC_API_KEY not found"
- Ensure the secret is configured in GitHub repository settings
- Check the secret name matches exactly: `ANTHROPIC_API_KEY`

### Workflow doesn't trigger
- Verify `.github/workflows/` directory exists
- Check workflow file syntax with GitHub Actions validator
- Ensure repository has Actions enabled

### API rate limits
- Monitor your API usage in Anthropic Console
- Implement caching strategies for unchanged files
- Consider batching reviews for multiple commits

### Review report not posted
- Check workflow permissions include `pull-requests: write`
- Verify `GITHUB_TOKEN` has correct permissions
- Review workflow logs for errors

## Manual Testing

Test the script locally without pushing:

```bash
# Set your API key
export ANTHROPIC_API_KEY="sk-ant-..."

# Run the review
node scripts/ci-review.js

# Check the output
cat claude-review-report.md
```

## Example Output

When the workflow runs, you'll see:
1. ✅ Workflow status in the Actions tab
2. 📄 Review report as a downloadable artifact
3. 💬 Comment on the PR with review findings
4. ❌ or ✅ Build status based on severity

## Next Steps

1. **Initialize git repository** (if not already done):
   ```bash
   git init
   git add .
   git commit -m "Add CI/CD code review integration"
   ```

2. **Push to GitHub**:
   ```bash
   git remote add origin https://github.com/yourusername/claude-skills-demo.git
   git push -u origin main
   ```

3. **Create a test PR** to see the review in action

4. **Review the output** and customize as needed

## Resources

- [Anthropic API Documentation](https://docs.anthropic.com/)
- [GitHub Actions Documentation](https://docs.github.com/actions)
- [Claude Code Documentation](https://github.com/anthropics/claude-code)

## Support

For issues or questions:
- Check workflow logs in GitHub Actions
- Review Anthropic API status
- Consult the documentation links above
