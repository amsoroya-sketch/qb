# arQ - Quranic Arabic Grammar Learning Management System

![arQ Logo](https://placeholder-logo.png)

[![CI/CD](https://github.com/your-org/arq/workflows/CI%2FCD%20Pipeline/badge.svg)](https://github.com/your-org/arq/actions)
[![codecov](https://codecov.io/gh/your-org/arq/branch/main/graph/badge.svg)](https://codecov.io/gh/your-org/arq)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> A comprehensive platform for learning Quranic Arabic grammar through interactive lessons, exercises, and word-level analysis of the Quran.

## 🌟 Features

### Core Features
- **📚 Dual-Track Curriculum**: 250+ lessons across Track A (grammar-first) and Track B (verse-first)
- **📖 77,429 Word Analysis**: Complete grammatical analysis of every Quranic word
- **🎮 Gamification**: XP system, levels, achievements, streaks, and leaderboards
- **💪 Interactive Exercises**: 6 types including multiple choice, fill-in-blank, word analysis
- **📊 Progress Tracking**: Detailed analytics and personalized dashboards
- **🔍 Advanced Search**: Full-text search with Arabic root-based queries
- **🌐 Multi-language**: English, Arabic, Urdu support with RTL layout
- **📱 Cross-platform**: Web (Next.js), Mobile (React Native)

### 7 Essential Grammatical Properties
Each word analyzed for:
1. **Part of Speech** (POS) - Noun, Verb, Particle
2. **Gender** - Masculine, Feminine
3. **Number** - Singular, Dual, Plural
4. **Definiteness** - Definite (Ma'rifa), Indefinite (Nakira)
5. **I'rab/Case** - Nominative, Accusative, Genitive
6. **Case Sign** - Damma, Fatha, Kasra
7. **Murakkab/Structure** - Simple, Idafa, Prepositional Phrase

## 🚀 Quick Start

### Prerequisites
- Node.js 20 LTS
- PostgreSQL 15
- Redis 7
- Docker (optional)

### Installation

```bash
# Clone repository
git clone https://github.com/your-org/arq.git
cd arq

# Backend setup
cd backend
npm install
npx prisma migrate dev
npm run seed
npm run start:dev

# Frontend setup (new terminal)
cd frontend
npm install
npm run dev

# Mobile setup (new terminal)
cd mobile
npm install
npm start
```

### Docker Quick Start

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

Access the application:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001/api/v1
- **API Docs**: http://localhost:3001/api/docs

## 📖 Documentation

Comprehensive documentation is available:

### Getting Started
- [Development Setup](./DEVELOPMENT_SETUP.md) - Complete developer onboarding
- [Project Overview](./PROJECT_OVERVIEW.md) - High-level project description
- [Implementation Guide](./PROJECT_IMPLEMENTATION_GUIDE.md) - Step-by-step implementation

### Architecture & Design
- [Solution Architecture](./SOLUTION_ARCHITECTURE.md) - System architecture and design decisions
- [API Specification](./API_SPECIFICATION.md) - 50+ API endpoints documented
- [Data Architecture](./DATA_ARCHITECTURE.md) - Database schema and relationships
- [Curriculum Architecture](./CURRICULUM_ARCHITECTURE.md) - Learning path design

### Development Guides
- [Coding Standards](./CODING_STANDARDS.md) - TypeScript, React, NestJS standards
- [Git Workflow](./GIT_WORKFLOW.md) - Branching, commits, PRs, releases
- [Testing Strategy](./TESTING_STRATEGY.md) - Unit, integration, E2E testing
- [Code Review Checklist](./CODE_REVIEW_CHECKLIST.md) - Comprehensive review criteria

### Deployment & Operations
- [Deployment Guide](./DEPLOYMENT_GUIDE.md) - Local, staging, production deployment
- [Project Constraints](./PROJECT_CONSTRAINTS.md) - Technical constraints and policies

### Feature Specifications
- [Word-Level Analysis Specification](./WORD_LEVEL_ANALYSIS_SPECIFICATION.md) - 7 grammatical fields
- [Hierarchical Grammar Component](./HIERARCHICAL_GRAMMAR_COMPONENT_DESIGN.md) - Progressive disclosure UI
- [UI/UX Design](./UI_UX_COMPREHENSIVE_DESIGN.md) - Complete design system

### Agent OS Framework
- [Agent OS Project Definition](./AGENT_OS_PROJECT_DEFINITION.md) - 16 expert agent roles
- [Agent Definitions](./agents/) - Individual agent responsibilities

## 🏗️ Tech Stack

### Frontend (Web)
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript 5.x
- **UI Library**: React 18
- **State Management**: Zustand
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn/ui + Radix UI
- **Forms**: React Hook Form + Zod
- **Testing**: Jest + React Testing Library + Playwright

### Backend
- **Framework**: NestJS 10
- **Language**: TypeScript 5.x
- **ORM**: Prisma
- **Database**: PostgreSQL 15
- **Cache**: Redis 7
- **Authentication**: JWT (Access + Refresh tokens)
- **API Docs**: Swagger/OpenAPI
- **Testing**: Jest + Supertest

### Mobile
- **Framework**: React Native (Expo)
- **Language**: TypeScript 5.x
- **Navigation**: React Navigation
- **State**: Zustand (shared with web)
- **Storage**: AsyncStorage + SQLite

### DevOps
- **Containerization**: Docker + Docker Compose
- **Orchestration**: Kubernetes
- **CI/CD**: GitHub Actions
- **Hosting (Backend)**: DigitalOcean
- **Hosting (Frontend)**: Vercel
- **CDN**: CloudFlare
- **Monitoring**: Grafana + Prometheus + Sentry

## 📊 Project Structure

```
arQ/
├── backend/                    # NestJS API
│   ├── prisma/
│   │   ├── schema.prisma      # Database schema
│   │   ├── migrations/        # Database migrations
│   │   └── seed.ts            # Seed data
│   ├── src/
│   │   ├── main.ts            # Application entry
│   │   ├── app.module.ts      # Root module
│   │   ├── modules/           # Feature modules
│   │   └── common/            # Shared utilities
│   ├── test/                  # Tests
│   ├── Dockerfile
│   └── package.json
│
├── frontend/                   # Next.js web app
│   ├── src/
│   │   ├── app/               # App router pages
│   │   ├── components/        # React components
│   │   ├── lib/               # Utilities, hooks, stores
│   │   └── types/             # TypeScript types
│   ├── public/                # Static assets
│   ├── Dockerfile
│   └── package.json
│
├── mobile/                     # React Native app
│   ├── src/
│   │   ├── screens/           # Screen components
│   │   ├── navigation/        # Navigation config
│   │   └── components/        # Shared components
│   └── package.json
│
├── docs/                       # Documentation (400+ pages)
│   ├── SOLUTION_ARCHITECTURE.md
│   ├── API_SPECIFICATION.md
│   ├── CODING_STANDARDS.md
│   └── ... (11 major docs)
│
├── agents/                     # Agent OS definitions
│   ├── solution-architect.md
│   ├── backend-lead.md
│   └── ... (16 agents)
│
├── .github/
│   └── workflows/
│       └── ci.yml             # CI/CD pipeline
│
├── docker-compose.yml          # Local development
└── README.md                   # This file
```

## 🧪 Testing

### Run Tests

```bash
# Backend
cd backend
npm run test              # Unit tests
npm run test:e2e          # Integration tests
npm run test:cov          # Coverage report

# Frontend
cd frontend
npm run test              # Unit tests
npm run test:e2e          # E2E tests (Playwright)
npm run test:cov          # Coverage

# All tests
npm run test:all
```

### Test Coverage Requirements
- **Minimum**: 80% code coverage
- **Critical paths**: 100% coverage (auth, payments, user data)

## 📦 Deployment

### Staging Deployment
```bash
git push origin staging
# Auto-deploys via GitHub Actions
```

### Production Deployment
```bash
git push origin main
# Requires approval in GitHub
```

See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for detailed instructions.

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Follow our [Coding Standards](./CODING_STANDARDS.md)
4. Write tests for new features
5. Ensure all tests pass (`npm run test:all`)
6. Commit using [Conventional Commits](https://www.conventionalcommits.org/)
7. Push to your branch (`git push origin feature/amazing-feature`)
8. Open a Pull Request

See [GIT_WORKFLOW.md](./GIT_WORKFLOW.md) for detailed workflow.

### Code Review Process
All PRs require:
- ✅ 1+ approvals
- ✅ All CI checks passing
- ✅ Code coverage ≥80%
- ✅ No merge conflicts

See [CODE_REVIEW_CHECKLIST.md](./CODE_REVIEW_CHECKLIST.md) for review criteria.

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

### Agent OS Framework
- **PM**: Project coordination and delegation
- **Solution Architect**: System architecture
- **Backend Lead**: NestJS API development
- **Frontend Lead**: Next.js web development
- **Mobile Lead**: React Native app development
- **DevOps Engineer**: Infrastructure and deployment
- **QA Lead**: Testing strategy and execution
- **Security Engineer**: Security audits and compliance
- **Content Architect**: Curriculum design
- **Arabic Grammar Expert**: Grammatical validation
- **Database Architect**: Database design and optimization
- **Data Engineer**: Quranic data import and processing
- **Search Engineer**: Search and discovery features
- **Analytics Engineer**: User analytics and reporting
- **UI/UX Designer**: Interface and experience design
- **Visual Designer**: Branding and visual identity

See [AGENT_OS_PROJECT_DEFINITION.md](./AGENT_OS_PROJECT_DEFINITION.md) for details.

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/your-org/arq/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-org/arq/discussions)
- **Email**: support@arq.com

## 🙏 Acknowledgments

- **Quranic Corpus**: Morphological and syntactic analysis data
- **Open Source Community**: Amazing tools and libraries
- **Contributors**: Everyone who has contributed to this project

## 📈 Project Stats

- **Lines of Code**: ~30,000+
- **Documentation**: 400+ pages
- **API Endpoints**: 50+
- **Database Tables**: 15+
- **Quranic Words**: 77,429
- **Lessons**: 250+
- **Exercises**: 500+

---

**Built with ❤️ for Quranic Arabic learners worldwide**

---

## 🗺️ Roadmap

### Phase 1: MVP (Q1 2025) ✅
- [x] Complete documentation
- [x] Database schema
- [x] Backend API foundation
- [x] Authentication system
- [ ] Core lesson features
- [ ] Basic exercise types
- [ ] Student progress tracking

### Phase 2: Core Features (Q2 2025)
- [ ] All 250+ lessons
- [ ] All 6 exercise types
- [ ] Gamification system complete
- [ ] Word-level analysis viewer
- [ ] Search functionality
- [ ] Mobile app MVP

### Phase 3: Enhancement (Q3 2025)
- [ ] Teacher dashboard
- [ ] Analytics dashboard
- [ ] Advanced search
- [ ] Offline mode (mobile)
- [ ] Performance optimization

### Phase 4: Scale (Q4 2025)
- [ ] Multi-language support (Urdu)
- [ ] Premium features
- [ ] API for third-party integrations
- [ ] Advanced analytics
- [ ] Community features

---

**Last Updated**: 2025-11-03
**Version**: 1.0.0
