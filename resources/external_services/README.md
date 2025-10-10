# EXTERNAL SERVICES & PLATFORMS - THIRD-PARTY INTEGRATIONS

**Purpose**: Complete catalog of external services, APIs, platforms, and vendors
**Total Services**: 50+ service categories across 10 domains
**Annual Cost**: $100K-250K (Phase 1-2), $250K-500K (Phase 3+)

---

## 📋 TABLE OF CONTENTS

1. [Cloud Infrastructure](#1-cloud-infrastructure)
2. [Authentication & Identity](#2-authentication--identity)
3. [Payment Processing](#3-payment-processing)
4. [Communication Services](#4-communication-services)
5. [Media & Content Delivery](#5-media--content-delivery)
6. [Analytics & Tracking](#6-analytics--tracking)
7. [AAC & Accessibility APIs](#7-aac--accessibility-apis)
8. [Educational & Research Services](#8-educational--research-services)
9. [Monitoring & Security](#9-monitoring--security)
10. [Business & Compliance](#10-business--compliance)

---

## 1. CLOUD INFRASTRUCTURE

### Amazon Web Services (AWS) - Primary Cloud Provider

**Services Used**:

#### Compute
- **EC2** (Elastic Compute Cloud): Application servers, game servers
  - Instance Types: t3.medium (dev), m5.large (prod), c5.xlarge (game servers)
  - Auto Scaling Groups for load management
  - Cost: $200-800/month

- **Lambda**: Serverless functions for event-driven tasks
  - Image processing, data transformations, scheduled jobs
  - Cost: $50-200/month

- **ECS/Fargate**: Container orchestration for microservices
  - Docker containers, no EC2 management
  - Cost: $300-1,000/month

#### Database & Storage
- **RDS PostgreSQL**: Managed database (Multi-AZ for HA)
  - Instance: db.t3.large (dev), db.m5.xlarge (prod)
  - Storage: 500GB SSD, auto-scaling to 2TB
  - Automated backups (35-day retention)
  - Cost: $500-2,000/month

- **ElastiCache Redis**: Caching and session storage
  - Instance: cache.t3.medium (2.5GB)
  - Cost: $80-150/month

- **S3** (Simple Storage Service): Object storage
  - Videos, images, user uploads, backups
  - Lifecycle policies (S3 Standard → S3 IA → Glacier)
  - Cost: $100-500/month (depends on data volume)

- **CloudFront**: CDN for global content delivery
  - Cache static assets, videos, images
  - Cost: $150-600/month

#### Networking & Security
- **Route 53**: DNS management
  - Cost: $50/month

- **VPC** (Virtual Private Cloud): Network isolation
  - Private subnets for databases
  - Public subnets for load balancers
  - Cost: Included

- **WAF** (Web Application Firewall): DDoS protection, bot mitigation
  - Cost: $50-150/month

- **Certificate Manager**: Free SSL/TLS certificates
  - Cost: FREE

#### Monitoring & Logging
- **CloudWatch**: Metrics, logs, alarms
  - Cost: $50-200/month

- **CloudTrail**: Audit logging (HIPAA requirement)
  - Cost: $20/month

**Total AWS Cost**: $1,500-5,000/month (Phase 1), $5,000-15,000/month (Phase 3)

### Google Cloud Platform (GCP) - Secondary/Backup

**Services Used**:
- **Cloud Run**: Serverless containers (alternative to AWS Fargate)
- **Cloud SQL**: Managed PostgreSQL (backup to AWS RDS)
- **Firebase**: Mobile backend (authentication, real-time database, analytics)
  - Free tier: 10GB storage, 360MB/day downloads
  - Paid: ~$100-500/month

---

## 2. AUTHENTICATION & IDENTITY

### Auth0 (Primary Auth Service)
- **Purpose**: User authentication, SSO, MFA
- **Features**:
  - Social login (Google, Apple, Microsoft)
  - Username/password with MFA (SMS, authenticator app)
  - Passwordless (email magic links)
  - Role-based access control (RBAC)
  - JWT tokens
- **HIPAA Compliance**: BAA available (enterprise plan)
- **COPPA**: Age verification flows, parental consent management
- **Pricing**:
  - Free: 7,000 active users
  - Essentials: $35/month + $0.05/user
  - Professional: $240/month + $0.066/user
  - Enterprise: Custom (needed for HIPAA BAA)
- **Estimated Cost**: $500-2,000/month (10K-50K users)

### Alternatives
- **Firebase Authentication**: $0.01/verification (SMS), FREE for email/social
- **AWS Cognito**: $0.0055/monthly active user (MAU)
- **Okta**: Enterprise SSO ($2-8/user/month)

---

## 3. PAYMENT PROCESSING

### Stripe (Primary Payment Provider)
- **Purpose**: Subscription billing, one-time payments, invoices
- **Features**:
  - Credit/debit cards (Visa, Mastercard, Amex, Discover)
  - ACH bank transfers (US)
  - Digital wallets (Apple Pay, Google Pay)
  - Recurring billing (subscriptions)
  - Invoicing for enterprise customers
  - Customer portal (self-service billing)
  - Tax calculation (Stripe Tax)
- **PCI Compliance**: Stripe handles PCI (we don't touch card data)
- **COPPA**: Parental consent verification via credit card
- **Pricing**:
  - Online: 2.9% + $0.30 per transaction
  - Subscriptions: 0.5% additional
  - International: +1% for currency conversion
- **Estimated Revenue Processing**: $1M → $30K fees
- **Monthly Cost**: $500-3,000 (fees, Stripe Tax, etc.)

### PayPal (Secondary)
- **Purpose**: Alternative payment method for families without cards
- **Fees**: 3.49% + $0.49 per transaction (higher than Stripe)
- **Estimated Cost**: $200-1,000/month

### Apple/Google In-App Purchases (Mobile)
- **Purpose**: iOS App Store, Google Play subscriptions
- **Fees**: 30% (first year), 15% (after year 1 for subscriptions)
- **Estimated Cost**: 15-30% of mobile revenue ($50K-200K/year if $200K mobile revenue)

---

## 4. COMMUNICATION SERVICES

### Twilio (SMS/Voice)
- **Purpose**: SMS notifications, 2FA codes, voice calls (customer support)
- **Features**:
  - SMS (US): $0.0079/message sent
  - Voice (US): $0.013/min
  - MFA via SMS (Verify API): $0.05/verification
- **Estimated Cost**: $200-800/month (5K-20K SMS/month)

### SendGrid (Email)
- **Purpose**: Transactional emails, marketing emails
- **Features**:
  - Welcome emails, password resets, receipts, progress reports
  - Marketing campaigns
  - Email templates with dynamic content
  - Analytics (open rates, click rates)
- **HIPAA**: BAA available (Pro plan+)
- **Pricing**:
  - Free: 100 emails/day
  - Essentials: $19.95/month (50K emails)
  - Pro: $89.95/month (1.5M emails) + HIPAA BAA
- **Estimated Cost**: $100-500/month

### Mailchimp (Marketing Emails)
- **Purpose**: Newsletters, announcements, parenting tips
- **Pricing**:
  - Free: 500 contacts, 1K emails/month
  - Essentials: $13/month (500 contacts)
  - Standard: $20/month (includes automation)
- **Estimated Cost**: $50-300/month

### Intercom (Customer Support)
- **Purpose**: In-app chat, help desk, knowledge base
- **Features**:
  - Live chat widget
  - Chatbots for FAQs
  - Ticket management
  - Knowledge base articles
- **Pricing**:
  - Start: $74/month
  - Grow: $395/month
  - Scale: $999/month
- **Estimated Cost**: $400-1,000/month

---

## 5. MEDIA & CONTENT DELIVERY

### Vimeo (Video Hosting)
- **Purpose**: Teaching videos, skill demonstrations
- **Features**:
  - Ad-free playback
  - Privacy controls (unlisted, password-protected)
  - Captions/subtitles (WCAG compliance)
  - Player customization
  - Analytics (watch time, engagement)
- **Pricing**:
  - Plus: $20/month (5GB/week upload)
  - Pro: $65/month (20GB/week)
  - Business: $195/month (unlimited)
- **Estimated Cost**: $200-500/month (50 videos in Phase 1, growing to 200+)

### Cloudinary (Image/Video Optimization)
- **Purpose**: Image transformations, CDN, responsive images
- **Features**:
  - Auto-format (WebP, AVIF for supported browsers)
  - Responsive images (srcset)
  - Face detection for cropping
  - Watermarking
  - Video transcoding
- **Pricing**:
  - Free: 25GB storage, 25GB bandwidth
  - Plus: $99/month (100GB storage, 100GB bandwidth)
  - Advanced: $249/month (500GB storage, 500GB bandwidth)
- **Estimated Cost**: $100-500/month

### AWS Media Services (Alternative for Video)
- **MediaConvert**: Video transcoding ($0.015/min SD, $0.06/min HD)
- **MediaLive**: Live streaming ($2.40/hour per channel)
- **Estimated Cost**: $200-1,000/month (if heavy video usage)

---

## 6. ANALYTICS & TRACKING

### Mixpanel (Product Analytics)
- **Purpose**: Event tracking, funnels, retention, cohorts
- **Features**:
  - Track user actions (skill completed, game played, level passed)
  - Conversion funnels (signup → first game → subscription)
  - Retention analysis (DAU, MAU, stickiness)
  - Cohort analysis
  - A/B test results analysis
- **HIPAA**: BAA available (enterprise plan)
- **Pricing**:
  - Free: 100K events/month
  - Growth: $24/month (100K events) to $833/month (10M events)
  - Enterprise: Custom (HIPAA BAA)
- **Estimated Cost**: $500-3,000/month

### Google Analytics 4 (Web Analytics)
- **Purpose**: Website traffic, page views, user journeys
- **Cost**: FREE (up to 10M events/month)
- **HIPAA**: NOT HIPAA-compliant (do not send PHI)
- **Use Case**: Public website, blog, marketing pages

### Amplitude (Alternative to Mixpanel)
- **Purpose**: Product analytics, behavioral analytics
- **Pricing**: Free (10M events/month), then $49-995/month
- **Estimated Cost**: $500-2,000/month

### PostHog (Open-Source Alternative)
- **Purpose**: Self-hosted product analytics
- **Features**: Event tracking, session replay, feature flags, A/B testing
- **Cost**: $0 (self-hosted on AWS) + hosting costs (~$200/month)

---

## 7. AAC & ACCESSIBILITY APIS

### Proloquo2Go SDK (AssistiveWare)
- **Purpose**: AAC app integration for iOS
- **Features**:
  - Access Proloquo2Go vocabulary
  - Send phrases to Proloquo2Go for speech output
  - Import custom vocabulary into games
- **Licensing**: Contact AssistiveWare for SDK license
- **Estimated Cost**: $5,000-15,000/year (SDK license)

### TD Snap API (Tobii Dynavox)
- **Purpose**: Integration with TD Snap AAC app
- **Features**:
  - Import symbol sets
  - Trigger speech output
  - Export game vocabulary to TD Snap
- **Licensing**: Enterprise partnership agreement
- **Estimated Cost**: $10,000-25,000/year

### LAMP Words for Life SDK (Prentke Romich)
- **Purpose**: LAMP methodology AAC integration
- **Features**:
  - Motor planning-based layouts
  - Consistent symbol placement
- **Licensing**: Partnership required
- **Estimated Cost**: $8,000-20,000/year

### Open AAC Libraries (Free Alternatives)
- **Open Symbols**: Open-source symbol library (CC-BY-SA)
- **Mulberry Symbols**: Free symbol set (CC-BY-SA)
- **ARASAAC**: Spanish AAC symbols (CC-BY-NC-SA)
- **Cost**: FREE (attribution required)

---

## 8. EDUCATIONAL & RESEARCH SERVICES

### REDCap (Research Data Capture)
- **Purpose**: Clinical research data collection for RCT
- **Features**:
  - HIPAA-compliant surveys
  - Data validation rules
  - Audit trails
  - IRB-ready data exports
- **Hosting**: Self-hosted (free software) or cloud ($5,000/year)
- **Estimated Cost**: $5,000-10,000/year (cloud hosting + support)

### Qualtrics (Survey Platform)
- **Purpose**: Parent surveys, usability testing, feedback
- **Features**:
  - Advanced survey logic
  - Panel management
  - Analytics dashboards
- **Pricing**: $1,500-5,000/year (academic license cheaper)
- **Estimated Cost**: $2,000-4,000/year

### IRB Management Software
- **IRBNet**: Multi-site IRB submissions ($3,000-8,000/year)
- **Huron IRB Manager**: Enterprise IRB software ($10,000+/year)
- **Estimated Cost**: $3,000-10,000/year (if doing formal research)

---

## 9. MONITORING & SECURITY

### Sentry (Error Tracking)
- **Purpose**: Real-time error monitoring and crash reporting
- **Features**:
  - Error grouping and prioritization
  - Source map support (identify exact code line)
  - Release tracking
  - User feedback collection
  - Performance monitoring (transaction traces)
- **Pricing**:
  - Developer: FREE (5K errors/month)
  - Team: $26/month (50K errors/month)
  - Business: $80/month (unlimited errors)
- **Estimated Cost**: $100-500/month

### DataDog (APM & Monitoring)
- **Purpose**: Application performance monitoring, logging, infrastructure monitoring
- **Features**:
  - APM (trace requests across services)
  - Log aggregation and search
  - Infrastructure monitoring (CPU, memory, disk)
  - Custom dashboards
  - Alerting (PagerDuty, Slack, email)
- **Pricing**:
  - Pro: $15/host/month + $8/million log events
  - Enterprise: $23/host/month
- **Estimated Cost**: $500-3,000/month (10-50 hosts + logging)

### LogRocket (Session Replay)
- **Purpose**: Record user sessions to debug issues
- **Features**:
  - Session replay (see what user saw)
  - Console logs, network requests
  - Error tracking integration
  - Heatmaps
- **Pricing**:
  - Team: $99/month (1K sessions)
  - Professional: $299/month (10K sessions)
  - Enterprise: Custom
- **Estimated Cost**: $300-1,500/month

### Snyk (Security Scanning)
- **Purpose**: Dependency vulnerability scanning
- **Features**:
  - Scan npm, pip, Maven dependencies for CVEs
  - Auto-fix PRs
  - License compliance
  - Container scanning
- **Pricing**:
  - Free: 200 tests/month
  - Team: $98/month (unlimited tests)
  - Enterprise: Custom
- **Estimated Cost**: $100-500/month

---

## 10. BUSINESS & COMPLIANCE

### Stripe Tax (Sales Tax Calculation)
- **Purpose**: Automated sales tax/VAT calculation and filing
- **Features**:
  - Tax calculation for US, EU, AU, CA
  - Auto-update rates
  - Tax reporting
- **Pricing**: 0.5% of transaction amount (separate from Stripe fees)
- **Estimated Cost**: $500-2,000/month (on $100K-400K revenue)

### Drata (Compliance Automation)
- **Purpose**: SOC 2, HIPAA, GDPR compliance automation
- **Features**:
  - Continuous monitoring
  - Evidence collection
  - Audit readiness
  - Policy management
- **Pricing**: $1,500-3,000/month
- **Estimated Cost**: $20,000-40,000/year (if seeking SOC 2 compliance)

### Vanta (Alternative to Drata)
- **Purpose**: Compliance automation (SOC 2, HIPAA, ISO 27001)
- **Pricing**: $3,000-8,000/year
- **Estimated Cost**: $5,000-10,000/year

### DocuSign (Contract Management)
- **Purpose**: Electronic signatures for consent forms, contracts, BAAs
- **Pricing**:
  - Personal: $15/month (5 documents)
  - Standard: $45/month (unlimited)
  - Business Pro: $65/month
- **Estimated Cost**: $500-1,000/year

---

## 📊 COST SUMMARY

### Phase 1 (Months 1-3) - Annual Costs

| Category | Services | Annual Cost |
|----------|----------|-------------|
| **Cloud Infrastructure** | AWS (EC2, RDS, S3, CloudFront) | $18,000-60,000 |
| **Authentication** | Auth0 Essentials/Professional | $6,000-24,000 |
| **Payment Processing** | Stripe (fees on $400K revenue) | $12,000 |
| **Communication** | Twilio, SendGrid, Intercom | $10,000-20,000 |
| **Media & CDN** | Vimeo, Cloudinary | $2,400-6,000 |
| **Analytics** | Mixpanel, GA4 | $6,000-36,000 |
| **AAC Integration** | Proloquo2Go SDK, TD Snap API | $15,000-40,000 |
| **Monitoring** | Sentry, DataDog, LogRocket | $10,000-50,000 |
| **Compliance** | Drata/Vanta (if needed) | $0-40,000 |
| **Business Tools** | DocuSign, Stripe Tax | $2,000-5,000 |
| **TOTAL PHASE 1** | | **$81,400-293,000** |

**Conservative Estimate**: $100,000-150,000/year
**With full compliance automation**: $200,000-300,000/year

### Phase 2 (Months 4-9) - Additional Annual Costs

| Category | Additional Services | Additional Annual Cost |
|----------|---------------------|------------------------|
| **Cloud Scale-Up** | 3x infrastructure (more users, games) | $40,000-120,000 |
| **Analytics Upgrade** | Enterprise tiers for HIPAA | $20,000-50,000 |
| **Research Tools** | REDCap, IRBNet, Qualtrics | $10,000-22,000 |
| **Customer Support** | Zendesk, expanded Intercom | $10,000-25,000 |
| **Marketing Tools** | Mailchimp, HubSpot, ad platforms | $15,000-50,000 |
| **TOTAL PHASE 2 ADDITIONAL** | | **$95,000-267,000** |

**Phase 2 Total**: $195,000-460,000/year

### Phase 3 (Months 10-18) - Additional Annual Costs

| Category | Additional Services | Additional Annual Cost |
|----------|---------------------|------------------------|
| **Cloud at Scale** | 5x infrastructure, multi-region | $100,000-300,000 |
| **VR/AR Services** | Unity Cloud Build, Meta Quest APIs | $10,000-30,000 |
| **Enterprise Support** | 24/7 support plans for all services | $30,000-80,000 |
| **International** | Localization services, global CDN | $20,000-60,000 |
| **TOTAL PHASE 3 ADDITIONAL** | | **$160,000-470,000** |

**Phase 3 Total**: $355,000-930,000/year

---

## 💡 COST OPTIMIZATION STRATEGIES

### Year 1 Cost Reduction
1. **Use Free Tiers**: Firebase Auth (free), GA4 (free), PostHog self-hosted ($0)
2. **Delay AAC SDK Licenses**: Use open symbol libraries initially (save $30K)
3. **Skip Compliance Automation**: Manual compliance initially (save $20-40K)
4. **DIY Monitoring**: Prometheus/Grafana instead of DataDog (save $20K)
5. **Limit Cloud Regions**: Single region (US East) only (save $10-20K)

**Optimized Phase 1 Cost**: $50,000-80,000/year (vs $100-150K)

### Reserved Instances & Savings Plans
- AWS Reserved Instances: 30-60% savings (commit 1-3 years)
- Stripe volume discounts: Negotiate at $1M+ annual processing
- Annual prepay discounts: Most SaaS offers 10-20% off for annual billing

### Open-Source Alternatives
- **PostHog** (vs Mixpanel): $0 vs $36K/year
- **Grafana/Prometheus** (vs DataDog): $200/month hosting vs $3K/month
- **Mattermost** (vs Slack): $0 vs $10K/year
- **Matomo** (vs Google Analytics): Self-hosted, HIPAA-compliant

---

## 🔧 INTEGRATION GUIDES

Detailed integration documentation:
- [AWS Setup Guide](./integration_guides/aws_setup.md)
- [Auth0 Integration](./integration_guides/auth0_integration.md)
- [Stripe Payment Setup](./integration_guides/stripe_setup.md)
- [AAC SDK Integration](./integration_guides/aac_integration.md)
- [Analytics Implementation](./integration_guides/analytics_setup.md)
- [HIPAA BAA Templates](./compliance/hipaa_baa_template.md)

---

**Last Updated**: October 10, 2025
**Total Services**: 50+ integrations
**Annual Cost Range**: $50K (optimized) to $930K (full scale Phase 3)
