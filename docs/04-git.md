# Git Workflow Guide

This guide covers our Git workflow, branching strategy, commit conventions, and best practices for collaborative development.

## Branching Strategy

### Branch Structure

We use a feature branch workflow where each developer works on their own feature branch:

```
main (protected)
├── john-smith
├── jane-doe
├── mike-wilson
└── bug/critical-bug-fix (temporary)
```

### Branch Naming Convention

- **Feature branches**: `<your-name>`
- **Hotfix branches**: `hotfix/<brief-description>`
- **Release branches**: `release/<version>` (if needed)

### Branch Rules

1. **Main branch is protected** - No direct pushes allowed
2. **Each developer has ONE feature branch** - `<your-name>`
3. **All changes go through Pull Requests** - No exceptions
4. **Feature branches are long-lived** - Keep using the same branch
5. **Hotfix branches are temporary** - Delete after merging

## Daily Git Workflow

### 1. Start Your Day - Pull Latest Changes

```bash
# Switch to your feature branch
git checkout <your-name>

# Pull latest changes from main
git pull origin main

# If you have conflicts, resolve them now
git status
# Resolve any conflicts in your files
git add .
git commit -m "chore(merge): resolve conflicts with main"
```

### 2. Work on Your Feature

```bash
# Make your changes
# ... code, code, code ...

# Check what files you've changed
git status

# Review your changes
git diff

# Add files to staging
git add .
# Or add specific files
git add src/components/NewComponent.tsx backend/Controllers/NewController.cs

# Commit with proper message format
git commit -m "feat(auth): add user login validation"
```

### 3. Push Your Changes

```bash
# Push to your feature branch
git push origin <your-name>

# If first time pushing the branch
git push -u origin <your-name>
```

### 4. Create Pull Request (When Ready)

- Go to GitHub
- Create PR from `<your-name>` → `main`
- Fill out PR template (see PR Guidelines below)
- Request review from team members
- Wait for approval and merge

## Commit Message Format

We follow the **Conventional Commits** specification:

### Format Structure

```
<type>(scope): <description>

[optional body]

[optional footer(s)]
```

### Commit Types

- **feat**: New feature or enhancement
- **fix**: Bug fix
- **docs**: Documentation changes
- **style**: Code style changes (formatting, semicolons, etc.)
- **refactor**: Code refactoring without feature changes
- **perf**: Performance improvements
- **test**: Adding or updating tests
- **chore**: Build process, dependencies, tooling
- **ci**: CI/CD pipeline changes
- **revert**: Reverting previous commits

### Scope Examples

- **Frontend**: `auth`, `ui`, `api`, `components`, `pages`, `hooks`
- **Backend**: `auth`, `api`, `db`, `models`, `services`, `controllers`
- **Database**: `migration`, `seed`, `schema`
- **General**: `config`, `deps`, `docker`, `build`

### Commit Message Examples

#### Good Examples ✅

```bash
# New feature
git commit -m "feat(auth): add JWT token validation middleware"

# Bug fix
git commit -m "fix(api): handle null reference in user controller"

# Documentation
git commit -m "docs(readme): update installation instructions"

# Refactoring
git commit -m "refactor(components): extract common button component"

# Database changes
git commit -m "feat(db): add user preferences table migration"

# Configuration
git commit -m "chore(docker): update MySQL container configuration"

# Multiple changes (use body)
git commit -m "feat(auth): implement complete user authentication

- Add login/logout endpoints
- Create JWT token service
- Add user session middleware
- Update frontend login form"
```

#### Bad Examples ❌

```bash
# Too vague
git commit -m "update stuff"
git commit -m "fixes"
git commit -m "working on auth"

# No scope
git commit -m "feat: add thing"

# Wrong type
git commit -m "add(auth): new login" # should be "feat"

# Too long subject
git commit -m "feat(auth): add new user authentication system with JWT tokens and password validation and email verification"
```

## Common Git Commands

### Basic Operations

```bash
# Clone repository
git clone <repository-url>
cd <project-name>

# Create and switch to your feature branch
git checkout -b <your-name>

# Switch between branches
git checkout <your-name>
git checkout main

# Check current status
git status
git log --oneline -10

# View differences
git diff                    # Working directory vs staging
git diff --staged          # Staging vs last commit
git diff main             # Current branch vs main
```

### Keeping Your Branch Updated

```bash
# Method 1: Merge (preserves commit history)
git checkout <your-name>
git merge main

# Method 2: Rebase (cleaner history, but more complex)
git checkout <your-name>
git rebase main

# If you have conflicts during rebase:
git status              # See conflicted files
# Edit files to resolve conflicts
git add .
git rebase --continue

# To abort rebase if it gets messy:
git rebase --abort
```

### Undoing Changes

```bash
# Undo changes in working directory
git checkout -- <filename>
git restore <filename>

# Unstage files (undo git add)
git reset <filename>
git restore --staged <filename>

# Undo last commit (keep changes in working directory)
git reset --soft HEAD~1

# Undo last commit (discard changes)
git reset --hard HEAD~1

# Undo specific commit (creates new commit)
git revert <commit-hash>
```

### Stashing Changes

```bash
# Save current changes temporarily
git stash
git stash push -m "work in progress on login form"

# List stashes
git stash list

# Apply most recent stash
git stash pop

# Apply specific stash
git stash apply stash@{1}

# Drop a stash
git stash drop stash@{1}
```

## Git Configuration

### Set Up Your Git Identity

```bash
# Set your name and email (required)
git config --global user.name "Your Full Name"
git config --global user.email "your.email@company.com"

# Set default branch name
git config --global init.defaultBranch main

# Set default editor
git config --global core.editor "code --wait"  # VS Code
git config --global core.editor "vim"          # Vim

# Improve git log output
git config --global alias.lg "log --color --graph --pretty=format:'%Cred%h%Creset -%C(yellow)%d%Creset %s %Cgreen(%cr) %C(bold blue)<%an>%Creset' --abbrev-commit"
```

## Troubleshooting Common Issues

### Merge Conflicts

```bash
# When you get merge conflicts:
git status                  # See conflicted files

# Edit files to resolve conflicts (look for <<<< ==== >>>>)
# Then:
git add <resolved-files>
git commit -m "chore(merge): resolve conflicts with main"
```

### Accidentally Committed to Wrong Branch

```bash
# Move last commit to correct branch
git log --oneline -2        # Note the commit hash
git reset --hard HEAD~1     # Remove from current branch
git checkout correct-branch
git cherry-pick <commit-hash>
```

### Recover Lost Commits

```bash
# Find lost commits
git reflog

# Recover specific commit
git cherry-pick <commit-hash-from-reflog>

# Or reset to a previous state
git reset --hard <commit-hash-from-reflog>
```

## Best Practices Summary

### DO ✅

- Use your assigned feature branch: `<your-name>`
- Pull from main daily: `git pull origin main`
- Write descriptive commit messages with proper format
- Create PRs for all changes to main
- Test your changes before pushing
- Keep commits focused and atomic
- Use meaningful branch names for hotfixes

### DON'T ❌

- Never commit directly to main branch
- Don't use generic commit messages like "fix" or "update"
- Don't commit sensitive information (passwords, keys)
- Don't commit large binary files without discussion
- Don't force push to shared branches
- Don't create multiple feature branches per developer
- Don't leave dead/unused branches hanging around

### Code Review Checklist

Before creating a PR, ensure:

- [ ] Code follows project conventions
- [ ] All tests pass locally
- [ ] No debugging code left in
- [ ] Environment variables not hardcoded
- [ ] Database migrations included (if needed)
- [ ] Documentation updated (if needed)
- [ ] Commit messages follow convention
- [ ] Branch is up to date with main

This Git workflow ensures clean commit history, easy collaboration, and smooth deployments! 🚀
