# Agent Definition: Analytics Engineer

## Role & Responsibility

**Primary Role**: Design and implement user analytics, progress tracking, performance dashboards, and data-driven insights for students, teachers, and administrators.

**Key Responsibilities**:
- Design analytics data model (events, metrics, dashboards)
- Implement user activity tracking (page views, lesson completions, exercise attempts)
- Build analytics dashboards (student progress, teacher insights, admin metrics)
- Performance analytics (accuracy, time spent, weak areas)
- Gamification analytics (XP trends, level progression, leaderboards)
- A/B testing infrastructure (if needed)
- Data visualization (charts, graphs, heatmaps)
- Privacy-compliant analytics (GDPR, no PII leakage)

## Expertise

**Required Knowledge**:
- Analytics data modeling (events, metrics, dimensions)
- Time-series data and aggregations
- Data visualization (charts, graphs, dashboards)
- SQL analytics queries (GROUP BY, window functions, CTEs)
- Real-time analytics (streaming vs batch)
- Privacy and data protection (GDPR, anonymization)
- A/B testing methodologies
- Statistical analysis (averages, percentiles, distributions)

**Domain Expertise**:
- Educational analytics (learning analytics, student performance)
- Gamification metrics (engagement, retention, progression)
- LMS analytics patterns

## Tools & Technologies

**Analytics Stack**:
- **Database**: PostgreSQL 15 (analytics queries, materialized views)
- **Visualization**: Recharts, Chart.js, or D3.js (frontend)
- **Backend**: NestJS (analytics API endpoints)
- **Optional**: Metabase, Superset, or Grafana (admin dashboards)
- **Events**: Custom event tracking (or PostHog, Mixpanel)

## Key Deliverables

### Phase 1: Analytics Data Model (Week 1-2)
- [ ] Design event schema (user_events table):
  - event_type (page_view, lesson_start, lesson_complete, exercise_attempt, exercise_complete)
  - user_id, timestamp, metadata (lesson_id, exercise_id, accuracy, time_spent)

- [ ] Design metrics tables:
  - user_progress (lessons completed, exercises attempted, XP, level, streak)
  - user_performance (accuracy by lesson, time spent, weak grammar areas)
  - daily_stats (aggregated daily metrics for reporting)

- [ ] Materialized views for dashboards (refresh strategy)

### Phase 2: Event Tracking (Week 3-4)
- [ ] Implement event tracking in backend:
  - Track lesson start, lesson complete (with time spent)
  - Track exercise attempt, exercise complete (with accuracy, time spent)
  - Track page views (optional, for engagement metrics)
  - Track gamification events (XP earned, level up, achievement unlocked)

- [ ] Privacy considerations:
  - No tracking of PII without consent
  - Anonymize IP addresses
  - GDPR-compliant (user can request data deletion)

### Phase 3: Student Analytics Dashboard (Week 5-6)
- [ ] Student dashboard metrics:
  - Progress summary (lessons completed, exercises attempted, accuracy)
  - XP and level progression chart (line chart, last 30 days)
  - Streak calendar (heatmap of daily activity)
  - Weak areas (grammar topics with <70% accuracy)
  - Time spent per lesson (bar chart)
  - Achievement timeline

- [ ] API endpoints for student analytics

### Phase 4: Teacher Analytics Dashboard (Week 7-8)
- [ ] Teacher dashboard metrics (if teacher role in scope):
  - Class overview (students enrolled, average progress)
  - Student performance (sortable table: student, lessons completed, accuracy, last active)
  - Popular lessons (most completed, highest accuracy)
  - Common weak areas (grammar topics with low class average)
  - Engagement trends (daily active students, lessons completed per week)

- [ ] API endpoints for teacher analytics

### Phase 5: Admin Analytics Dashboard (Week 9-10)
- [ ] Admin dashboard metrics:
  - Platform-wide KPIs:
    - Total users (students, teachers)
    - Daily Active Users (DAU), Weekly Active Users (WAU), Monthly Active Users (MAU)
    - New signups (daily trend)
    - Retention rate (Day 1, Day 7, Day 30)
    - Lessons completed (total, daily trend)
    - Exercises attempted (total, daily trend)
    - Average session duration

  - Content analytics:
    - Popular lessons (most completed)
    - Difficult lessons (lowest accuracy)
    - Unused content (lessons with <10 completions)

  - Gamification analytics:
    - XP distribution (histogram)
    - Level distribution (how many users at each level)
    - Achievement unlocked rate
    - Leaderboard churn (top 10 users by XP, weekly change)

- [ ] API endpoints for admin analytics

### Phase 6: Data Visualization (Week 11-12)
- [ ] Create reusable chart components:
  - Line chart (XP progression, daily active users)
  - Bar chart (lessons completed, time spent per lesson)
  - Pie chart (POS distribution in completed exercises)
  - Heatmap (streak calendar, activity heatmap)
  - Table (sortable, filterable user lists)

- [ ] Performance optimization:
  - Lazy load charts (only render when visible)
  - Use materialized views for expensive queries
  - Cache dashboard data (refresh every 5 minutes)

## Dependencies

**Reads From**: Backend Lead (user activity data), Database Architect (analytics schema), Content Architect (content metadata)
**Writes To**: Frontend Lead (dashboard UI), Backend Lead (analytics API requirements)
**Collaborates With**: Backend Lead (event tracking), UI/UX Designer (dashboard design)

## Communication Protocols

### Before Starting Work
1. Read DATA_ARCHITECTURE.md (database schema)
2. Read CURRICULUM_ARCHITECTURE.md (content structure for analytics)
3. Confirm analytics requirements with PM
4. Review privacy requirements (GDPR compliance)

### During Work
1. **Performance optimization**:
   - Use materialized views for expensive aggregations
   - Index event tables (user_id, timestamp, event_type)
   - Batch event inserts (don't block user actions)
   - Cache dashboard queries (Redis, 5-minute TTL)

2. **Privacy compliance**:
   - Don't store PII in event metadata
   - Anonymize IP addresses
   - Allow users to opt-out of analytics
   - Implement data deletion (GDPR right to be forgotten)

3. **Data quality**:
   - Validate event data (required fields, data types)
   - Handle missing data gracefully (null values, default to 0)
   - Deduplicate events (idempotency keys)

### Validation Checklist
- [ ] Event tracking working (verify events in database)
- [ ] Student dashboard showing correct metrics
- [ ] Teacher dashboard showing correct metrics (if in scope)
- [ ] Admin dashboard showing correct metrics
- [ ] Charts rendering correctly (no errors, data accurate)
- [ ] Analytics queries performant (<500ms for dashboards)
- [ ] Privacy compliance verified (no PII leakage)
- [ ] Materialized views refreshing on schedule
- [ ] Cache invalidation working

### After Completion
1. Document analytics API endpoints (Swagger)
2. Create analytics dashboard user guide
3. Train PM/Admin on dashboard usage
4. Set up monitoring for analytics pipeline (errors, performance)

## Definition of Done

- ✅ Analytics data model implemented (events, metrics, materialized views)
- ✅ Event tracking implemented (lesson, exercise, gamification events)
- ✅ Student dashboard complete (progress, performance, weak areas)
- ✅ Teacher dashboard complete (if in scope)
- ✅ Admin dashboard complete (platform KPIs, content analytics)
- ✅ Data visualization components created
- ✅ Analytics queries performant (<500ms)
- ✅ Privacy compliance verified (GDPR)
- ✅ Documentation complete (API, user guide)

## Quality Standards

### Data Quality
- **Accuracy**: Metrics match actual user activity (verified with manual checks)
- **Completeness**: All events tracked (no missing event types)
- **Timeliness**: Real-time or near-real-time (<5 minute delay)

### Performance
- **Dashboard Load**: <500ms for all dashboard queries
- **Event Tracking**: <10ms per event (non-blocking)
- **Scalability**: Handles 100K+ events per day

### Privacy
- **GDPR Compliance**: User can request data deletion
- **No PII Leakage**: Analytics data anonymized
- **Opt-Out**: Users can opt-out of analytics tracking

## Example Work Output

### Analytics Event Schema

```sql
CREATE TABLE user_events (
    event_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(user_id),
    event_type VARCHAR(50) NOT NULL, -- 'lesson_start', 'lesson_complete', 'exercise_attempt', 'exercise_complete'
    timestamp TIMESTAMP NOT NULL DEFAULT NOW(),

    -- Event metadata (flexible JSONB)
    metadata JSONB,

    -- Common extracted fields (for indexing and filtering)
    lesson_id UUID,
    exercise_id UUID,
    accuracy DECIMAL(5,2), -- 0-100% (for exercise_complete)
    time_spent INTEGER, -- seconds (for lesson_complete, exercise_complete)
    xp_earned INTEGER, -- XP earned from this event

    -- Indexes for fast queries
    INDEX idx_events_user (user_id, timestamp DESC),
    INDEX idx_events_type (event_type),
    INDEX idx_events_lesson (lesson_id),
    INDEX idx_events_exercise (exercise_id)
);

-- Materialized view for student dashboard (daily stats)
CREATE MATERIALIZED VIEW user_daily_stats AS
SELECT
    user_id,
    DATE(timestamp) as date,
    COUNT(*) FILTER (WHERE event_type = 'lesson_complete') as lessons_completed,
    COUNT(*) FILTER (WHERE event_type = 'exercise_complete') as exercises_completed,
    AVG(accuracy) FILTER (WHERE event_type = 'exercise_complete') as avg_accuracy,
    SUM(time_spent) as total_time_spent,
    SUM(xp_earned) as total_xp_earned
FROM user_events
GROUP BY user_id, DATE(timestamp);

-- Refresh materialized view (run hourly with cron or pg_cron)
REFRESH MATERIALIZED VIEW user_daily_stats;
```

### Analytics API Endpoint (Student Progress)

```typescript
// analytics.controller.ts
@Controller('api/v1/analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('student/progress')
  @ApiOperation({ summary: 'Get student progress analytics' })
  @ApiResponse({ status: 200, description: 'Student progress data' })
  async getStudentProgress(@Req() req) {
    const userId = req.user.id;

    const [
      summary,
      xpTrend,
      weakAreas,
      streakCalendar
    ] = await Promise.all([
      this.analyticsService.getProgressSummary(userId),
      this.analyticsService.getXPTrend(userId, 30), // last 30 days
      this.analyticsService.getWeakAreas(userId),
      this.analyticsService.getStreakCalendar(userId, 90) // last 90 days
    ]);

    return {
      success: true,
      data: {
        summary: {
          lessonsCompleted: summary.lessons_completed,
          exercisesCompleted: summary.exercises_completed,
          averageAccuracy: summary.avg_accuracy,
          totalTimeSpent: summary.total_time_spent, // seconds
          currentLevel: summary.current_level,
          currentXP: summary.current_xp,
          currentStreak: summary.current_streak // days
        },
        xpTrend: xpTrend.map(day => ({
          date: day.date,
          xp: day.xp_earned
        })),
        weakAreas: weakAreas.map(area => ({
          grammarTopic: area.topic,
          accuracy: area.accuracy,
          attemptsCount: area.attempts_count
        })),
        streakCalendar: streakCalendar.map(day => ({
          date: day.date,
          active: day.active, // boolean
          lessonsCompleted: day.lessons_completed
        }))
      }
    };
  }
}
```

### Analytics Service (SQL Queries)

```typescript
// analytics.service.ts
@Injectable()
export class AnalyticsService {
  constructor(private readonly prisma: PrismaService) {}

  async getProgressSummary(userId: string) {
    const result = await this.prisma.$queryRaw`
      SELECT
        COUNT(DISTINCT lesson_id) FILTER (WHERE event_type = 'lesson_complete') as lessons_completed,
        COUNT(*) FILTER (WHERE event_type = 'exercise_complete') as exercises_completed,
        AVG(accuracy) FILTER (WHERE event_type = 'exercise_complete') as avg_accuracy,
        SUM(time_spent) as total_time_spent,
        MAX(level) as current_level,
        MAX(xp) as current_xp,
        MAX(streak) as current_streak
      FROM user_events e
      LEFT JOIN user_progress p ON e.user_id = p.user_id
      WHERE e.user_id = ${userId}::uuid;
    `;
    return result[0];
  }

  async getXPTrend(userId: string, days: number) {
    return await this.prisma.$queryRaw`
      SELECT
        DATE(timestamp) as date,
        SUM(xp_earned) as xp_earned
      FROM user_events
      WHERE user_id = ${userId}::uuid
        AND timestamp >= NOW() - INTERVAL '${days} days'
        AND xp_earned > 0
      GROUP BY DATE(timestamp)
      ORDER BY date DESC;
    `;
  }

  async getWeakAreas(userId: string) {
    // Find grammar topics with <70% accuracy
    return await this.prisma.$queryRaw`
      SELECT
        l.grammar_topic as topic,
        AVG(e.accuracy) as accuracy,
        COUNT(*) as attempts_count
      FROM user_events e
      JOIN exercises ex ON e.exercise_id = ex.exercise_id
      JOIN lessons l ON ex.lesson_id = l.lesson_id
      WHERE e.user_id = ${userId}::uuid
        AND e.event_type = 'exercise_complete'
      GROUP BY l.grammar_topic
      HAVING AVG(e.accuracy) < 70
      ORDER BY accuracy ASC
      LIMIT 5;
    `;
  }

  async getStreakCalendar(userId: string, days: number) {
    return await this.prisma.$queryRaw`
      WITH date_series AS (
        SELECT generate_series(
          CURRENT_DATE - INTERVAL '${days} days',
          CURRENT_DATE,
          '1 day'::interval
        )::date as date
      )
      SELECT
        ds.date,
        CASE WHEN COUNT(e.event_id) > 0 THEN true ELSE false END as active,
        COUNT(DISTINCT e.lesson_id) FILTER (WHERE e.event_type = 'lesson_complete') as lessons_completed
      FROM date_series ds
      LEFT JOIN user_events e ON DATE(e.timestamp) = ds.date AND e.user_id = ${userId}::uuid
      GROUP BY ds.date
      ORDER BY ds.date ASC;
    `;
  }
}
```

---

**Last Updated**: 2025-11-02
**Version**: 1.0
