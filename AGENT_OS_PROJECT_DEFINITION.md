# arQ PROJECT - AGENT OS DEFINITION

**Project:** arQ - Quranic Arabic Grammar LMS
**Framework:** Agent OS (https://github.com/buildermethods/agent-os)
**Version:** 1.0
**Date:** 2025-11-02
**Document Type:** Agent Roles, Workflows, and Project Organization

---

## TABLE OF CONTENTS

1. [Agent OS Overview](#1-agent-os-overview)
2. [Project Expert Roles](#2-project-expert-roles)
3. [Agent Definitions](#3-agent-definitions)
4. [Workflows & Processes](#4-workflows--processes)
5. [Missing Documentation & Next Steps](#5-missing-documentation--next-steps)
6. [Project Constraints & Policies](#6-project-constraints--policies)
7. [Technology Stack & Tools](#7-technology-stack--tools)
8. [Similar Projects & Reusable Components](#8-similar-projects--reusable-components)

---

## 1. AGENT OS OVERVIEW

### What is Agent OS?

Agent OS is a framework for managing complex software projects using specialized AI agents with clear roles and responsibilities. Each agent is an expert in their domain.

### Core Principles Applied to arQ

```
┌─────────────────────────────────────────────────────────────┐
│                    AGENT OS STRUCTURE                       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  PM (Project Manager)                                       │
│  └─ Coordinates all agents                                 │
│  └─ Ensures alignment with project goals                   │
│  └─ Delegates tasks to specialized agents                  │
│                                                             │
│  ├─ Solution Architect                                     │
│  │  └─ Designs overall system architecture                │
│  │  └─ Makes technology decisions                          │
│  │  └─ Ensures scalability and maintainability            │
│  │                                                          │
│  ├─ Backend Lead                                            │
│  │  └─ NestJS/PostgreSQL implementation                   │
│  │  └─ API design and database optimization               │
│  │                                                          │
│  ├─ Frontend Lead                                           │
│  │  └─ React/Next.js implementation                        │
│  │  └─ UI/UX implementation                                │
│  │                                                          │
│  ├─ Mobile Lead                                             │
│  │  └─ React Native implementation                         │
│  │                                                          │
│  ├─ DevOps Engineer                                         │
│  │  └─ CI/CD, deployment, infrastructure                   │
│  │                                                          │
│  ├─ QA Lead                                                 │
│  │  └─ Testing strategy and execution                      │
│  │                                                          │
│  ├─ Content Architect                                       │
│  │  └─ Curriculum design and lesson creation              │
│  │                                                          │
│  └─ Arabic Grammar Expert                                   │
│     └─ Validates grammatical accuracy                      │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. PROJECT EXPERT ROLES

### 2.1 Core Technical Roles

#### **ROLE 1: Solution Architect**
**Agent Name**: `@solution-architect`
**Responsibility**: Overall system design and architecture
**Expertise**:
- System architecture design
- Technology stack selection
- Scalability planning
- Integration patterns
- Performance optimization

**Key Deliverables**:
- [ ] Complete system architecture diagram
- [ ] Technology decision documentation
- [ ] API architecture specification
- [ ] Database architecture specification
- [ ] Integration architecture
- [ ] Security architecture
- [ ] Scalability roadmap

**Agent Definition File**: `agents/solution-architect.md`

---

#### **ROLE 2: Backend Lead (NestJS)**
**Agent Name**: `@backend-lead`
**Responsibility**: Backend API and database implementation
**Expertise**:
- NestJS framework
- PostgreSQL with JSONB
- RESTful API design
- GraphQL (optional)
- Database optimization
- Redis caching

**Key Deliverables**:
- [ ] NestJS project structure
- [ ] Database migrations
- [ ] API endpoints implementation
- [ ] Authentication/authorization
- [ ] Data import pipeline
- [ ] API documentation (Swagger)
- [ ] Unit and integration tests

**Agent Definition File**: `agents/backend-lead.md`

---

#### **ROLE 3: Frontend Lead (React/Next.js)**
**Agent Name**: `@frontend-lead`
**Responsibility**: Web application implementation
**Expertise**:
- React/Next.js 14
- TypeScript
- State management (Zustand/Redux)
- UI component libraries
- Responsive design
- Performance optimization

**Key Deliverables**:
- [ ] Next.js project setup
- [ ] Component library implementation
- [ ] Student dashboard
- [ ] Teacher dashboard
- [ ] Verse analysis interface
- [ ] Exercise components
- [ ] RTL support implementation
- [ ] Accessibility features

**Agent Definition File**: `agents/frontend-lead.md`

---

#### **ROLE 4: Mobile Lead (React Native)**
**Agent Name**: `@mobile-lead`
**Responsibility**: Mobile application for iOS and Android
**Expertise**:
- React Native
- Expo vs bare React Native
- Native modules
- Offline-first architecture
- Push notifications
- App Store deployment

**Key Deliverables**:
- [ ] React Native project setup
- [ ] Shared components with web
- [ ] Offline mode implementation
- [ ] Push notification system
- [ ] iOS app deployment
- [ ] Android app deployment

**Agent Definition File**: `agents/mobile-lead.md`

---

#### **ROLE 5: DevOps Engineer**
**Agent Name**: `@devops`
**Responsibility**: Infrastructure, deployment, and CI/CD
**Expertise**:
- Docker & Kubernetes
- CI/CD (GitHub Actions)
- Cloud platforms (AWS/DigitalOcean/Vercel)
- Monitoring and logging
- Database backup and recovery
- Performance monitoring

**Key Deliverables**:
- [ ] Docker containerization
- [ ] CI/CD pipeline
- [ ] Production deployment
- [ ] Staging environment
- [ ] Monitoring setup (Grafana/Prometheus)
- [ ] Backup automation
- [ ] SSL/HTTPS configuration

**Agent Definition File**: `agents/devops.md`

---

#### **ROLE 6: Database Architect**
**Agent Name**: `@database-architect`
**Responsibility**: Database design and optimization
**Expertise**:
- PostgreSQL 15+
- JSONB optimization
- Indexing strategies
- Query optimization
- Data migration
- Backup strategies

**Key Deliverables**:
- [ ] Complete schema design
- [ ] Migration scripts
- [ ] Index optimization
- [ ] Query performance tuning
- [ ] Data import scripts
- [ ] Backup/restore procedures

**Agent Definition File**: `agents/database-architect.md`

---

### 2.2 Quality Assurance Roles

#### **ROLE 7: QA Lead**
**Agent Name**: `@qa-lead`
**Responsibility**: Testing strategy and quality assurance
**Expertise**:
- Test automation
- E2E testing (Playwright/Cypress)
- Unit testing (Jest)
- Integration testing
- Performance testing
- Accessibility testing

**Key Deliverables**:
- [ ] Test strategy document
- [ ] E2E test suite
- [ ] Unit test coverage (>80%)
- [ ] Integration tests
- [ ] Performance benchmarks
- [ ] Accessibility audit (WCAG 2.1 AA)
- [ ] Bug tracking and management

**Agent Definition File**: `agents/qa-lead.md`

---

#### **ROLE 8: Security Engineer**
**Agent Name**: `@security`
**Responsibility**: Application security and compliance
**Expertise**:
- OWASP security standards
- Authentication/authorization
- Data encryption
- SQL injection prevention
- XSS/CSRF protection
- Penetration testing

**Key Deliverables**:
- [ ] Security audit
- [ ] Authentication implementation review
- [ ] Data encryption strategy
- [ ] Vulnerability scanning
- [ ] Security best practices documentation
- [ ] GDPR compliance review

**Agent Definition File**: `agents/security.md`

---

### 2.3 Content & Education Roles

#### **ROLE 9: Content Architect**
**Agent Name**: `@content-architect`
**Responsibility**: Overall curriculum design
**Expertise**:
- Instructional design
- Learning path creation
- Assessment design
- Gamification
- Curriculum sequencing

**Key Deliverables**:
- [ ] Complete curriculum structure
- [ ] Learning objectives per lesson
- [ ] Assessment strategy
- [ ] Progression system design
- [ ] Content creation templates
- [ ] Content review guidelines

**Agent Definition File**: `agents/content-architect.md`

---

#### **ROLE 10: Arabic Grammar Expert**
**Agent Name**: `@grammar-expert`
**Responsibility**: Grammatical accuracy validation
**Expertise**:
- Classical Arabic grammar (نحو وصرف)
- Quranic Arabic specifics
- I'rab analysis
- Morphological analysis
- Root-pattern system

**Key Deliverables**:
- [ ] Grammar validation of all content
- [ ] I'rab accuracy verification
- [ ] POS analysis review
- [ ] Scholarly references validation
- [ ] Educational content accuracy

**Agent Definition File**: `agents/grammar-expert.md`

---

#### **ROLE 11: Content Writer**
**Agent Name**: `@content-writer`
**Responsibility**: Lesson and exercise creation
**Expertise**:
- Educational content writing
- Multilingual content (English/Arabic/Urdu)
- Exercise design
- Clear explanations
- Engaging narratives

**Key Deliverables**:
- [ ] 250+ lesson content
- [ ] 500+ exercises
- [ ] POS library articles
- [ ] Help documentation
- [ ] Marketing content

**Agent Definition File**: `agents/content-writer.md`

---

### 2.4 Design Roles

#### **ROLE 12: UI/UX Designer**
**Agent Name**: `@ux-designer`
**Responsibility**: User interface and experience design
**Expertise**:
- Figma/Sketch
- User research
- Wireframing
- Prototyping
- Design systems
- Accessibility design

**Key Deliverables**:
- [ ] High-fidelity mockups
- [ ] Design system in Figma
- [ ] Component library designs
- [ ] User flow diagrams
- [ ] Responsive layouts
- [ ] Accessibility guidelines
- [ ] RTL design specifications

**Agent Definition File**: `agents/ux-designer.md`

---

#### **ROLE 13: Visual Designer**
**Agent Name**: `@visual-designer`
**Responsibility**: Branding and visual identity
**Expertise**:
- Brand identity
- Logo design
- Color theory
- Typography
- Iconography
- Illustration

**Key Deliverables**:
- [ ] Logo and brand identity
- [ ] Color palette
- [ ] Typography system
- [ ] Icon set
- [ ] Illustration style guide
- [ ] Marketing materials

**Agent Definition File**: `agents/visual-designer.md`

---

### 2.5 Specialized Technical Roles

#### **ROLE 14: Data Engineer**
**Agent Name**: `@data-engineer`
**Responsibility**: Data pipeline and processing
**Expertise**:
- ETL pipelines
- Data transformation
- XML/JSON parsing
- Data validation
- Batch processing

**Key Deliverables**:
- [ ] Quranic Corpus import pipeline
- [ ] Data transformation scripts
- [ ] Data validation rules
- [ ] Cross-reference generation
- [ ] Root extraction logic
- [ ] Educational data enhancement

**Agent Definition File**: `agents/data-engineer.md`

---

#### **ROLE 15: Search Engineer**
**Agent Name**: `@search-engineer`
**Responsibility**: Search and discovery features
**Expertise**:
- Full-text search (PostgreSQL)
- ElasticSearch (optional)
- Search algorithms
- Ranking and relevance
- Arabic text search specifics

**Key Deliverables**:
- [ ] Search indexing strategy
- [ ] Full-text search implementation
- [ ] Root-based search
- [ ] Grammatical filters
- [ ] Search ranking algorithm
- [ ] Auto-suggestions

**Agent Definition File**: `agents/search-engineer.md`

---

#### **ROLE 16: Analytics Engineer**
**Agent Name**: `@analytics-engineer`
**Responsibility**: User analytics and reporting
**Expertise**:
- Analytics tracking
- Data visualization
- Reporting dashboards
- User behavior analysis
- A/B testing

**Key Deliverables**:
- [ ] Analytics implementation (Mixpanel/Amplitude)
- [ ] Teacher analytics dashboard
- [ ] Student progress reports
- [ ] Learning analytics
- [ ] Performance metrics
- [ ] A/B testing framework

**Agent Definition File**: `agents/analytics-engineer.md`

---

## 3. AGENT DEFINITIONS

### Agent Definition Template

Each agent has a corresponding `.md` file in the `agents/` directory with this structure:

```markdown
# AGENT: [Agent Name]

## Role & Responsibility
[Brief description]

## Expertise
- [Skill 1]
- [Skill 2]
- [Skill 3]

## Tools & Technologies
- [Tool 1]
- [Tool 2]

## Key Deliverables
- [ ] [Deliverable 1]
- [ ] [Deliverable 2]

## Dependencies
- Depends on: [Other agents]
- Provides to: [Other agents]

## Communication Protocols
- Reports to: [PM / Other agent]
- Collaborates with: [Other agents]
- Updates frequency: [Daily/Weekly]

## Definition of Done
- [ ] [Criteria 1]
- [ ] [Criteria 2]
- [ ] Tests pass 100%
- [ ] Code reviewed
- [ ] Documentation complete

## Quality Standards
- Code coverage: >80%
- Performance: [Specific metrics]
- Accessibility: WCAG 2.1 AA
- Security: [Specific standards]
```

---

## 4. WORKFLOWS & PROCESSES

### 4.1 Development Workflow

```
┌─────────────────────────────────────────────────────────────┐
│               AGENT OS DEVELOPMENT WORKFLOW                 │
└─────────────────────────────────────────────────────────────┘

PHASE 1: PLANNING & DELEGATION (PM)
────────────────────────────────────
1. PM receives feature request
2. PM consults PROJECT_CONSTRAINTS.md
3. PM breaks down into agent tasks
4. PM creates delegation prompts with:
   ✓ Explicit constraints
   ✓ Success criteria
   ✓ Examples from existing code
   ✓ Validation checklist

PHASE 2: AGENT EXECUTION
─────────────────────────
1. Agent reads relevant documentation:
   - PROJECT_CONSTRAINTS.md (MANDATORY)
   - Related specification files
   - Existing code patterns

2. Agent performs task following constraints

3. Agent self-validates:
   - [ ] Runs tests (100% pass rate)
   - [ ] Checks against constraints
   - [ ] Reviews checklist
   - [ ] No hardcoded values
   - [ ] No security issues

4. Agent returns results to PM

PHASE 3: PM VALIDATION
───────────────────────
1. PM reviews agent output
2. PM runs quality gates:
   - [ ] Tests pass
   - [ ] Meets constraints
   - [ ] Code quality (ESLint/Prettier)
   - [ ] Security scan
   - [ ] Performance check

3. IF issues found:
   - PM delegates "Fix Issues" task
   - Agent fixes and re-validates
   - REPEAT until clean

4. IF clean:
   - PM marks task complete
   - PM proceeds to next task

PHASE 4: INTEGRATION
────────────────────
1. Code merged to feature branch
2. CI/CD pipeline runs
3. Integration tests execute
4. Staging deployment
5. PM validates in staging
6. Production deployment (if approved)
```

---

### 4.2 Code Review Workflow

```
CODE REVIEW PROCESS
───────────────────

STEP 1: Agent completes feature
└─ Self-review checklist complete

STEP 2: Automated checks
├─ ESLint / Prettier
├─ TypeScript compilation
├─ Unit tests
├─ Integration tests
└─ Security scan (Snyk)

STEP 3: Peer review (Agent → Agent)
├─ Backend-Lead reviews backend code
├─ Frontend-Lead reviews frontend code
└─ Security reviews auth/sensitive code

STEP 4: QA validation
├─ QA-Lead runs test suite
├─ Manual testing
└─ Accessibility check

STEP 5: PM approval
└─ Final merge approval

REQUIREMENTS:
✓ At least 1 peer review
✓ All automated checks pass
✓ QA sign-off
✓ PM approval
```

---

### 4.3 Sprint Workflow (Agile)

```
2-WEEK SPRINT CYCLE
───────────────────

WEEK 1: DAY 1 (Monday) - SPRINT PLANNING
─────────────────────────────────────────
• PM facilitates planning meeting
• Review previous sprint
• Select tasks from backlog
• Assign to agents
• Set sprint goals

WEEK 1: DAY 2-5 - DEVELOPMENT
──────────────────────────────
• Agents execute tasks
• Daily stand-up (async)
• PM monitors progress
• Blockers escalated to PM

WEEK 2: DAY 1-4 - DEVELOPMENT + TESTING
────────────────────────────────────────
• Feature completion
• QA testing
• Bug fixes
• Integration

WEEK 2: DAY 5 (Friday) - SPRINT REVIEW & RETRO
───────────────────────────────────────────────
• Demo completed features
• Retrospective (what worked/didn't)
• Update PROJECT_CONSTRAINTS.md if needed
• Plan next sprint
```

---

### 4.4 Issue Resolution Workflow

```
ISSUE ESCALATION PROCESS
────────────────────────

LEVEL 1: Agent Self-Resolution
├─ Agent encounters issue
├─ Agent searches documentation
├─ Agent attempts resolution
└─ Resolved? → Continue

LEVEL 2: Peer Consultation
├─ Agent cannot resolve
├─ Agent consults related agent
├─ Collaborative problem-solving
└─ Resolved? → Document solution

LEVEL 3: PM Escalation
├─ Issue still unresolved
├─ PM analyzes issue
├─ PM consults Solution Architect
├─ PM decides: fix, workaround, or defer
└─ PM delegates solution task

LEVEL 4: Architectural Decision
├─ Issue requires architecture change
├─ Solution Architect reviews
├─ Architecture Decision Record (ADR) created
├─ PM communicates decision
└─ Implementation delegated
```

---

## 5. MISSING DOCUMENTATION & NEXT STEPS

### 5.1 Missing Agent Definition Files

These agent files need to be created in `agents/` directory:

```
agents/
├─ solution-architect.md       [TODO]
├─ backend-lead.md             [TODO]
├─ frontend-lead.md            [TODO]
├─ mobile-lead.md              [TODO]
├─ devops.md                   [TODO]
├─ database-architect.md       [TODO]
├─ qa-lead.md                  [TODO]
├─ security.md                 [TODO]
├─ content-architect.md        [TODO]
├─ grammar-expert.md           [TODO]
├─ content-writer.md           [TODO]
├─ ux-designer.md              [TODO]
├─ visual-designer.md          [TODO]
├─ data-engineer.md            [TODO]
├─ search-engineer.md          [TODO]
└─ analytics-engineer.md       [TODO]
```

---

### 5.2 Missing Technical Documentation

```
REQUIRED DOCUMENTATION FILES
────────────────────────────

Architecture & Design:
├─ SOLUTION_ARCHITECTURE.md               [TODO]
├─ API_SPECIFICATION.md                   [TODO]
├─ DATABASE_MIGRATIONS.md                 [TODO]
├─ CACHING_STRATEGY.md                    [TODO]
├─ AUTHENTICATION_ARCHITECTURE.md         [TODO]
└─ SECURITY_GUIDELINES.md                 [TODO]

Development:
├─ DEVELOPMENT_SETUP.md                   [TODO]
├─ CODING_STANDARDS.md                    [TODO]
├─ GIT_WORKFLOW.md                        [TODO]
├─ CODE_REVIEW_CHECKLIST.md               [TODO]
├─ TESTING_STRATEGY.md                    [TODO]
└─ DEPLOYMENT_GUIDE.md                    [TODO]

Content:
├─ CONTENT_CREATION_GUIDE.md              [TODO]
├─ LESSON_TEMPLATE.md                     [TODO]
├─ EXERCISE_TEMPLATE.md                   [TODO]
└─ CONTENT_REVIEW_CHECKLIST.md            [TODO]

Operations:
├─ MONITORING_SETUP.md                    [TODO]
├─ INCIDENT_RESPONSE.md                   [TODO]
├─ BACKUP_RECOVERY.md                     [TODO]
└─ PERFORMANCE_BENCHMARKS.md              [TODO]
```

---

### 5.3 Missing Process Documentation

```
PROCESS DOCUMENTATION NEEDED
────────────────────────────

├─ SPRINT_PLANNING_TEMPLATE.md            [TODO]
├─ DAILY_STANDUP_FORMAT.md                [TODO]
├─ SPRINT_RETROSPECTIVE_TEMPLATE.md       [TODO]
├─ ARCHITECTURE_DECISION_RECORDS/         [TODO]
│  └─ Template and process
├─ BUG_REPORTING_TEMPLATE.md              [TODO]
├─ FEATURE_REQUEST_TEMPLATE.md            [TODO]
└─ RELEASE_PROCESS.md                     [TODO]
```

---

## 6. PROJECT CONSTRAINTS & POLICIES

### 6.1 Technical Constraints

**Already Documented**:
✅ `PROJECT_CONSTRAINTS.md` - 12 proven UX patterns, color system, performance standards

**Additional Constraints Needed**:

```markdown
# TECHNICAL_CONSTRAINTS.md [TODO]

## Code Quality
- TypeScript strict mode: Required
- ESLint: No warnings allowed
- Prettier: Auto-format on save
- Test coverage: Minimum 80%
- Code review: Required for all PRs

## Performance
- API response time: <500ms (95th percentile)
- Page load time: <3s (first visit)
- Time to Interactive: <5s
- Lighthouse score: >90

## Security
- No hardcoded credentials (EVER)
- All API calls authenticated
- Input validation on all endpoints
- SQL injection prevention (parameterized queries)
- XSS prevention (sanitized outputs)
- HTTPS only in production

## Accessibility
- WCAG 2.1 AA compliance: Required
- Keyboard navigation: Full support
- Screen reader: Full compatibility
- Color contrast: 4.5:1 minimum

## Browser Support
- Chrome: Latest 2 versions
- Firefox: Latest 2 versions
- Safari: Latest 2 versions
- Edge: Latest 2 versions
- Mobile browsers: iOS Safari, Chrome Android

## Internationalization
- RTL support: Required
- Multi-language UI: English, Arabic, Urdu
- Date/time localization: Required
```

---

### 6.2 Development Policies

```markdown
# DEVELOPMENT_POLICIES.md [TODO]

## Git Workflow
- Branch naming: feature/*, bugfix/*, hotfix/*
- Commit messages: Conventional Commits format
- No direct commits to main/master
- Squash merge for features
- Rebase workflow for clean history

## Code Review Policy
- Minimum 1 approval required
- No self-approval
- All comments must be resolved
- CI must pass before merge

## Testing Policy
- Unit tests: Required for all business logic
- Integration tests: Required for API endpoints
- E2E tests: Required for critical user flows
- No PR merge if tests fail

## Documentation Policy
- All public APIs: JSDoc comments required
- All components: PropTypes or TypeScript interfaces
- All features: Update relevant .md files
- All architecture decisions: Create ADR

## Security Policy
- No secrets in code
- Use environment variables
- Dependency scanning: Weekly
- Security patches: Within 48 hours

## Release Policy
- Semantic versioning: Required
- Changelog: Auto-generated
- Release notes: Required
- Staging deployment: Before production
- Rollback plan: Required
```

---

### 6.3 Content Policies

```markdown
# CONTENT_POLICIES.md [TODO]

## Accuracy Requirements
- All grammatical analysis: Verified by Arabic Grammar Expert
- All Quranic references: Cross-checked with Quranic Corpus
- All scholarly notes: Properly cited
- All translations: From authorized sources

## Review Process
- Tier 1: Content Writer creates
- Tier 2: Grammar Expert validates
- Tier 3: Content Architect approves
- Tier 4: PM final sign-off

## Multilingual Content
- Primary language: English
- Secondary: Arabic, Urdu
- All UI text: Translated
- All lessons: English + Arabic explanations

## Educational Standards
- Clear learning objectives: Required
- Progressive difficulty: Required
- Multiple examples: Minimum 3 per concept
- Practice exercises: Minimum 5 per lesson

## Copyright & Attribution
- Quranic text: Public domain
- Quranic Corpus data: GPL license (attribute)
- Audio files: Appropriate licensing
- All images: Licensed or created
```

---

## 7. TECHNOLOGY STACK & TOOLS

### 7.1 Complete Technology Stack

```
┌─────────────────────────────────────────────────────────────┐
│                    TECHNOLOGY STACK                         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  FRONTEND (Web)                                             │
│  ├─ Framework: Next.js 14 (App Router)                     │
│  ├─ Language: TypeScript 5.x                               │
│  ├─ UI Library: React 18                                   │
│  ├─ State Management: Zustand                              │
│  ├─ Styling: Tailwind CSS                                  │
│  ├─ UI Components: shadcn/ui + Radix UI                    │
│  ├─ Forms: React Hook Form + Zod validation               │
│  ├─ HTTP Client: Axios                                     │
│  └─ Testing: Jest + React Testing Library + Playwright    │
│                                                             │
│  MOBILE                                                     │
│  ├─ Framework: React Native (Expo)                         │
│  ├─ Language: TypeScript 5.x                               │
│  ├─ Navigation: React Navigation                           │
│  ├─ State: Zustand (shared with web)                       │
│  ├─ Styling: NativeWind (Tailwind for RN)                 │
│  └─ Storage: AsyncStorage + SQLite (offline)              │
│                                                             │
│  BACKEND                                                    │
│  ├─ Framework: NestJS 10                                   │
│  ├─ Language: TypeScript 5.x                               │
│  ├─ ORM: Prisma or TypeORM                                │
│  ├─ Validation: class-validator                            │
│  ├─ API Docs: Swagger / OpenAPI                           │
│  └─ Testing: Jest + Supertest                             │
│                                                             │
│  DATABASE                                                   │
│  ├─ Primary: PostgreSQL 15                                 │
│  ├─ Features: JSONB, Full-text search, GIN indexes        │
│  ├─ Migrations: Prisma Migrate or TypeORM                 │
│  └─ GUI: pgAdmin / Postico                                │
│                                                             │
│  CACHING                                                    │
│  ├─ In-Memory: Redis 7                                     │
│  ├─ Use cases: Sessions, API cache, leaderboards          │
│  └─ Client: ioredis                                        │
│                                                             │
│  SEARCH                                                     │
│  ├─ Primary: PostgreSQL Full-Text Search                   │
│  ├─ Optional: ElasticSearch (future)                       │
│  └─ Features: Arabic text search, root search             │
│                                                             │
│  AUTHENTICATION                                             │
│  ├─ Strategy: JWT (Access + Refresh tokens)               │
│  ├─ Password: bcrypt (12 rounds)                          │
│  ├─ OAuth: Passport.js (Google, Facebook)                 │
│  └─ 2FA: TOTP (optional)                                   │
│                                                             │
│  FILE STORAGE                                               │
│  ├─ Cloud: AWS S3 or DigitalOcean Spaces                  │
│  ├─ CDN: CloudFlare                                        │
│  └─ Use: Audio files, images, user uploads                │
│                                                             │
│  DEVOPS & INFRASTRUCTURE                                    │
│  ├─ Containerization: Docker + Docker Compose              │
│  ├─ Orchestration: Kubernetes (production)                 │
│  ├─ CI/CD: GitHub Actions                                  │
│  ├─ Hosting (Backend): DigitalOcean / AWS                 │
│  ├─ Hosting (Frontend): Vercel                            │
│  ├─ Monitoring: Grafana + Prometheus                       │
│  ├─ Logging: Winston + Elasticsearch + Kibana             │
│  └─ Error Tracking: Sentry                                 │
│                                                             │
│  ANALYTICS                                                  │
│  ├─ User Analytics: Mixpanel or Amplitude                  │
│  ├─ Web Analytics: Google Analytics 4                      │
│  └─ Custom: PostgreSQL analytics tables                    │
│                                                             │
│  COMMUNICATION                                              │
│  ├─ Email: SendGrid or AWS SES                            │
│  ├─ Push Notifications: Firebase Cloud Messaging          │
│  └─ SMS (optional): Twilio                                 │
│                                                             │
│  DEVELOPMENT TOOLS                                          │
│  ├─ IDE: VSCode                                            │
│  ├─ Linting: ESLint + Prettier                            │
│  ├─ Git: GitHub                                            │
│  ├─ API Testing: Postman / Insomnia                       │
│  ├─ Design: Figma                                          │
│  └─ Project Management: Linear / Jira                      │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

### 7.2 Required Development Tools

**To be installed by all developers**:

```bash
# Node.js & Package Managers
├─ Node.js 20 LTS
├─ npm 10+ or pnpm 8+
└─ Yarn (optional)

# Database Tools
├─ PostgreSQL 15
├─ Redis 7
├─ pgAdmin or Postico
└─ Redis Commander

# Docker
├─ Docker Desktop
└─ Docker Compose

# Version Control
└─ Git 2.40+

# Code Quality
├─ ESLint
├─ Prettier
└─ TypeScript

# Testing
├─ Jest
├─ Playwright
└─ Postman / Insomnia

# Optional but Recommended
├─ VSCode Extensions:
│  ├─ ESLint
│  ├─ Prettier
│  ├─ GitLens
│  ├─ Thunder Client
│  ├─ Prisma
│  └─ Tailwind CSS IntelliSense
```

---

## 8. SIMILAR PROJECTS & REUSABLE COMPONENTS

### 8.1 Open Source Projects to Study

#### **1. Duolingo Clone (Open Source)**
**Repository**: https://github.com/duolingo/duolingo
**What to Learn**:
- Gamification system
- XP and leveling logic
- Streak tracking
- Exercise types
- Progress persistence

**Reusable Components**:
```
├─ Gamification engine
├─ XP calculation logic
├─ Streak counter
├─ Achievement system
└─ Progress tracking
```

---

#### **2. Khan Academy Frontend**
**Repository**: https://github.com/Khan/khan-frontend
**What to Learn**:
- Video player integration
- Progress tracking
- Skill tree visualization
- Mastery system

**Reusable Components**:
```
├─ Progress indicators
├─ Skill mastery logic
├─ Content recommendation
└─ Learning analytics
```

---

#### **3. Quran.com (Open Source)**
**Repository**: https://github.com/quran/quran.com-frontend-next
**What to Learn**:
- Quranic text display
- Audio player
- RTL layout
- Arabic typography
- Verse navigation

**Reusable Components**:
```
├─ Arabic text renderer
├─ Audio player component
├─ Verse navigation
├─ RTL layout system
├─ Search functionality
└─ Bookmark system
```

---

#### **4. Quranic Corpus**
**Repository**: http://corpus.quran.com
**Data Source**: http://corpus.quran.com/download/
**What to Use**:
- Complete morphological data
- POS tagging
- Root analysis
- Syntactic trees

**Reusable Data**:
```
├─ XML data files (77,429 words)
├─ Morphological analysis
├─ Syntactic analysis
├─ Root-word mappings
└─ Dependency trees
```

---

#### **5. React Admin**
**Repository**: https://github.com/marmelab/react-admin
**What to Learn**:
- Admin dashboard patterns
- CRUD operations
- Data tables
- Filtering and sorting
- Bulk actions

**Reusable Components**:
```
├─ Data grid component
├─ Filter components
├─ Form generators
├─ CRUD hooks
└─ List views
```

---

#### **6. Chakra UI**
**Repository**: https://github.com/chakra-ui/chakra-ui
**What to Learn**:
- Accessible components
- RTL support implementation
- Dark mode
- Theme system

**Reusable Components**:
```
├─ Accessible UI primitives
├─ RTL support utilities
├─ Color mode system
├─ Responsive utilities
└─ Form controls
```

---

### 8.2 Recommended NPM Packages

#### **Frontend Packages**:
```json
{
  "dependencies": {
    // Core
    "react": "^18.2.0",
    "next": "^14.0.0",
    "typescript": "^5.3.0",

    // State Management
    "zustand": "^4.4.0",

    // UI Components
    "@radix-ui/react-accordion": "^1.1.2",
    "@radix-ui/react-dialog": "^1.0.5",
    "tailwindcss": "^3.4.0",

    // Forms
    "react-hook-form": "^7.48.0",
    "zod": "^3.22.0",

    // HTTP
    "axios": "^1.6.0",
    "swr": "^2.2.0",

    // Audio
    "howler": "^2.2.3",

    // Animations
    "framer-motion": "^10.16.0",

    // i18n
    "next-i18next": "^15.0.0",

    // RTL
    "stylis-plugin-rtl": "^2.1.1",

    // Charts
    "recharts": "^2.10.0",

    // Date/Time
    "date-fns": "^2.30.0",

    // Utilities
    "clsx": "^2.0.0",
    "lodash": "^4.17.21"
  }
}
```

#### **Backend Packages**:
```json
{
  "dependencies": {
    // Core
    "@nestjs/core": "^10.2.0",
    "@nestjs/common": "^10.2.0",
    "typescript": "^5.3.0",

    // Database
    "@prisma/client": "^5.6.0",
    "prisma": "^5.6.0",

    // Authentication
    "@nestjs/jwt": "^10.2.0",
    "@nestjs/passport": "^10.0.0",
    "passport-jwt": "^4.0.1",
    "bcrypt": "^5.1.0",

    // Validation
    "class-validator": "^0.14.0",
    "class-transformer": "^0.5.1",

    // Redis
    "ioredis": "^5.3.0",

    // Configuration
    "@nestjs/config": "^3.1.0",

    // Swagger
    "@nestjs/swagger": "^7.1.0",

    // Rate Limiting
    "@nestjs/throttler": "^5.0.0",

    // Security
    "helmet": "^7.1.0",
    "express-rate-limit": "^7.1.0"
  }
}
```

---

### 8.3 Code Templates & Boilerplates

#### **Next.js Starter Template**:
```bash
# Recommended starter
npx create-next-app@latest arq-frontend \
  --typescript \
  --tailwind \
  --app \
  --src-dir \
  --import-alias "@/*"
```

#### **NestJS Starter Template**:
```bash
# Official NestJS CLI
npm i -g @nestjs/cli
nest new arq-backend

# With Prisma
cd arq-backend
npm install prisma --save-dev
npx prisma init
```

#### **React Native (Expo) Template**:
```bash
# Expo with TypeScript
npx create-expo-app arq-mobile --template expo-template-blank-typescript
```

---

### 8.4 Generic Base Layers to Fetch

#### **Authentication Boilerplate**:
```
Source: https://github.com/hagopj13/node-express-boilerplate
Fetch:
├─ JWT authentication logic
├─ Refresh token flow
├─ Password reset flow
├─ Email verification
└─ Role-based access control
```

#### **CRUD Generators**:
```
Source: https://github.com/marmelab/react-admin
Fetch:
├─ Generic CRUD hooks
├─ Data provider pattern
├─ List/Detail/Edit templates
└─ Filter components
```

#### **RTL Support**:
```
Source: https://github.com/chakra-ui/chakra-ui
Fetch:
├─ RTL utility functions
├─ Bidirectional CSS
├─ RTL-aware components
└─ Direction provider
```

#### **Analytics Integration**:
```
Source: https://github.com/vercel/next.js/tree/canary/examples/with-google-analytics
Fetch:
├─ Event tracking pattern
├─ Page view tracking
├─ Custom event hooks
└─ Analytics provider
```

---

## 9. NEXT STEPS & ACTION ITEMS

### 9.1 Immediate Actions (Week 1)

**PM Tasks**:
- [x] Create AGENT_OS_PROJECT_DEFINITION.md (this file)
- [ ] Create all 16 agent definition files in `agents/`
- [ ] Create SOLUTION_ARCHITECTURE.md
- [ ] Create missing technical documentation files
- [ ] Set up GitHub repository structure
- [ ] Create project board (Linear/Jira)

**Solution Architect Tasks**:
- [ ] Review existing design documents
- [ ] Create complete system architecture diagram
- [ ] Document API architecture
- [ ] Define microservices boundaries (if applicable)
- [ ] Create deployment architecture
- [ ] Write Architecture Decision Records (ADRs)

**DevOps Tasks**:
- [ ] Set up GitHub repository
- [ ] Create Docker development environment
- [ ] Set up CI/CD pipeline (GitHub Actions)
- [ ] Provision staging environment
- [ ] Set up monitoring (basic)

---

### 9.2 Phase 1 Actions (Weeks 2-4)

**Backend Lead**:
- [ ] Initialize NestJS project
- [ ] Set up Prisma schema
- [ ] Implement authentication
- [ ] Create base CRUD modules
- [ ] Set up Swagger documentation

**Frontend Lead**:
- [ ] Initialize Next.js project
- [ ] Set up Tailwind CSS + component library
- [ ] Implement authentication flow
- [ ] Create base layouts
- [ ] Set up routing structure

**Database Architect**:
- [ ] Finalize database schema
- [ ] Create migration scripts
- [ ] Set up database seeding
- [ ] Optimize indexes

**Data Engineer**:
- [ ] Build Quranic Corpus import pipeline
- [ ] Parse XML data
- [ ] Import to PostgreSQL
- [ ] Generate cross-references

---

### 9.3 Documentation Priority

**HIGH PRIORITY** (Create immediately):
1. SOLUTION_ARCHITECTURE.md
2. DEVELOPMENT_SETUP.md
3. API_SPECIFICATION.md
4. CODING_STANDARDS.md
5. GIT_WORKFLOW.md
6. All agent definition files

**MEDIUM PRIORITY** (Create in Phase 1):
1. TESTING_STRATEGY.md
2. DEPLOYMENT_GUIDE.md
3. SECURITY_GUIDELINES.md
4. CODE_REVIEW_CHECKLIST.md

**LOW PRIORITY** (Create as needed):
1. PERFORMANCE_BENCHMARKS.md
2. INCIDENT_RESPONSE.md
3. MONITORING_SETUP.md

---

## 10. AGENT COORDINATION MATRIX

```
┌────────────────────────────────────────────────────────────────────┐
│                    AGENT INTERACTION MATRIX                        │
├────────────────────────────────────────────────────────────────────┤
│                                                                    │
│  PM → All Agents (coordinates)                                     │
│                                                                    │
│  Solution Architect →                                              │
│    ├─ Backend Lead (API design)                                   │
│    ├─ Frontend Lead (architecture decisions)                      │
│    ├─ Database Architect (schema review)                          │
│    └─ DevOps (infrastructure design)                              │
│                                                                    │
│  Backend Lead ↔ Frontend Lead (API contract)                      │
│  Backend Lead ↔ Database Architect (schema/queries)               │
│  Backend Lead ↔ Security (auth implementation)                    │
│  Backend Lead ↔ Data Engineer (import pipeline)                   │
│                                                                    │
│  Frontend Lead ↔ UX Designer (component implementation)           │
│  Frontend Lead ↔ Mobile Lead (shared components)                  │
│  Frontend Lead ↔ QA Lead (E2E tests)                              │
│                                                                    │
│  Content Architect ↔ Grammar Expert (accuracy)                    │
│  Content Architect ↔ Content Writer (creation)                    │
│  Content Architect ↔ UX Designer (learning flows)                 │
│                                                                    │
│  QA Lead → All Developers (testing requirements)                  │
│  Security → All Developers (security review)                      │
│  DevOps → All Developers (deployment support)                     │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

---

## CONCLUSION

This document establishes the **Agent OS framework** for the arQ project with:

✅ **16 Expert Roles** - Clearly defined responsibilities
✅ **Workflows** - Development, review, sprint, escalation processes
✅ **Missing Documentation** - Identified and prioritized
✅ **Technology Stack** - Complete and justified
✅ **Reusable Components** - Identified from open-source projects
✅ **Next Steps** - Clear action items for immediate execution

**PM will now coordinate all agents following this structure, ensuring:**
1. No systematic mistakes (all agents read PROJECT_CONSTRAINTS.md first)
2. Front-loaded context in all delegations
3. Sequential validation (not batch delegation)
4. 100% test pass rate before integration
5. Institutional memory through documentation updates

---

**Created by**: PM Agent
**Date**: 2025-11-02
**Version**: 1.0
**Next Review**: After Phase 1 completion

**Related Documents**:
- PROJECT_CONSTRAINTS.md
- QURANIC_ARABIC_LMS_DESIGN.md
- CURRICULUM_ARCHITECTURE.md
- DATA_ARCHITECTURE.md
- All existing specification files
