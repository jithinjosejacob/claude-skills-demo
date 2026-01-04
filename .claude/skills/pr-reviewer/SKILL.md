---
name: pr-reviewer
description: Comprehensive pull request reviewer that analyzes code changes, identifies issues, and suggests improvements.
allowed-tools:
  - bash
  - read_file
  - grep_search
  - file_search
  - glob
user-invocable: true
---

# PR Reviewer Skill

This skill performs comprehensive pull request reviews by analyzing code changes, identifying potential issues, and suggesting improvements.

## Instructions

When this skill is invoked, perform the following steps:

### 1. Gather PR Information
<!-- - Check if currently on a git branch or if a PR number/URL is provided
- Use `git status` to verify repository state
- Use `git diff` to see staged/unstaged changes
- Use `gh pr view <number>` if a PR number is provided
- Use `git log` to understand commit history -->

### 2. Analyze Code Changes
Review the following aspects:

#### Code Quality
- Code readability and maintainability
- Proper naming conventions
- Code duplication
- Function/method complexity
- Proper error handling

#### Security
- Input validation
- SQL injection vulnerabilities
- XSS vulnerabilities
- Authentication/authorization issues
- Sensitive data exposure
- Dependency vulnerabilities

#### Performance
- Inefficient algorithms or queries
- Memory leaks
- Unnecessary computations
- N+1 query problems

#### Testing
- Test coverage for new code
- Edge cases handled
- Test quality and maintainability

#### Documentation
- Code comments where needed (not obvious logic)
- Updated README or docs if needed
- API documentation

#### Best Practices
- Language-specific best practices
- Framework conventions
- Project-specific patterns

### 3. Check Technical Details
- Run tests if available: `npm test`, `pytest`, etc.
- Check build: `npm run build`, `cargo build`, etc.
- Run linter if available: `eslint`, `pylint`, etc.
- Verify no merge conflicts

### 4. Provide Review Summary

Structure your review as follows:

```markdown
## PR Review Summary

### Overview
[Brief description of changes]

### Positive Aspects
- [Things done well]

### Issues Found

#### Critical
- [Security vulnerabilities, breaking changes, data loss risks]

#### Major
- [Bugs, performance issues, test failures]

#### Minor
- [Code style, documentation, minor improvements]

### Recommendations
1. [Prioritized list of changes]

### Test Results
[Output from running tests/build]

### Approval Status
- [ ] Approved - Ready to merge
- [ ] Approved with minor suggestions
- [ ] Changes requested
```

## Usage Examples

### Review current branch changes
```
/pr-reviewer
```

### Review specific PR
```
/pr-reviewer 123
```

### Review with specific focus
```
/pr-reviewer --focus security
```

## Notes
- Always run tests before approving
- Be constructive and specific in feedback
- Prioritize security and correctness issues
- Consider project context and conventions
- Provide code examples for suggestions when helpful
