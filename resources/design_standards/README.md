# DESIGN STANDARDS & FRAMEWORKS - BEST PRACTICES GUIDE

**Purpose**: Complete catalog of design standards, accessibility guidelines, compliance frameworks, and industry best practices
**Total Standards**: 15+ major frameworks covering accessibility, privacy, quality, education, and gaming
**Compliance Level**: Enterprise-grade for autism educational gaming

---

## 📋 TABLE OF CONTENTS

1. [Accessibility Standards](#1-accessibility-standards)
2. [Privacy & Legal Compliance](#2-privacy--legal-compliance)
3. [Quality & Security Standards](#3-quality--security-standards)
4. [Educational Standards](#4-educational-standards)
5. [Game Design Frameworks](#5-game-design-frameworks)
6. [Autism-Specific Guidelines](#6-autism-specific-guidelines)
7. [Implementation Checklists](#7-implementation-checklists)

---

## 1. ACCESSIBILITY STANDARDS

### WCAG 2.1 Level AA (Primary Standard)

**Web Content Accessibility Guidelines 2.1**
- **Authority**: W3C (World Wide Web Consortium)
- **Compliance Level**: Level AA (50 criteria)
- **Legal Requirement**: Section 508 (US), EN 301 549 (EU), AODA (Canada)

**Four Principles (POUR)**:
1. **Perceivable**: Information must be presentable to users in ways they can perceive
2. **Operable**: UI components and navigation must be operable
3. **Understandable**: Information and UI operation must be understandable
4. **Robust**: Content must be robust enough for assistive technologies

**50 Success Criteria Breakdown**:

#### Level A (30 criteria) - Must Meet All
- **Perceivable**:
  - 1.1.1 Non-text Content (alt text for images)
  - 1.2.1-1.2.3 Audio/Video alternatives (captions, audio descriptions)
  - 1.3.1-1.3.3 Info and Relationships, Meaningful Sequence, Sensory Characteristics
  - 1.4.1-1.4.2 Use of Color, Audio Control
- **Operable**:
  - 2.1.1-2.1.2 Keyboard accessible, No Keyboard Trap
  - 2.2.1-2.2.2 Timing Adjustable, Pause/Stop/Hide
  - 2.3.1 Three Flashes or Below Threshold
  - 2.4.1-2.4.4 Bypass Blocks, Page Titled, Focus Order, Link Purpose
- **Understandable**:
  - 3.1.1 Language of Page
  - 3.2.1-3.2.2 On Focus, On Input (no unexpected changes)
  - 3.3.1-3.3.2 Error Identification, Labels or Instructions
- **Robust**:
  - 4.1.1-4.1.2 Parsing, Name/Role/Value

#### Level AA (20 additional criteria) - Must Meet All
- **Perceivable**:
  - 1.2.4-1.2.5 Captions (Live), Audio Description (Prerecorded)
  - 1.3.4-1.3.5 Orientation, Identify Input Purpose
  - 1.4.3-1.4.5 Contrast (Minimum 4.5:1), Resize Text, Images of Text
  - 1.4.10-1.4.13 Reflow, Non-text Contrast, Text Spacing, Content on Hover/Focus
- **Operable**:
  - 2.4.5-2.4.7 Multiple Ways, Headings and Labels, Focus Visible
  - 2.5.1-2.5.4 Pointer Gestures, Pointer Cancellation, Label in Name, Motion Actuation
- **Understandable**:
  - 3.1.2 Language of Parts
  - 3.2.3-3.2.4 Consistent Navigation, Consistent Identification
  - 3.3.3-3.3.4 Error Suggestion, Error Prevention (Legal, Financial, Data)

#### Level AAA (Optional - Exceed where feasible)
- **Contrast (Enhanced)**: 7:1 ratio (vs 4.5:1 for AA)
- **Sign Language Interpretation**: For video content
- **Extended Audio Description**: Detailed descriptions
- **Re-authentication**: Session management

**SkillBridge Target**: **100% Level AA + Select AAA criteria (contrast 7:1, extended descriptions)**

### Section 508 (US Federal Standard)
- **Authority**: US Access Board
- **Requirement**: Federal agencies and contractors
- **Alignment**: Harmonized with WCAG 2.0 Level AA
- **Additional**: ICT accessibility (hardware, software, web)
- **Penalties**: Contract loss, legal action
- **SkillBridge Relevance**: If seeking government/school contracts

### EN 301 549 (European Standard)
- **Authority**: ETSI (European Telecommunications Standards Institute)
- **Requirement**: EU public sector procurement
- **Alignment**: Based on WCAG 2.1 Level AA
- **Additional**: Mobile, hardware, documentation accessibility
- **SkillBridge Relevance**: EU market expansion

### ARIA (Accessible Rich Internet Applications)
- **Purpose**: Semantic roles for dynamic web content
- **Key Concepts**:
  - **Roles**: Define element type (button, navigation, alert, dialog)
  - **Properties**: Describe element characteristics (aria-label, aria-describedby)
  - **States**: Dynamic element states (aria-expanded, aria-selected, aria-disabled)
- **Common Patterns**:
  - Modal dialogs with focus trapping
  - Custom dropdowns and autocomplete
  - Tab panels and accordions
  - Live regions for dynamic content
  - Progress indicators

**Implementation**: All custom components must have proper ARIA attributes

---

## 2. PRIVACY & LEGAL COMPLIANCE

### COPPA (Children's Online Privacy Protection Act)

**Authority**: FTC (Federal Trade Commission), United States
**Applies To**: Children under 13 years old
**Penalties**: Up to $51,744 per violation

**Core Requirements**:
1. **Privacy Policy**:
   - Clear, prominent, comprehensive
   - Explain what information collected, how used, with whom shared
   - Parent's rights (access, deletion, withdraw consent)

2. **Verifiable Parental Consent** (VPC):
   - Must obtain before collecting child data
   - Methods:
     - Credit card verification
     - Government-issued ID check
     - Face-to-face meeting
     - Knowledge-based authentication
   - Cannot use email-only consent

3. **Data Minimization**:
   - Collect only necessary information
   - Delete data when no longer needed
   - Reasonable security measures

4. **Parent Access Rights**:
   - Review child's information
   - Delete child's information
   - Refuse further collection

5. **Third-Party Disclosure**:
   - Notify parents of any third-party data sharing
   - Obtain consent for marketing

**SkillBridge Implementation**:
- Age gate at signup (verify under 13)
- VPC system using credit card + ID verification
- Parent portal for data access/deletion
- No behavioral advertising to children
- Annual COPPA compliance audit

### HIPAA (Health Insurance Portability and Accountability Act)

**Authority**: HHS (US Department of Health and Human Services)
**Applies To**: Protected Health Information (PHI) - autism diagnosis, therapy data
**Penalties**: $100-$50,000 per violation, up to $1.5M/year per category

**Core Requirements**:
1. **Privacy Rule**:
   - Notice of Privacy Practices (NPP) to patients
   - Minimum necessary standard (only access needed PHI)
   - Patient rights (access, amendment, accounting of disclosures)

2. **Security Rule** (Administrative, Physical, Technical):
   - **Administrative**: Risk analysis, workforce training, incident response
   - **Physical**: Facility access controls, workstation security, device/media controls
   - **Technical**: Access controls, audit controls, integrity controls, transmission security (TLS 1.2+)

3. **Breach Notification Rule**:
   - Notify patients within 60 days of breach
   - HHS notification if >500 individuals affected
   - Annual report of breaches <500 individuals

4. **Business Associate Agreements (BAAs)**:
   - Required with all third-party vendors handling PHI
   - AWS, SendGrid, analytics providers must sign BAA

**SkillBridge Implementation**:
- Encrypt PHI at rest (AES-256) and in transit (TLS 1.2+)
- Role-based access control (RBAC) - therapists see only their learners
- Audit logs for all PHI access (7-year retention)
- BAAs with AWS, Twilio, SendGrid, analytics vendors
- Annual HIPAA security risk assessment
- Incident response plan and tabletop exercises

### GDPR-K (GDPR for Children)

**Authority**: European Union
**Applies To**: Children under 16 (or 13-15 depending on member state)
**Penalties**: Up to €20M or 4% global revenue, whichever is higher

**Core Requirements**:
1. **Age of Consent**:
   - Varies by country: 13 (UK), 15 (France), 16 (Germany)
   - Must verify age and parental consent

2. **Enhanced Consent**:
   - Clear, plain language (not legal jargon)
   - Granular consent (separate for different purposes)
   - Easily withdrawable

3. **Data Subject Rights** (Enhanced for children):
   - Right to access, rectification, erasure ("right to be forgotten")
   - Right to data portability (export data in machine-readable format)
   - Right to object to processing

4. **Privacy by Design**:
   - Data protection built into system from the start
   - Data minimization
   - Pseudonymization where possible

**SkillBridge Implementation**:
- Age verification system with country-specific thresholds
- Granular consent checkboxes (analytics, marketing, research)
- One-click data export and deletion
- DPO (Data Protection Officer) appointed
- DPIA (Data Protection Impact Assessment) completed

### FERPA (Family Educational Rights and Privacy Act)

**Authority**: US Department of Education
**Applies To**: Educational records from schools
**Relevance**: If integrating with school IEP systems

**Core Requirements**:
- Parent consent before disclosing educational records
- Parents have right to review and amend records
- Annual notification of FERPA rights

**SkillBridge Implementation**:
- If integrating with schools: FERPA-compliant data handling
- Separate data silos for school vs family data
- School-specific consent workflows

---

## 3. QUALITY & SECURITY STANDARDS

### ISO/IEC 25010:2023 (Software Quality Model)

**Authority**: International Organization for Standardization
**Purpose**: Software product quality characteristics

**8 Quality Characteristics**:
1. **Functional Suitability**: Meets stated needs (functional completeness, correctness, appropriateness)
2. **Performance Efficiency**: Time behavior, resource utilization, capacity
3. **Compatibility**: Co-existence with other systems, interoperability
4. **Usability**: Appropriateness recognizability, learnability, operability, user error protection, UI aesthetics, accessibility
5. **Reliability**: Maturity, availability, fault tolerance, recoverability
6. **Security**: Confidentiality, integrity, non-repudiation, accountability, authenticity
7. **Maintainability**: Modularity, reusability, analyzability, modifiability, testability
8. **Portability**: Adaptability, installability, replaceability

**SkillBridge Target**: Score 4.0+/5.0 on all 8 characteristics (validated through third-party audit)

### OWASP Top 10 (Security)

**Authority**: Open Web Application Security Project
**Purpose**: Top 10 web application security risks (2021 version)

1. **Broken Access Control**: Enforce principle of least privilege
2. **Cryptographic Failures**: Encrypt sensitive data (TLS, AES-256)
3. **Injection**: Parameterized queries, input validation
4. **Insecure Design**: Threat modeling, secure design patterns
5. **Security Misconfiguration**: Harden servers, disable unused features
6. **Vulnerable Components**: Keep dependencies updated, scan for CVEs
7. **Authentication Failures**: MFA, secure session management
8. **Software and Data Integrity**: Code signing, integrity checks
9. **Security Logging/Monitoring**: Comprehensive logging, SIEM
10. **Server-Side Request Forgery (SSRF)**: Validate and sanitize URLs

**SkillBridge Implementation**:
- Monthly OWASP ZAP scans
- Snyk for dependency scanning
- Penetration testing (annual)
- Web Application Firewall (AWS WAF)

### PCI-DSS (Payment Card Industry Data Security Standard)

**Authority**: PCI Security Standards Council
**Applies To**: Storing, processing, transmitting credit card data
**Compliance Level**: SAQ A (if using Stripe/PayPal - they handle cards)

**Requirements** (If handling cards directly):
- Install and maintain firewall
- Encrypt cardholder data
- Use antivirus software
- Develop secure systems
- Restrict access to cardholder data
- Assign unique ID to each person with access
- Restrict physical access to cardholder data
- Track and monitor access
- Regularly test security
- Maintain information security policy

**SkillBridge Approach**: **Use Stripe/PayPal (SAQ A)** - never store cards ourselves

---

## 4. EDUCATIONAL STANDARDS

### Universal Design for Learning (UDL)

**Authority**: CAST (Center for Applied Special Technology)
**Purpose**: Framework for inclusive education

**3 Principles**:
1. **Multiple Means of Engagement** (the "Why" of learning):
   - Recruiting interest (choice, relevance, minimize threats)
   - Sustaining effort (goals, collaboration, feedback)
   - Self-regulation (motivation, coping strategies)

2. **Multiple Means of Representation** (the "What" of learning):
   - Perception (auditory, visual, tactile alternatives)
   - Language/symbols (vocabulary, syntax, multilingual)
   - Comprehension (background knowledge, patterns, transfer)

3. **Multiple Means of Action & Expression** (the "How" of learning):
   - Physical action (alternatives to motor requirements)
   - Expression and communication (tools, construction, fluency)
   - Executive functions (goal-setting, planning, monitoring)

**SkillBridge Implementation**:
- Games offer multiple difficulty levels (engagement)
- AAC + voice + text + visual options (representation)
- Touch, keyboard, switch, voice control (action/expression)

### STEAM Education Standards

**Components**: Science, Technology, Engineering, Arts, Mathematics
**Standards Source**: NGSS (Next Generation Science Standards), Common Core Math, National Core Arts Standards

**Key Requirements**:
1. **Integrated Learning**: Connect 2+ STEAM domains authentically
2. **Inquiry-Based**: Student-driven exploration and discovery
3. **Real-World Application**: Solve authentic problems
4. **Creative Thinking**: Encourage innovation and design thinking

**SkillBridge Implementation**:
- Games integrate multiple STEAM domains (math + art in pattern games, science + engineering in building games)
- Inquiry-based quests and challenges
- Real-world scenarios (grocery shopping, job interviews)

### ISTE Standards for Students

**Authority**: International Society for Technology in Education
**Purpose**: Digital age learning competencies

**7 Standards**:
1. **Empowered Learner**: Set goals, build networks, use technology for learning
2. **Digital Citizen**: Recognize rights, responsibilities, and opportunities
3. **Knowledge Constructor**: Curate, evaluate, and synthesize information
4. **Innovative Designer**: Solve problems through iterative design process
5. **Computational Thinker**: Develop strategies using technological methods
6. **Creative Communicator**: Communicate clearly using digital tools
7. **Global Collaborator**: Work collaboratively with diverse teams

**SkillBridge Alignment**: Games teach digital citizenship, problem-solving, creativity, collaboration

---

## 5. GAME DESIGN FRAMEWORKS

### MDA Framework (Mechanics, Dynamics, Aesthetics)

**Authority**: Hunicke, LeBlanc, Zubek (2004)
**Purpose**: Formal approach to understanding games

**3 Levels**:
1. **Mechanics**: Rules and systems (what player can do)
2. **Dynamics**: Runtime behavior (how rules create experiences)
3. **Aesthetics**: Emotional responses (what player feels)

**8 Aesthetic Types**:
- Sensation (sensory pleasure)
- Fantasy (make-believe)
- Narrative (story)
- Challenge (obstacle course)
- Fellowship (social framework)
- Discovery (exploration)
- Expression (self-expression)
- Submission (pastime)

**SkillBridge Application**: Design games targeting specific aesthetics (Challenge for skill mastery, Fellowship for social games, Discovery for exploration-based learning)

### Bartle's Player Taxonomy

**Authority**: Richard Bartle (1996)
**Purpose**: Understanding player motivations

**4 Player Types**:
1. **Achievers**: Motivated by mastery, completion, achievement
2. **Explorers**: Motivated by discovery, understanding systems
3. **Socializers**: Motivated by interaction, relationships
4. **Killers**: Motivated by competition, dominance (less relevant for autism gaming)

**SkillBridge Application**:
- Achievement badges and skill trees (Achievers)
- Hidden secrets and unlockables (Explorers)
- Safe multiplayer and co-op modes (Socializers)
- Leaderboards (optional, non-threatening for Achievers)

### Self-Determination Theory (SDT) - Deci & Ryan

**Purpose**: Psychology of intrinsic motivation
**Relevance**: Designing non-exploitative game motivation

**3 Psychological Needs**:
1. **Autonomy**: Sense of choice and control
2. **Competence**: Feeling effective and capable
3. **Relatedness**: Connection with others

**SkillBridge Application**:
- Player chooses games, themes, difficulty (autonomy)
- Scaffolded challenges ensure success (competence)
- Co-op modes and safe social features (relatedness)

**Anti-Pattern**: Avoid extrinsic rewards undermining intrinsic motivation (overjustification effect)

### Flow Theory - Csikszentmihalyi

**Purpose**: Optimal experience state
**Relevance**: Balancing challenge and skill

**Flow Characteristics**:
- Clear goals
- Immediate feedback
- Challenge matches skill level
- Intense concentration
- Loss of self-consciousness
- Distorted time perception

**SkillBridge Application**:
- Adaptive difficulty maintains flow state
- Real-time feedback on performance
- Clear objectives per level
- Progress visualizations

---

## 6. AUTISM-SPECIFIC GUIDELINES

### Neurodiversity Design Principles

**Authority**: Autistic Self Advocacy Network (ASAN), Neurodiversity Design System

**Core Principles**:
1. **Nothing About Us Without Us**: Co-design with autistic people
2. **Presume Competence**: Assume capability, provide access
3. **Respect Communication Diversity**: AAC, speech, text, signs all valid
4. **Honor Sensory Needs**: Customizable sensory experiences
5. **Support Executive Function**: Scaffolding, checklists, visual supports
6. **Avoid Compliance-Based Goals**: Focus on functional skills the person values
7. **Respect Stimming**: Don't suppress self-regulation behaviors
8. **Clear, Literal Language**: Avoid idioms, sarcasm, complex metaphors

### Sensory Design for Autism (32 Criteria)

**Based on research**: Sensory Profile 2 (Dunn), SPM (Sensory Processing Measure)

**8 Sensory Considerations** (4 levels each: high, moderate, low, custom):
1. **Visual**: Brightness, contrast, color saturation, animation speed
2. **Auditory**: Volume, frequency range, sudden sounds, background noise
3. **Vestibular**: Motion, camera movement, screen shake, parallax
4. **Proprioceptive**: Haptic feedback intensity, vibration patterns
5. **Tactile**: Touch target size, gesture complexity, drag distance
6. **Interoceptive**: Breaks reminders, calm spaces, regulation supports
7. **Temporal**: Pacing, time pressure, wait times, transitions
8. **Cognitive Load**: Information density, distractions, multi-tasking demands

**SkillBridge Implementation**: 4 sensory profiles (Calm, Energetic, Focused, Custom) allowing full customization

### AAC Best Practices

**Authority**: ASHA (American Speech-Language-Hearing Association), ISAAC (International Society for AAC)

**Core AAC Principles**:
1. **Presumed Competence**: Provide robust communication systems
2. **Motor Planning Support**: Predictable layouts, consistent placement
3. **Vocabulary Organization**: Semantic/schematic organization
4. **Modeling**: Adults use AAC alongside child
5. **Wait Time**: Allow processing time (5-10 seconds)
6. **Core + Fringe**: High-frequency core words + topic-specific fringe
7. **Multimodal**: Combine AAC with speech, signs, gestures

**SkillBridge AAC Features**:
- Core vocabulary always accessible (go, more, help, stop, want, like)
- Symbol libraries: PCS, SymbolStix, Widgit
- Schematic layouts (people, places, actions, objects, descriptors)
- AAC modeling videos
- Adjustable wait times
- Voice output customization

---

## 7. IMPLEMENTATION CHECKLISTS

### WCAG 2.1 AA Compliance Checklist

**Perceivable** (13 criteria):
- [ ] 1.1.1 All images have alt text
- [ ] 1.2.1-1.2.5 All videos have captions, transcripts, audio descriptions
- [ ] 1.3.1 Content structure uses semantic HTML (headings, lists, tables)
- [ ] 1.3.2 Reading order is logical
- [ ] 1.3.3 Instructions don't rely solely on sensory characteristics (shape, color, location)
- [ ] 1.3.4 Content adapts to portrait/landscape orientation
- [ ] 1.3.5 Input fields have autocomplete attributes
- [ ] 1.4.1 Color is not the only visual means of conveying information
- [ ] 1.4.2 Audio can be paused/stopped
- [ ] 1.4.3 Text contrast is at least 4.5:1 (3:1 for large text)
- [ ] 1.4.4 Text can be resized to 200% without loss of content
- [ ] 1.4.5 Images of text are avoided (use real text)
- [ ] 1.4.10-1.4.13 Content reflows, non-text contrast 3:1, text spacing adjustable, no content loss on hover

**Operable** (17 criteria):
- [ ] 2.1.1 All functionality available via keyboard
- [ ] 2.1.2 Keyboard focus can be moved away from all components
- [ ] 2.1.4 Keyboard shortcuts can be disabled or remapped
- [ ] 2.2.1 Time limits can be adjusted/extended/disabled
- [ ] 2.2.2 Moving/blinking content can be paused
- [ ] 2.3.1 No content flashes more than 3 times per second
- [ ] 2.4.1 Skip navigation links provided
- [ ] 2.4.2 Pages have descriptive titles
- [ ] 2.4.3 Focus order is logical
- [ ] 2.4.4 Link text describes destination or purpose
- [ ] 2.4.5 Multiple ways to find pages (sitemap, search, nav)
- [ ] 2.4.6 Headings and labels are descriptive
- [ ] 2.4.7 Keyboard focus is visible
- [ ] 2.5.1 Complex gestures have simple alternatives
- [ ] 2.5.2 Touch targets can be cancelled before release
- [ ] 2.5.3 Visible label matches accessible name
- [ ] 2.5.4 Motion-activated functions have UI alternatives

**Understandable** (11 criteria):
- [ ] 3.1.1 Page language is set (lang attribute)
- [ ] 3.1.2 Language changes are marked (lang attribute)
- [ ] 3.2.1 Focus doesn't trigger unexpected changes
- [ ] 3.2.2 Input doesn't trigger unexpected changes
- [ ] 3.2.3 Navigation is consistent across pages
- [ ] 3.2.4 Components are consistently identified
- [ ] 3.3.1 Errors are identified and described in text
- [ ] 3.3.2 Labels or instructions provided for inputs
- [ ] 3.3.3 Error suggestions provided
- [ ] 3.3.4 Error prevention for legal/financial/data transactions

**Robust** (2 criteria):
- [ ] 4.1.1 Markup is valid (no duplicate IDs, proper nesting)
- [ ] 4.1.2 Custom components have name, role, value
- [ ] 4.1.3 Status messages use ARIA live regions

**Total**: 43 testable criteria (some combined above)

### COPPA Compliance Checklist

- [ ] Privacy policy is clear, prominent, comprehensive
- [ ] Verifiable Parental Consent (VPC) system implemented
- [ ] Age verification at signup
- [ ] Data minimization practices in place
- [ ] Secure data storage and transmission
- [ ] Parent portal for data access/deletion
- [ ] No behavioral advertising to children
- [ ] Third-party vendors signed DPAs
- [ ] Annual COPPA compliance audit scheduled
- [ ] Staff trained on COPPA requirements

### HIPAA Compliance Checklist

**Administrative Safeguards**:
- [ ] Risk assessment completed annually
- [ ] Security officer designated
- [ ] Workforce security policies documented
- [ ] Access authorization procedures
- [ ] Security awareness training (annual)
- [ ] Incident response plan
- [ ] Contingency/disaster recovery plan
- [ ] Business Associate Agreements (BAAs) with all vendors

**Physical Safeguards**:
- [ ] Facility access controls
- [ ] Workstation security policies
- [ ] Device and media controls (disposal, reuse)

**Technical Safeguards**:
- [ ] Unique user IDs
- [ ] Emergency access procedures
- [ ] Automatic logoff
- [ ] Encryption at rest (AES-256)
- [ ] Encryption in transit (TLS 1.2+)
- [ ] Audit logs (7-year retention)
- [ ] Integrity controls (checksums)

**Breach Notification**:
- [ ] Breach notification procedures documented
- [ ] 60-day notification timeline established
- [ ] HHS reporting process defined

---

## 📚 REFERENCES & RESOURCES

### Official Standards Documents
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [COPPA Rule](https://www.ftc.gov/enforcement/rules/rulemaking-regulatory-reform-proceedings/childrens-online-privacy-protection-rule)
- [HIPAA Resources](https://www.hhs.gov/hipaa/index.html)
- [GDPR Official Text](https://gdpr-info.eu/)
- [ISO 25010](https://www.iso.org/standard/78176.html)

### Autism & Accessibility Resources
- [ASAN Guidelines](https://autisticadvocacy.org/)
- [WebAIM Resources](https://webaim.org/)
- [A11y Project](https://www.a11yproject.com/)
- [Neurodiversity Design System](https://neurodiversitydesign.com/)

### Testing Tools
- [axe DevTools](https://www.deque.com/axe/devtools/)
- [WAVE](https://wave.webaim.org/)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)
- [Pa11y](https://pa11y.org/)

---

**Last Updated**: October 10, 2025
**Total Standards**: 15+ major frameworks
**Compliance Status**: Enterprise-grade, legally defensible
