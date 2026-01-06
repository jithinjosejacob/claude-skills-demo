# Where to View AI Code Review Results

This guide shows you all the places where you can find the AI code review results in your GitHub repository.

## 📍 Location 1: GitHub Actions Summary Tab

**Best for**: Reading the complete, detailed review report

### How to Access
1. Go to your repository on GitHub
2. Click the **Actions** tab
3. Click on the workflow run (e.g., "AI Code Review #42")
4. Click the **Summary** tab (default view)

### What You'll See
- Complete AI review report with all sections
- All findings categorized by severity
- Recommendations and suggestions
- Direct link to download the full report

### Why Use This
- Most comprehensive view
- Easy to read formatted markdown
- Includes all details from the AI analysis
- Persists with the workflow run

---

## 📍 Location 2: Pull Request Comment

**Best for**: Quick overview while reviewing the PR

### How to Access
1. Go to the Pull Request
2. Scroll to the **Conversation** tab
3. Look for the comment from "github-actions[bot]"
4. The comment will have header: "🤖 AI Code Review Report"

### What You'll See
```
🤖 AI Code Review Report

Review Summary
| Status | Critical | Major | Minor |
|--------|----------|-------|-------|
| ✅ approved with suggestions | 0 | 2 | 5 |

📋 Full Review Details (click to expand)
[Collapsed review details - click to expand]

🔗 View Full Report in Actions
Powered by Claude Sonnet 4.5 via CI/CD
```

### Features
- **Summary Table**: Quick stats on issue counts
- **Collapsible Details**: Click to expand full review
- **Status Indicator**: Emoji shows approval status
  - ✅ Approved / Approved with suggestions
  - ❌ Changes requested
  - ❓ Unknown status
- **Direct Link**: Jump to full report in Actions

### Why Use This
- Visible while reviewing PR code
- Quick glance at issue counts
- Doesn't clutter the conversation (collapsed by default)
- Updates automatically when new commits pushed

---

## 📍 Location 3: PR Status Checks

**Best for**: Quick pass/fail status

### How to Access

**Option A - PR Overview:**
1. Go to the Pull Request
2. Scroll to the checks section at the bottom
3. Look for "AI Code Review" status

**Option B - Checks Tab:**
1. Go to the Pull Request
2. Click the **Checks** tab
3. Find "AI Code Review" in the list

**Option C - Commit List:**
1. Go to the PR **Commits** tab
2. Look at the status icons next to each commit
3. Click the status icon for details

### What You'll See
```
✅ AI Code Review — ✅ Critical: 0, Major: 2
```

or

```
❌ AI Code Review — ❌ Critical: 2, Major: 5
```

### Status Indicators
- ✅ **Success (Green)**: No blocking issues
- ❌ **Failure (Red)**: Critical or major issues found

### Why Use This
- Instant visual feedback
- Shows up in all GitHub PR views
- Clicking takes you to full workflow run
- Part of branch protection rules (if configured)

---

## 📍 Location 4: Downloadable Artifact

**Best for**: Offline review, archiving, or sharing

### How to Access
1. Go to **Actions** tab
2. Click on the workflow run
3. Scroll down to the **Artifacts** section
4. Click "ai-review-report" to download

### What You'll Download
- **File**: `claude-review-report.md`
- **Format**: Markdown
- **Size**: Typically < 50KB
- **Retention**: 30 days (configurable)

### Why Use This
- Save for offline reading
- Share with team members via email/Slack
- Archive important reviews
- Process with other tools
- Compare reviews across commits

---

## 🔄 Review Update Behavior

### When Code Changes
- **New commit pushed**: Bot updates the existing comment (doesn't spam)
- **Re-run manually**: Overwrites previous results
- **New PR opened**: Creates a new comment

### When Workflow Re-runs
- **Summary tab**: Shows latest results
- **PR comment**: Updates with latest findings
- **Status check**: Updates to reflect current state
- **Artifact**: New version uploaded

---

## ⚙️ Configuration Options

### Change Where Reports Appear

Edit [.github/workflows/ai-code-review.yml](.github/workflows/ai-code-review.yml):

**Disable PR Comments:**
```yaml
- name: Post PR Comment with Summary
  if: false  # Change to disable
```

**Disable Status Checks:**
```yaml
- name: Create Status Check
  if: false  # Change to disable
```

**Disable Job Summary:**
```yaml
- name: Generate Review Summary
  if: false  # Change to disable
```

**Change Artifact Retention:**
```yaml
- name: Upload Review Report
  with:
    retention-days: 90  # Default is 30
```

---

## 💡 Tips & Best Practices

### For Developers
1. **Check PR comment first** - Quick overview of what needs attention
2. **Click "Full Review Details"** - If you see issues in your area
3. **Use Actions summary** - For complete context on complex issues
4. **Download artifact** - If you need to review offline or share

### For Reviewers
1. **Look at status checks** - Quick pass/fail before detailed review
2. **Read PR comment summary** - Understand AI findings before your review
3. **Cross-reference with code** - Compare AI suggestions with actual changes
4. **Use as starting point** - AI catches common issues, you catch logic issues

### For Teams
1. **Set up branch protection** - Require "AI Code Review" to pass
2. **Review weekly trends** - Track issue counts over time
3. **Customize skill prompts** - Focus on your team's priorities
4. **Share artifacts** - Discuss in team meetings

---

## 🎯 Quick Reference

| Location | Access Speed | Detail Level | Best For |
|----------|-------------|--------------|----------|
| **Actions Summary** | Moderate | Complete | Deep dive |
| **PR Comment** | Fast | Summary + Full | Quick overview |
| **Status Check** | Instant | Minimal | Pass/fail |
| **Artifact** | Slow | Complete | Offline/Archive |

---

## 🆘 Troubleshooting

### "I don't see a PR comment"
- Check the workflow completed successfully
- Verify `pull-requests: write` permission is enabled
- Look in the Actions log for error messages

### "Status check not appearing"
- Ensure workflow ran (check Actions tab)
- Verify it's a pull request (not a direct push)
- Check permissions include `contents: read`

### "Summary tab is empty"
- Workflow may have failed before summary generation
- Check individual step logs for errors
- Verify `claude-review-report.md` was created

### "Artifact not available"
- Artifacts expire after 30 days by default
- Check workflow completed (artifacts only saved if step runs)
- Verify storage quota isn't exceeded

---

## 📚 Related Documentation

- [CI-CD-SETUP.md](CI-CD-SETUP.md) - Complete setup guide
- [.github/workflows/ai-code-review.yml](.github/workflows/ai-code-review.yml) - Workflow configuration
- [scripts/ci-review.js](scripts/ci-review.js) - Review script
- [.claude/skills/pr-reviewer/SKILL.md](.claude/skills/pr-reviewer/SKILL.md) - Review criteria
