---
title: Documentation Conventions
date-created: 2024-08-07
date-updated: 2025-08-07
status: active
type: reference
---

# Documentation Conventions

This guide establishes documentation standards for the Camber Backend project to ensure consistency, discoverability, and maintainability across all documentation.

## Frontmatter Standards

All markdown documentation files must include YAML frontmatter with the following fields:

```yaml
---
title: [Descriptive title of the document]
date-created: YYYY-MM-DD
date-updated: YYYY-MM-DD
status: [draft | active | deprecated | archived]
type: [plan | guide | architecture | reference | issue]
supersedes: [filename.md]      # optional - which doc this replaces
superseded-by: [filename.md]   # optional - which doc replaces this
---
```

### Field Definitions

- **title**: Clear, descriptive title (use title case)
- **date-created**: ISO format date when document was first created
- **date-updated**: ISO format date of last significant update
- **status**: Current lifecycle state of the document
  - `draft`: Work in progress, not yet finalized
  - `active`: Current and actively maintained
  - `deprecated`: Outdated but kept for reference
  - `archived`: Historical record only, no longer relevant
- **type**: Document category
  - `plan`: Planning documents, proposals, roadmaps
  - `guide`: How-to guides, tutorials, procedures
  - `architecture`: System design, technical architecture
  - `reference`: API docs, configuration references
  - `issue`: Bug reports, problem documentation
- **supersedes/superseded-by**: Track document evolution and replacements

## File Naming Conventions

### General Rules
- Use lowercase kebab-case: `implementation-guide.md`
- Be descriptive but concise
- No spaces or special characters except hyphens
- `.md` extension for all markdown files

### Service Documentation
- **No service name prefix** within service directories
- ❌ Wrong: `/services/cal-service/cal-service-implementation-guide.md`
- ✅ Correct: `/services/cal-service/implementation-guide.md`

### Common File Names
- `README.md` - Overview and quick start
- `architecture.md` - Technical architecture
- `implementation-guide.md` - Implementation details
- `api.md` or `API.md` - API reference
- `best-practices.md` - Recommended patterns
- `next-steps.md` - Future work and roadmap

## Issue Documentation Standards

### Issue Naming Convention

Issues should be filed in `/docs/issues/` using the following naming pattern:
`[TYPE]-[NUMBER]-[brief-description].md`

Example: `BUG-004-alert-service-jsonb-conversion-error.md`

### Issue Type Prefixes

#### BUG-XXX
**Use for**: Defects and errors preventing correct functionality
- System crashes, errors, or exceptions
- Incorrect behavior or logic errors
- Data corruption or loss
- Integration failures between services
- Race conditions and timing issues

#### SECURITY-XXX
**Use for**: Security vulnerabilities and risks
- Authentication/authorization bypass
- Data exposure or leakage
- Privilege escalation vulnerabilities
- Container or infrastructure security issues
- Exposed credentials or secrets
- Input validation failures that could lead to exploits

#### IMPROVEMENT-XXX
**Use for**: Enhancements that don't fix broken functionality
- Performance optimizations
- Better error handling or logging
- Code quality improvements
- Missing features that would improve the system
- Technical debt reduction
- Developer experience improvements

#### FEATURE-XXX (Optional)
**Use for**: Major new functionality
- New services or major components
- Significant workflow additions
- Large-scale integrations
- Breaking changes or major refactors

### Issue Document Format

All issue documents should follow this structure:

```markdown
# [TYPE]-[NUMBER]: [Descriptive Title]

**Date Discovered**: YYYY-MM-DD  
**Severity**: [Critical | High | Medium | Low]  
**Status**: [Open | In Progress | Completed | Won't Fix]  
**Component**: [Affected service(s) or system area]  
**Effort**: [Small (1-2 hours) | Medium (3-5 hours) | Large (6+ hours)]  
**Date Completed**: YYYY-MM-DD  # Only if completed

## Summary

Brief description of the issue in 1-2 sentences.

## [Issue Type] Description
# Use "Bug Description", "Security Risk", "Problem Description", etc.

Detailed explanation of the issue, including:
- Current behavior
- Expected behavior
- Steps to reproduce (for bugs)
- Attack vectors (for security issues)

## Impact

Describe the impact on:
- System functionality
- User experience
- Business operations
- Security posture

## Root Cause

Technical explanation of why this issue exists.

## Fix Implementation / Proposed Solution

Detailed solution including:
- Code changes required
- Configuration updates
- Migration steps if needed

## Testing Procedure

How to verify the fix:
- Test cases
- Expected results
- Edge cases to check

## Prevention

How to prevent similar issues in the future.

## Notes

Additional context, references, or considerations.

## Resolution Notes

# Added when issue is resolved
- What was actually done
- Any deviations from the proposed solution
- Lessons learned
- Related commits or PRs
```

### Severity Guidelines

- **Critical**: System is broken, data loss risk, or severe security vulnerability
- **High**: Major functionality impaired or significant security risk
- **Medium**: Important functionality affected but workarounds exist
- **Low**: Minor issues, cosmetic problems, or nice-to-have improvements

### Issue Lifecycle

1. **Discovery**: Create issue with status "Open"
2. **Assignment**: Update status to "In Progress" when work begins
3. **Resolution**: Update status to "Completed", add completion date and resolution notes
4. **Archival**: Move to `/docs/issues/archive/` after 30 days if completed

## Directory Structure

### Document Lifecycle Management

1. **Creating Documents**: Start with status: `draft`
2. **Finalizing**: Change to status: `active` when complete
3. **Updating**: Update `date-updated` for significant changes
4. **Deprecating**: 
   - Change status to `deprecated`
   - Add `superseded-by` field if applicable
   - Consider moving to `archive/` subdirectory
5. **Archiving**: 
   - Change status to `archived`
   - Move to `archive/` subdirectory
   - Keep for historical reference

## Service Development Workflow

New services and major features follow a documentation-driven development pattern that supports incremental progress and clear handoffs between development sessions:

1. **design.md** - Business context, technical approach, and success criteria
2. **implementation-guide.md** - Translates design into concrete implementation steps
3. **dev-tasks.md** - Checklist of specific tasks, checked off as completed
4. **next-steps.md** - Documents incomplete items and future enhancements

This workflow ensures continuity across development sessions and provides clear context for LLM-assisted development. Each document builds on the previous, creating a traceable path from concept to implementation.

**Example**: See `/docs/services/alert-service/` for a complete reference implementation of this pattern.

## Document Structure Guidelines

### Standard Sections
1. **Title** (H1) - Should match frontmatter title
2. **Overview** or **Summary** - Brief description
3. **Main Content** - Organized with clear hierarchy
4. **References** or **See Also** - Related documents

### Heading Hierarchy
- Use consistent heading levels
- Don't skip levels (H1 → H3)
- One H1 per document
- Use sentence case for headings

### Code Blocks
- Always specify language for syntax highlighting
- Use ` ```yaml `, ` ```typescript `, etc.
- Include file paths as comments when showing file contents

## Cross-References

### Internal Links
- Use relative paths from repository root
- ✅ Correct: `[Implementation Guide](/docs/services/cal-service/implementation-guide.md)`
- ❌ Wrong: `[Implementation Guide](implementation-guide.md)`

### External Links
- Use descriptive link text
- Include link purpose if not obvious

## Templates

### Basic Document Template
```markdown
---
title: [Document Title]
date-created: YYYY-MM-DD
date-updated: YYYY-MM-DD
status: draft
type: [plan | guide | architecture | reference | issue]
---

# [Document Title]

## Overview

Brief description of what this document covers and its purpose.

## [Main Content Sections]

...

## References

- [Related Document 1](/docs/path/to/doc1.md)
- [Related Document 2](/docs/path/to/doc2.md)
```

### Architecture Document Template
```markdown
---
title: [Service Name] Architecture
date-created: YYYY-MM-DD
date-updated: YYYY-MM-DD
status: active
type: architecture
---

# [Service Name] Architecture

## Overview

High-level description of the service and its purpose.

## Architecture Design

### Components
...

### Data Flow
...

### Integration Points
...

## Technical Stack
...

## Database Schema
...

## API Endpoints
...
```

## Maintenance Guidelines

### Regular Reviews
- Review `active` documents quarterly
- Update `date-updated` when making significant changes
- Move outdated documents to `archived` status

### Deprecation Process
1. Update frontmatter status to `deprecated`
2. Add deprecation notice at top of document
3. Update any documents that link to it
4. Move to `archive/` after 30 days

### Archive Criteria
Documents should be archived when:
- Implementation has significantly diverged
- Feature/service has been removed
- Document is purely historical (old plans, obsolete designs)

## Examples

### Active Document Example
```yaml
---
title: Calendar Service Implementation Guide
date-created: 2024-01-15
date-updated: 2024-01-20
status: active
type: guide
supersedes: plan.md
---
```

### Archived Document Example
```yaml
---
title: Calendar Service Initial Plan
date-created: 2024-01-10
date-updated: 2024-01-15
status: archived
type: plan
superseded-by: implementation-guide.md
---
```

## Quick Reference

| Status | Meaning | Action |
|--------|---------|--------|
| draft | Work in progress | Continue editing |
| active | Current documentation | Keep updated |
| deprecated | Outdated but referenced | Plan to archive |
| archived | Historical only | Move to archive/ |

### Issue Type Quick Reference

| Prefix | Use For | Example |
|--------|---------|----------|
| BUG | Broken functionality | System errors, crashes, data loss |
| SECURITY | Security vulnerabilities | Auth bypass, data exposure, privilege escalation |
| IMPROVEMENT | Enhancements | Performance, code quality, missing features |
| FEATURE | New functionality | New services, major workflows |

## Git Commit Conventions

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification for clear and consistent commit messages.

### Format

```
<type>[(optional scope)][!]: <subject>

[optional body]

[optional footer(s)]
```

### Types

- `feat`: New feature or functionality
- `fix`: Bug fix
- `docs`: Documentation only changes
- `style`: Code style changes (formatting, missing semicolons, etc.)
- `refactor`: Code change that neither fixes a bug nor adds a feature
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `chore`: Maintenance tasks, dependency updates, etc.
- `build`: Changes to build system or external dependencies

### Scopes (Optional but Recommended)

Use scopes to indicate which part of the codebase is affected:

**Service Scopes:**
- `cal-service`, `pim-service`, `edi-service`, `email-service`, etc.

**Common Scopes:**
- `docker`: Docker-related changes
- `deps`: Dependency updates
- `api`: API Gateway changes
- `docs`: Documentation updates (can be combined with docs type)
- `db`: Database schema or migration changes

### Rules

1. **Subject Line**
   - Maximum 50 characters (hard limit)
   - Start with lowercase letter (both type and description after colon)
   - No period at the end
   - Use imperative mood ("add" not "added" or "adds")
   
   **Capitalization Examples:**
   - ✅ `feat: add user authentication` (all lowercase)
   - ✅ `fix: resolve memory leak in worker` (all lowercase)
   - ❌ `feat: Add user authentication` (incorrect capitalization)
   - ❌ `Fix: resolve memory leak` (incorrect capitalization)
   
   **Exceptions - Proper nouns and acronyms keep their case:**
   - ✅ `docs: update README for GitHub Actions`
   - ✅ `feat: integrate AWS S3 for file storage`
   - ✅ `fix: correct JWT token expiration`

2. **Breaking Changes**
   - Add `!` after type/scope: `feat(api)!: change response format`
   - OR include `BREAKING CHANGE:` in the footer
   - This triggers major version bumps in semantic versioning

3. **Body** (Optional)
   - Separate from subject with a blank line
   - Wrap at 72 characters
   - Explain *what* and *why*, not *how*
   - Use normal sentence capitalization (capital at start of sentences)
   - Can include multiple paragraphs

4. **Footer** (Optional)
   - Reference issues: `Resolves #123`, `Fixes #456`, `Closes #789`
   - Note breaking changes: `BREAKING CHANGE: explanation`
   - Add co-authors: `Co-authored-by: Name <email>`
   - Do **NOT** include reference to Claude or Anthropic

5. **No AI Assistant References**
   - Never include references to AI tools or assistants in commit messages
   - Focus on the changes made, not the tools used to make them
   - Commit messages should be tool-agnostic and professional

### Examples

#### Simple Feature
```
feat(cal-service): add Google Calendar OAuth integration
```

#### Bug Fix with Description
```
fix(pim-service): resolve timeout in PDF parsing

Large catalogs (>50MB) were timing out due to synchronous 
processing. Implemented streaming parser to handle files 
of any size.

Fixes #127
```

#### Breaking Change
```
feat(api)!: restructure product API response format

BREAKING CHANGE: Product API now returns nested structure
with categories. Previous flat array format is no longer
supported. See migration guide in docs/migrations/v2.md
```

#### Performance Improvement
```
perf(api-gateway): implement Redis caching for product queries

Reduces database load by 40% for repeated searches.
Cache TTL set to 5 minutes for product data.
```

#### Documentation Update
```
docs(edi-service): add X12 850 format examples

Includes mapping for common EDI scenarios and 
troubleshooting guide for format errors.
```

#### Dependency Update
```
chore(deps): update NestJS dependencies to v11

Updates all @nestjs/* packages for security patches
and performance improvements.
```

### GitHub Integration

GitHub automatically links and can close issues when you use these keywords:
- `Fixes #123` - Closes issue when PR is merged
- `Resolves #456` - Same as Fixes
- `Closes #789` - Same as Fixes
- `Relates to #101` - Links without closing

### Quick Reference

| Type | When to Use | Example |
|------|-------------|---------|
| feat | New functionality | `feat(cal-service): add booking links` |
| fix | Bug fixes | `fix(auth): correct token expiration` |
| docs | Documentation only | `docs: update API examples` |
| style | Formatting, semicolons | `style: fix eslint warnings` |
| refactor | Code restructuring | `refactor(pim): extract PDF parser` |
| perf | Performance improvements | `perf(db): add missing indexes` |
| test | Test additions/updates | `test(cal-service): add OAuth tests` |
| chore | Maintenance tasks | `chore: update dependencies` |
| build | Build system changes | `build: update Docker base image` |

### Tips for Good Commits

1. **Make atomic commits** - Each commit should represent one logical change
2. **Write in present tense** - "add" not "added"
3. **Be specific** - "fix null pointer in booking flow" not "fix bug"
4. **Reference issues** - Link to GitHub issues for context
5. **Use scopes** - Especially in our multi-service architecture

### Creating Logical Commit Sequences

When implementing features or fixes that touch multiple areas of the codebase, organize your commits to tell a clear story of the implementation:

#### Commit Organization Principles

1. **Analyze Before Committing**
   - Review all changes holistically
   - Identify logical groupings
   - Consider dependencies between changes
   - Plan the commit sequence

2. **Group Related Changes**
   - Infrastructure/configuration changes together
   - Database schema changes in their own commit
   - Core implementation logic as a unit
   - Tests and documentation last

3. **Atomic Commits**
   - Each commit should be independently functional
   - No commit should break the build
   - Changes should be complete within their scope

4. **Clear Progression**
   Order commits to show the implementation flow:
   1. Prerequisites (config, dependencies)
   2. Foundation (database, schemas)
   3. Implementation (business logic)
   4. Support (tests, docs)

#### Example: Feature Implementation Sequence

```
# Good: Multiple logical commits for quote-to-order feature
fix: correct pricing service healthcheck and order service config
feat: add quote integration fields to order service
feat: implement quote-to-order conversion endpoints
test: add quote-to-order integration tests and docs

# Bad: Single large commit mixing concerns
feat: add quote to order conversion with config fixes and tests
```

#### When to Split Commits

Split commits when changes:
- Touch different architectural layers
- Serve different purposes (fix vs feature)
- Could be useful independently
- Have different risk profiles
- Might need separate review

#### Commit Dependencies

Consider the deployment order:
- Config changes before code that uses them
- Database migrations before code that needs new fields
- API changes before client updates
- Infrastructure before application changes

This approach creates a git history that:
- Documents the development thought process
- Enables easier code review
- Facilitates selective cherry-picking
- Simplifies debugging and bisecting
- Provides clear rollback points

## Database Migrations

We use different migration approaches based on the service's technology stack:

### SQL Migrations (Go Services)
- **Naming**: `YYYYMMDD_HHMMSS_description.sql` (e.g., `20250107_143000_add_notification_tracking.sql`)
- **Location**: `/services/{service-name}/migrations/`
- **Structure**: Include rollback commands as comments for manual execution if needed
- **Style**: snake_case for tables/columns, `idx_` prefix for indexes, `fk_` for foreign keys
- **Safety**: Use `IF EXISTS`/`IF NOT EXISTS` clauses for idempotency

### Alembic Migrations (Python/FastAPI Services)
- **Naming**: `YYYYMMDD_HHMMSS_description.py` (e.g., `20250710_173818_initial_quote_tables.py`)
- **Location**: `/services/{service-name}/alembic/versions/`
- **Configuration**: Set `file_template` in `alembic.ini`:
  ```ini
  file_template = %%(year)d%%(month).2d%%(day).2d_%%(hour).2d%%(minute).2d%%(second).2d_%%(slug)s
  ```
- **Generation**: `alembic revision --autogenerate -m "description"`
- **Manual revision**: `alembic revision -m "description"`
- **Execution**: `alembic upgrade head`
- **Rollback**: `alembic downgrade -1`
- **Best Practices**:
  - Use descriptive migration names (lowercase with underscores)
  - Handle PostgreSQL enums with `DO $$ BEGIN ... EXCEPTION` blocks
  - Include both `upgrade()` and `downgrade()` functions
  - Test migrations in development before production

### TypeORM Migrations (TypeScript/NestJS Services)
- **Naming**: TypeORM auto-generates `{timestamp}-{ClassName}.ts` format
- **Location**: `/services/{service-name}/src/migrations/`
- **Generation**: `npm run migration:generate -- src/migrations/DescriptiveName`
- **Execution**: `npm run migration:run` (with appropriate DATABASE_HOST)
- **Rollback**: `npm run migration:revert`
- **Reference**: See service-specific MIGRATIONS.md for detailed commands

## API Security Standards

### Rate Limiting
All public-facing APIs must implement rate limiting to prevent abuse:
- **Required**: Implement rate limiting on all public endpoints
- **Implementation**: Use Redis-based limiting for distributed systems
- **Limits**: Define appropriate limits based on service capacity and use patterns
- **Documentation**: Document rate limits in service README
- **Consider**: Including standard rate limit headers in responses (X-RateLimit-*)

---

*This conventions document itself follows these standards. Check the frontmatter above for an example.*