# arQ - API SPECIFICATION

**Project:** arQ - Quranic Arabic Grammar Learning Management System
**Document Type:** Complete API Documentation
**Version:** 1.0 (API v1)
**Date:** 2025-11-02
**Base URL**: `https://api.arq.app/api/v1`
**Maintained By**: Backend Lead

---

## TABLE OF CONTENTS

1. [Overview](#1-overview)
2. [Authentication](#2-authentication)
3. [Common Patterns](#3-common-patterns)
4. [Authentication Endpoints](#4-authentication-endpoints)
5. [Curriculum Endpoints (Track A)](#5-curriculum-endpoints-track-a)
6. [Quranic Content Endpoints (Track B)](#6-quranic-content-endpoints-track-b)
7. [User Progress Endpoints](#7-user-progress-endpoints)
8. [Gamification Endpoints](#8-gamification-endpoints)
9. [Search Endpoints](#9-search-endpoints)
10. [Analytics Endpoints](#10-analytics-endpoints)
11. [Teacher/Classroom Endpoints](#11-teacherclassroom-endpoints)
12. [Error Codes](#12-error-codes)
13. [Rate Limiting](#13-rate-limiting)
14. [Webhooks](#14-webhooks)

---

## 1. OVERVIEW

### 1.1 API Design Principles

- **RESTful**: Resources accessed via standard HTTP methods (GET, POST, PUT, PATCH, DELETE)
- **JSON**: All requests and responses use JSON format
- **Versioned**: URL-based versioning (`/api/v1/`, `/api/v2/`)
- **Stateless**: JWT-based authentication (no server-side sessions)
- **HATEOAS**: Hypermedia links in responses (where applicable)
- **Consistent**: Uniform response structure across all endpoints

### 1.2 Base URLs

| Environment | Base URL | Purpose |
|-------------|----------|---------|
| **Production** | `https://api.arq.app/api/v1` | Live production API |
| **Staging** | `https://staging-api.arq.app/api/v1` | Pre-production testing |
| **Development** | `http://localhost:3001/api/v1` | Local development |

### 1.3 Content Types

**Request Headers**:
```
Content-Type: application/json
Accept: application/json
```

**Response Headers**:
```
Content-Type: application/json; charset=utf-8
```

### 1.4 HTTP Methods

| Method | Purpose | Idempotent | Safe |
|--------|---------|------------|------|
| **GET** | Retrieve resource(s) | ✅ Yes | ✅ Yes |
| **POST** | Create new resource | ❌ No | ❌ No |
| **PUT** | Replace entire resource | ✅ Yes | ❌ No |
| **PATCH** | Update partial resource | ❌ No | ❌ No |
| **DELETE** | Delete resource | ✅ Yes | ❌ No |

---

## 2. AUTHENTICATION

### 2.1 Authentication Methods

**Primary Method**: JWT (JSON Web Token)

**Token Types**:
1. **Access Token** - Short-lived (15 minutes), sent in Authorization header
2. **Refresh Token** - Long-lived (7 days), stored in HttpOnly cookie

### 2.2 Authorization Header

All protected endpoints require the `Authorization` header:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 2.3 JWT Payload Structure

```json
{
  "userId": "550e8400-e29b-41d4-a716-446655440000",
  "email": "user@example.com",
  "role": "student",
  "iat": 1699000000,
  "exp": 1699000900
}
```

### 2.4 Token Refresh Flow

```mermaid
sequenceDiagram
    participant Client
    participant API

    Client->>API: POST /auth/login<br/>{email, password}
    API-->>Client: {accessToken, refreshToken}

    Note over Client: Store accessToken in memory<br/>refreshToken in HttpOnly cookie

    Client->>API: GET /lessons<br/>Authorization: Bearer {accessToken}
    API-->>Client: 200 OK {lessons}

    Note over Client: Access token expires (15 min)

    Client->>API: GET /lessons<br/>Authorization: Bearer {expired}
    API-->>Client: 401 Token Expired

    Client->>API: POST /auth/refresh<br/>Cookie: refreshToken
    API-->>Client: {newAccessToken}

    Client->>API: GET /lessons<br/>Authorization: Bearer {newAccessToken}
    API-->>Client: 200 OK {lessons}
```

---

## 3. COMMON PATTERNS

### 3.1 Success Response Format

```json
{
  "success": true,
  "data": {
    // Response data here
  },
  "meta": {
    "timestamp": "2025-11-02T10:30:00Z",
    "requestId": "550e8400-e29b-41d4-a716-446655440000"
  }
}
```

### 3.2 Error Response Format

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": [
      {
        "field": "email",
        "message": "Invalid email format",
        "value": "invalid-email"
      }
    ]
  },
  "meta": {
    "timestamp": "2025-11-02T10:30:00Z",
    "requestId": "550e8400-e29b-41d4-a716-446655440000"
  }
}
```

### 3.3 Pagination

**Request Parameters**:
```
GET /api/v1/lessons?page=1&limit=20
```

**Response**:
```json
{
  "success": true,
  "data": [
    // Array of items
  ],
  "meta": {
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 150,
      "totalPages": 8,
      "hasNext": true,
      "hasPrev": false
    },
    "timestamp": "2025-11-02T10:30:00Z"
  }
}
```

**Cursor-Based Pagination** (for large datasets):
```
GET /api/v1/verses?cursor=eyJpZCI6IjEyMyJ9&limit=20
```

```json
{
  "success": true,
  "data": [],
  "meta": {
    "pagination": {
      "limit": 20,
      "nextCursor": "eyJpZCI6IjE0MyJ9",
      "hasNext": true
    }
  }
}
```

### 3.4 Filtering

```
GET /api/v1/words?pos=noun&gender=masculine&number=plural
```

### 3.5 Sorting

```
GET /api/v1/lessons?sort=createdAt:desc,title:asc
```

### 3.6 Field Selection (Sparse Fieldsets)

```
GET /api/v1/lessons?fields=id,title,stage
```

```json
{
  "data": [
    {
      "id": "123",
      "title": "Introduction to Nouns",
      "stage": 1
    }
  ]
}
```

---

## 4. AUTHENTICATION ENDPOINTS

### 4.1 Register

**Endpoint**: `POST /api/v1/auth/register`

**Description**: Create a new user account

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "name": "Ahmed Khan",
  "role": "student"
}
```

**Validation Rules**:
- `email`: Valid email format, unique
- `password`: Min 8 chars, 1 uppercase, 1 lowercase, 1 number
- `name`: 2-100 characters
- `role`: Enum ['student', 'teacher'] (admin only via backend)

**Success Response** (201 Created):
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "email": "user@example.com",
      "name": "Ahmed Khan",
      "role": "student",
      "createdAt": "2025-11-02T10:30:00Z"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "meta": {
    "timestamp": "2025-11-02T10:30:00Z"
  }
}
```

**Error Responses**:
- `400 Bad Request`: Validation error
- `409 Conflict`: Email already exists

---

### 4.2 Login

**Endpoint**: `POST /api/v1/auth/login`

**Description**: Authenticate user and receive tokens

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

**Success Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "email": "user@example.com",
      "name": "Ahmed Khan",
      "role": "student",
      "currentXP": 1250,
      "currentLevel": 3,
      "currentStreak": 7
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Response Headers**:
```
Set-Cookie: refreshToken=eyJhbG...; HttpOnly; Secure; SameSite=Strict; Max-Age=604800
```

**Error Responses**:
- `401 Unauthorized`: Invalid credentials
- `429 Too Many Requests`: Rate limit exceeded (10 attempts per hour)

---

### 4.3 Refresh Token

**Endpoint**: `POST /api/v1/auth/refresh`

**Description**: Get a new access token using refresh token

**Request Headers**:
```
Cookie: refreshToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Request Body**: None

**Success Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Responses**:
- `401 Unauthorized`: Invalid or expired refresh token
- `403 Forbidden`: Refresh token revoked

---

### 4.4 Logout

**Endpoint**: `POST /api/v1/auth/logout`

**Description**: Invalidate refresh token and logout user

**Request Headers**:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Cookie: refreshToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Success Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "message": "Logged out successfully"
  }
}
```

**Side Effects**:
- Refresh token removed from Redis
- `Set-Cookie` header clears refresh token cookie

---

### 4.5 Get Current User

**Endpoint**: `GET /api/v1/auth/me`

**Description**: Get current authenticated user details

**Request Headers**:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Success Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "email": "user@example.com",
      "name": "Ahmed Khan",
      "role": "student",
      "avatarUrl": "https://cdn.arq.app/avatars/user123.jpg",
      "currentXP": 1250,
      "currentLevel": 3,
      "currentStreak": 7,
      "lessonsCompleted": 25,
      "exercisesCompleted": 150,
      "createdAt": "2025-10-01T10:00:00Z",
      "lastActiveAt": "2025-11-02T10:30:00Z"
    }
  }
}
```

---

### 4.6 Forgot Password

**Endpoint**: `POST /api/v1/auth/forgot-password`

**Description**: Request password reset email

**Request Body**:
```json
{
  "email": "user@example.com"
}
```

**Success Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "message": "Password reset email sent if account exists"
  }
}
```

**Note**: Always returns success to prevent email enumeration attacks

**Side Effects**:
- If email exists, sends reset email with token valid for 1 hour
- Token stored in Redis: `password-reset:{token}` → `{userId}`

---

### 4.7 Reset Password

**Endpoint**: `POST /api/v1/auth/reset-password`

**Description**: Reset password using token from email

**Request Body**:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "newPassword": "NewSecurePass123!"
}
```

**Success Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "message": "Password reset successfully"
  }
}
```

**Error Responses**:
- `400 Bad Request`: Invalid or expired token
- `400 Bad Request`: Password doesn't meet requirements

---

## 5. CURRICULUM ENDPOINTS (TRACK A)

### 5.1 List Lessons

**Endpoint**: `GET /api/v1/lessons`

**Description**: Get paginated list of lessons with filters

**Query Parameters**:
| Parameter | Type | Required | Description | Example |
|-----------|------|----------|-------------|---------|
| `track` | String | No | Filter by track | `track=grammar` |
| `stage` | Integer | No | Filter by stage (1-5) | `stage=2` |
| `completed` | Boolean | No | Filter by completion status | `completed=true` |
| `page` | Integer | No | Page number (default: 1) | `page=2` |
| `limit` | Integer | No | Items per page (default: 20, max: 100) | `limit=50` |
| `sort` | String | No | Sort order | `sort=createdAt:desc` |

**Example Request**:
```
GET /api/v1/lessons?track=grammar&stage=2&completed=false&page=1&limit=20
```

**Success Response** (200 OK):
```json
{
  "success": true,
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "track": "grammar",
      "stage": 2,
      "titleArabic": "الاسم والفعل والحرف",
      "titleEnglish": "Noun, Verb, and Particle",
      "description": "Learn the three main parts of speech in Arabic",
      "difficulty": 2,
      "estimatedMinutes": 15,
      "isCompleted": false,
      "thumbnailUrl": "https://cdn.arq.app/lessons/lesson123.jpg",
      "createdAt": "2025-10-15T10:00:00Z",
      "exerciseCount": 5
    }
  ],
  "meta": {
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 50,
      "totalPages": 3,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

---

### 5.2 Get Lesson Details

**Endpoint**: `GET /api/v1/lessons/:id`

**Description**: Get complete lesson details including content and exercises

**Path Parameters**:
- `id` (UUID): Lesson ID

**Example Request**:
```
GET /api/v1/lessons/550e8400-e29b-41d4-a716-446655440000
```

**Success Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "lesson": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "track": "grammar",
      "stage": 2,
      "titleArabic": "الاسم والفعل والحرف",
      "titleEnglish": "Noun, Verb, and Particle",
      "description": "Learn the three main parts of speech in Arabic",
      "content": "# Introduction\n\nIn Arabic grammar, every word belongs to one of three categories...",
      "difficulty": 2,
      "estimatedMinutes": 15,
      "isCompleted": false,
      "completedAt": null,
      "thumbnailUrl": "https://cdn.arq.app/lessons/lesson123.jpg",
      "createdAt": "2025-10-15T10:00:00Z",
      "updatedAt": "2025-10-20T14:30:00Z",

      "exercises": [
        {
          "id": "ex-001",
          "type": "multiple_choice",
          "question": "What part of speech is الحمد?",
          "difficulty": 1,
          "xpReward": 10
        },
        {
          "id": "ex-002",
          "type": "fill_blank",
          "question": "Complete the sentence: ___ لله",
          "difficulty": 1,
          "xpReward": 10
        }
      ],

      "prerequisites": [
        {
          "id": "prereq-001",
          "title": "Arabic Alphabet",
          "isCompleted": true
        }
      ],

      "relatedVerses": [
        {
          "verseId": "verse-001",
          "surahNumber": 1,
          "verseNumber": 2,
          "arabicText": "ٱلْحَمْدُ لِلَّهِ رَبِّ ٱلْعَٰلَمِينَ",
          "relationship": "example_of"
        }
      ],

      "userProgress": {
        "status": "in_progress",
        "timeSpent": 450,
        "exercisesCompleted": 2,
        "exercisesTotal": 5,
        "lastAccessedAt": "2025-11-01T18:00:00Z"
      }
    }
  }
}
```

**Error Responses**:
- `404 Not Found`: Lesson does not exist

---

### 5.3 Mark Lesson as Complete

**Endpoint**: `POST /api/v1/lessons/:id/complete`

**Description**: Mark a lesson as completed and award XP

**Path Parameters**:
- `id` (UUID): Lesson ID

**Request Body**:
```json
{
  "timeSpentSeconds": 900
}
```

**Success Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "lessonCompletion": {
      "lessonId": "550e8400-e29b-41d4-a716-446655440000",
      "completedAt": "2025-11-02T10:30:00Z",
      "timeSpentSeconds": 900,
      "xpEarned": 50
    },
    "userProgress": {
      "currentXP": 1300,
      "previousXP": 1250,
      "currentLevel": 3,
      "leveledUp": false,
      "currentStreak": 7
    },
    "achievements": [
      {
        "id": "achievement-001",
        "name": "Grammar Novice",
        "description": "Complete 10 grammar lessons",
        "iconUrl": "https://cdn.arq.app/badges/grammar-novice.svg",
        "unlockedAt": "2025-11-02T10:30:00Z"
      }
    ]
  }
}
```

**Error Responses**:
- `404 Not Found`: Lesson does not exist
- `409 Conflict`: Lesson already completed

---

### 5.4 Get Exercise Details

**Endpoint**: `GET /api/v1/exercises/:id`

**Description**: Get exercise details with question and options

**Path Parameters**:
- `id` (UUID): Exercise ID

**Success Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "exercise": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "lessonId": "lesson-123",
      "type": "multiple_choice",
      "difficulty": 2,
      "xpReward": 15,

      "question": {
        "arabic": "ما نوع الكلمة: الْحَمْدُ؟",
        "english": "What part of speech is الْحَمْدُ (al-hamdu)?",
        "audioUrl": "https://cdn.arq.app/audio/question-001.mp3"
      },

      "options": [
        {
          "id": "opt-a",
          "textArabic": "اسم",
          "textEnglish": "Noun (اسم)"
        },
        {
          "id": "opt-b",
          "textArabic": "فعل",
          "textEnglish": "Verb (فعل)"
        },
        {
          "id": "opt-c",
          "textArabic": "حرف",
          "textEnglish": "Particle (حرف)"
        },
        {
          "id": "opt-d",
          "textArabic": "لا أعرف",
          "textEnglish": "I don't know"
        }
      ],

      "hint": "Look at the word's ending. Does it have a ضمة (damma)?",

      "metadata": {
        "attemptsAllowed": 3,
        "timeLimit": null,
        "showHintAfterAttempts": 1
      }
    }
  }
}
```

---

### 5.5 Submit Exercise Answer

**Endpoint**: `POST /api/v1/exercises/:id/submit`

**Description**: Submit exercise answer and receive feedback + XP

**Path Parameters**:
- `id` (UUID): Exercise ID

**Request Body** (Multiple Choice):
```json
{
  "answer": "opt-a",
  "timeSpentSeconds": 45
}
```

**Request Body** (Fill in the Blank):
```json
{
  "answer": "الحمد",
  "timeSpentSeconds": 60
}
```

**Request Body** (Drag and Drop):
```json
{
  "answer": {
    "pairs": [
      {"term": "اسم", "definition": "noun"},
      {"term": "فعل", "definition": "verb"}
    ]
  },
  "timeSpentSeconds": 90
}
```

**Success Response** (200 OK - Correct Answer):
```json
{
  "success": true,
  "data": {
    "result": {
      "isCorrect": true,
      "correctAnswer": "opt-a",
      "userAnswer": "opt-a",
      "accuracy": 100,
      "attemptNumber": 1,

      "feedback": {
        "title": "Excellent! ممتاز",
        "message": "الْحَمْدُ (al-hamdu) is a noun (اسم). You can recognize it as a noun because it names a concept (praise).",
        "explanation": "Nouns in Arabic often have the definite article ال (al-) and case endings like ضمة (damma) for nominative case.",
        "audioUrl": "https://cdn.arq.app/audio/feedback-correct-001.mp3"
      },

      "xpEarned": 15,
      "bonusXP": 5,
      "bonusReason": "Perfect score on first attempt",

      "nextExercise": {
        "id": "ex-002",
        "title": "Identify the Verb"
      }
    },

    "userProgress": {
      "currentXP": 1320,
      "previousXP": 1300,
      "currentLevel": 3,
      "leveledUp": false
    }
  }
}
```

**Success Response** (200 OK - Incorrect Answer):
```json
{
  "success": true,
  "data": {
    "result": {
      "isCorrect": false,
      "correctAnswer": "opt-a",
      "userAnswer": "opt-b",
      "accuracy": 0,
      "attemptNumber": 1,
      "attemptsRemaining": 2,

      "feedback": {
        "title": "Not quite right",
        "message": "الْحَمْدُ is not a verb (فعل). Verbs describe actions like 'to praise' (يَحْمَدُ).",
        "hint": "Think about what this word represents. Is it an action or a thing?",
        "encouragement": "Try again! You can do this.",
        "audioUrl": "https://cdn.arq.app/audio/feedback-incorrect-001.mp3"
      },

      "xpEarned": 0,

      "allowRetry": true,
      "showHint": true
    }
  }
}
```

**Error Responses**:
- `404 Not Found`: Exercise does not exist
- `400 Bad Request`: Invalid answer format
- `409 Conflict`: Exercise already completed (max attempts reached)

---

## 6. QURANIC CONTENT ENDPOINTS (TRACK B)

### 6.1 List Verses

**Endpoint**: `GET /api/v1/verses`

**Description**: Get paginated list of Quranic verses with filters

**Query Parameters**:
| Parameter | Type | Required | Description | Example |
|-----------|------|----------|-------------|---------|
| `surah` | Integer | No | Filter by Surah number (1-114) | `surah=1` |
| `verseNumber` | Integer | No | Filter by verse number | `verseNumber=2` |
| `page` | Integer | No | Page number (default: 1) | `page=1` |
| `limit` | Integer | No | Items per page (default: 20, max: 50) | `limit=10` |

**Example Request**:
```
GET /api/v1/verses?surah=1&limit=7
```

**Success Response** (200 OK):
```json
{
  "success": true,
  "data": [
    {
      "id": "verse-001",
      "surahNumber": 1,
      "surahNameArabic": "الفاتحة",
      "surahNameEnglish": "Al-Fatiha",
      "verseNumber": 1,
      "arabicText": "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ",
      "translation": "In the name of Allah, the Most Gracious, the Most Merciful",
      "transliteration": "Bismillahi ar-rahmani ar-rahim",
      "audioUrl": "https://audio.quran.com/001001.mp3",
      "wordCount": 4
    },
    {
      "id": "verse-002",
      "surahNumber": 1,
      "verseNumber": 2,
      "arabicText": "ٱلْحَمْدُ لِلَّهِ رَبِّ ٱلْعَٰلَمِينَ",
      "translation": "All praise is due to Allah, Lord of the worlds",
      "transliteration": "Alhamdu lillahi rabbi al-'alamin",
      "audioUrl": "https://audio.quran.com/001002.mp3",
      "wordCount": 4
    }
  ],
  "meta": {
    "pagination": {
      "page": 1,
      "limit": 7,
      "total": 7,
      "totalPages": 1
    }
  }
}
```

---

### 6.2 Get Verse Details

**Endpoint**: `GET /api/v1/verses/:id`

**Description**: Get complete verse details with word-by-word analysis

**Path Parameters**:
- `id` (UUID): Verse ID

**Query Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `includeWords` | Boolean | No | Include word-by-word breakdown (default: true) |
| `userStage` | Integer | No | User's learning stage for adaptive explanations (1-5) |

**Example Request**:
```
GET /api/v1/verses/verse-002?includeWords=true&userStage=2
```

**Success Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "verse": {
      "id": "verse-002",
      "surahNumber": 1,
      "surahNameArabic": "الفاتحة",
      "surahNameEnglish": "Al-Fatiha",
      "verseNumber": 2,
      "arabicText": "ٱلْحَمْدُ لِلَّهِ رَبِّ ٱلْعَٰلَمِينَ",
      "translation": "All praise is due to Allah, Lord of the worlds",
      "transliteration": "Alhamdu lillahi rabbi al-'alamin",
      "audioUrl": "https://audio.quran.com/001002.mp3",
      "wordCount": 4,

      "words": [
        {
          "id": "word-001",
          "position": 1,
          "arabicText": "ٱلْحَمْدُ",
          "translation": "the praise",
          "transliteration": "al-hamdu",
          "audioUrl": "https://audio.quran.com/001002_001.mp3",

          "grammar": {
            "posType": "noun",
            "posArabic": "اسم",
            "gender": "masculine",
            "genderArabic": "مذكر",
            "number": "singular",
            "numberArabic": "مفرد",
            "definiteness": "definite",
            "definitenessArabic": "معرفة",
            "irabCase": "nominative",
            "irabCaseArabic": "مرفوع",
            "caseSign": "damma",
            "caseSignArabic": "ضمة",
            "caseSignSymbol": "ُ",
            "structureType": "simple",
            "structureTypeArabic": "مفرد"
          },

          "explanation": {
            "beginner": "This is a NOUN (اسم). It means 'the praise'.",
            "elementary": "This noun is DEFINITE (starts with ال), MASCULINE, and SINGULAR. It's in the NOMINATIVE case because it's the subject.",
            "intermediate": "الْحَمْدُ is a مبتدأ (subject) in the nominative case (مرفوع). The case sign is ضمة (damma).",
            "advanced": "الْحَمْدُ: مبتدأ مرفوع وعلامة رفعه الضمة الظاهرة على آخره",
            "expert": "الْحَمْدُ: اسم معرفة بالألف واللام، مبتدأ مرفوع وعلامة رفعه الضمة الظاهرة على آخره، والخبر محذوف تقديره 'ثابت' أو 'واجب'"
          },

          "rootId": "root-h-m-d",
          "root": "ح م د",
          "pattern": "فَعْل",

          "relatedLessons": [
            {
              "lessonId": "lesson-101",
              "title": "Introduction to Nouns",
              "relationship": "explains_concept"
            },
            {
              "lessonId": "lesson-205",
              "title": "Nominative Case",
              "relationship": "explains_case"
            }
          ]
        },
        {
          "id": "word-002",
          "position": 2,
          "arabicText": "لِلَّهِ",
          "translation": "to Allah",
          "transliteration": "lillahi",
          "audioUrl": "https://audio.quran.com/001002_002.mp3",

          "grammar": {
            "posType": "particle",
            "posArabic": "حرف",
            "structureType": "prep_phrase",
            "structureTypeArabic": "جار ومجرور"
          },

          "components": [
            {
              "text": "لِ",
              "type": "preposition",
              "arabic": "حرف جر",
              "translation": "to/for"
            },
            {
              "text": "لَّهِ",
              "type": "noun",
              "arabic": "اسم مجرور",
              "translation": "Allah",
              "case": "genitive",
              "caseSign": "kasra"
            }
          ],

          "explanation": {
            "beginner": "This is a PREPOSITION + NOUN. It means 'to Allah'.",
            "elementary": "The preposition لِ (to/for) combines with اللَّهِ (Allah). The noun is in the GENITIVE case.",
            "intermediate": "جار ومجرور: لِ حرف جر، والله اسم الجلالة مجرور وعلامة جره الكسرة",
            "advanced": "لِلَّهِ: اللام حرف جر، والله اسم الجلالة مجرور باللام وعلامة جره الكسرة، والجار والمجرور متعلق بمحذوف خبر المبتدأ",
            "expert": "الجار والمجرور متعلق بمحذوف خبر المبتدأ، والتقدير: الحمد ثابت أو واجب لله"
          }
        }
      ],

      "grammaticalOverview": {
        "sentenceType": "nominal",
        "sentenceTypeArabic": "جملة اسمية",
        "subject": "الْحَمْدُ",
        "predicate": "لِلَّهِ",
        "syntacticAnalysis": "This is a nominal sentence (جملة اسمية) with the subject (مبتدأ) 'الْحَمْدُ' and the predicate (خبر) 'لِلَّهِ' in the form of a prepositional phrase."
      }
    }
  }
}
```

---

### 6.3 Get Word Grammatical Analysis

**Endpoint**: `GET /api/v1/words/:id/grammar`

**Description**: Get complete grammatical analysis for a single word (7 fields + 6 layers)

**Path Parameters**:
- `id` (UUID): Word ID

**Query Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `userStage` | Integer | No | User's learning stage (1-5, default: 1) |

**Example Request**:
```
GET /api/v1/words/word-001/grammar?userStage=3
```

**Success Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "word": {
      "id": "word-001",
      "arabicText": "ٱلْحَمْدُ",
      "translation": "the praise",
      "transliteration": "al-hamdu",

      "sevenFields": {
        "posType": "noun",
        "posArabic": "اسم",
        "gender": "masculine",
        "genderArabic": "مذكر",
        "number": "singular",
        "numberArabic": "مفرد",
        "definiteness": "definite",
        "definitenessArabic": "معرفة",
        "irabCase": "nominative",
        "irabCaseArabic": "مرفوع",
        "caseSign": "damma",
        "caseSignArabic": "ضمة",
        "caseSignSymbol": "ُ",
        "structureType": "simple",
        "structureTypeArabic": "مفرد"
      },

      "sixLayers": {
        "layer0_surface": {
          "text": "ٱلْحَمْدُ",
          "translation": "the praise",
          "transliteration": "al-hamdu",
          "audioUrl": "https://audio.quran.com/001002_001.mp3",
          "accessibleFromStage": 0
        },

        "layer1_basic": {
          "posType": "noun",
          "posExplanation": "This is a NOUN (اسم). A noun is a word that names something.",
          "accessibleFromStage": 1,
          "isAccessible": true
        },

        "layer2_properties": {
          "gender": "masculine",
          "number": "singular",
          "definiteness": "definite",
          "explanation": "This noun is DEFINITE (starts with ال), MASCULINE, and SINGULAR.",
          "accessibleFromStage": 2,
          "isAccessible": true
        },

        "layer3_case": {
          "irabCase": "nominative",
          "irabCaseArabic": "مرفوع",
          "caseSign": "damma",
          "caseSignSymbol": "ُ",
          "caseExplanation": "مرفوع (nominative) because it's the subject. The sign is ضمة (damma).",
          "fullIrab": "مبتدأ مرفوع وعلامة رفعه الضمة الظاهرة على آخره",
          "accessibleFromStage": 3,
          "isAccessible": true
        },

        "layer4_morphology": {
          "root": "ح م د",
          "pattern": "فَعْل",
          "lemma": "حَمْد",
          "letterBreakdown": [
            {"letter": "ا", "type": "definite_article", "name": "alif al-ta'rif"},
            {"letter": "ل", "type": "definite_article_sun", "name": "lam"},
            {"letter": "ح", "type": "root_letter_1", "name": "ha"},
            {"letter": "م", "type": "root_letter_2", "name": "mim"},
            {"letter": "د", "type": "root_letter_3", "name": "dal"},
            {"letter": "ُ", "type": "case_marker", "name": "damma"}
          ],
          "derivation": "Verbal noun (مصدر) derived from the root ح م د meaning 'to praise'",
          "accessibleFromStage": 4,
          "isAccessible": false
        },

        "layer5_syntax": {
          "syntacticRole": "subject",
          "arabicTerm": "مبتدأ",
          "dependencies": [
            {
              "type": "predicate",
              "wordId": "word-002",
              "text": "لِلَّهِ",
              "relationship": "خبر"
            }
          ],
          "sentencePosition": "beginning",
          "accessibleFromStage": 5,
          "isAccessible": false
        },

        "layer6_advanced": {
          "scholarlyNotes": [
            "Classical grammarians note that the predicate (خبر) is implicit here, with the prepositional phrase 'لِلَّهِ' functioning as the خبر.",
            "Some scholars interpret the implicit predicate as 'ثابت' (established) or 'واجب' (obligatory)."
          ],
          "rhetoric": "This word is placed first for emphasis (تقديم), highlighting that ALL praise belongs to Allah alone.",
          "taftazani": "التقديم هنا للحصر والاختصاص",
          "tafsirReferences": [
            {"source": "Tabari", "volume": "1", "page": "45"},
            {"source": "Ibn Kathir", "volume": "1", "page": "23"}
          ],
          "accessibleFromStage": 5,
          "isAccessible": false
        }
      },

      "userStage": 3,
      "accessibleLayers": [0, 1, 2, 3]
    }
  }
}
```

---

### 6.4 List Surahs

**Endpoint**: `GET /api/v1/surahs`

**Description**: Get list of all 114 Surahs

**Success Response** (200 OK):
```json
{
  "success": true,
  "data": [
    {
      "number": 1,
      "nameArabic": "الفاتحة",
      "nameEnglish": "Al-Fatiha",
      "nameTransliteration": "Al-Fatihah",
      "meaning": "The Opening",
      "revelationType": "meccan",
      "verseCount": 7,
      "orderInRevelation": 5
    },
    {
      "number": 2,
      "nameArabic": "البقرة",
      "nameEnglish": "Al-Baqarah",
      "nameTransliteration": "Al-Baqarah",
      "meaning": "The Cow",
      "revelationType": "medinan",
      "verseCount": 286,
      "orderInRevelation": 87
    }
  ]
}
```

---

### 6.5 Get Arabic Root Details

**Endpoint**: `GET /api/v1/roots/:id`

**Description**: Get root details and all words derived from this root

**Path Parameters**:
- `id` (UUID): Root ID

**Example Request**:
```
GET /api/v1/roots/root-h-m-d
```

**Success Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "root": {
      "id": "root-h-m-d",
      "letters": "ح م د",
      "transliteration": "h-m-d",
      "meaning": "to praise, to thank, to commend",
      "etymology": "Root meaning praise and gratitude",

      "words": [
        {
          "wordId": "word-001",
          "text": "ٱلْحَمْدُ",
          "translation": "the praise",
          "verseId": "verse-002",
          "surah": 1,
          "verse": 2,
          "occurrenceNumber": 1
        },
        {
          "wordId": "word-123",
          "text": "حَمِيدٌ",
          "translation": "Praiseworthy",
          "verseId": "verse-456",
          "surah": 2,
          "verse": 267,
          "occurrenceNumber": 2
        }
      ],

      "totalOccurrences": 68,
      "uniqueForms": 12,

      "relatedRoots": [
        {
          "rootId": "root-sh-k-r",
          "letters": "ش ك ر",
          "meaning": "to thank",
          "relationship": "synonym"
        }
      ]
    }
  }
}
```

---

## 7. USER PROGRESS ENDPOINTS

### 7.1 Get User Progress Summary

**Endpoint**: `GET /api/v1/users/:id/progress`

**Description**: Get comprehensive progress summary for a user

**Path Parameters**:
- `id` (UUID): User ID (use "me" for current user)

**Example Request**:
```
GET /api/v1/users/me/progress
```

**Success Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "progress": {
      "userId": "550e8400-e29b-41d4-a716-446655440000",
      "currentXP": 1250,
      "currentLevel": 3,
      "xpForNextLevel": 1500,
      "xpProgress": 83.3,
      "currentStreak": 7,
      "longestStreak": 15,
      "totalTimeSpent": 18000,

      "lessons": {
        "total": 250,
        "completed": 25,
        "inProgress": 3,
        "completionRate": 10
      },

      "exercises": {
        "total": 500,
        "completed": 150,
        "averageAccuracy": 78.5,
        "perfectScores": 45
      },

      "trackProgress": {
        "grammar": {
          "stage": 2,
          "lessonsCompleted": 15,
          "lessonsTotal": 50,
          "progress": 30
        },
        "verse": {
          "versesStudied": 150,
          "wordsAnalyzed": 600,
          "surahsCompleted": 1
        }
      },

      "recentActivity": [
        {
          "type": "lesson_completed",
          "lessonId": "lesson-123",
          "lessonTitle": "Noun Properties",
          "timestamp": "2025-11-02T10:00:00Z",
          "xpEarned": 50
        },
        {
          "type": "exercise_completed",
          "exerciseId": "ex-456",
          "accuracy": 100,
          "timestamp": "2025-11-02T10:15:00Z",
          "xpEarned": 20
        }
      ],

      "weakAreas": [
        {
          "topic": "Verb Conjugation",
          "accuracy": 45,
          "attemptsCount": 20,
          "recommendation": "Review lesson 3.2: Present Tense Verbs"
        },
        {
          "topic": "Genitive Case",
          "accuracy": 58,
          "attemptsCount": 15,
          "recommendation": "Practice more exercises on Idafa constructions"
        }
      ]
    }
  }
}
```

---

### 7.2 Get User Achievements

**Endpoint**: `GET /api/v1/users/:id/achievements`

**Description**: Get all achievements earned by user

**Path Parameters**:
- `id` (UUID): User ID (use "me" for current user)

**Success Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "achievements": {
      "unlocked": [
        {
          "id": "ach-001",
          "name": "First Steps",
          "description": "Complete your first lesson",
          "iconUrl": "https://cdn.arq.app/badges/first-steps.svg",
          "category": "milestone",
          "xpReward": 50,
          "unlockedAt": "2025-10-15T10:00:00Z",
          "rarity": "common"
        },
        {
          "id": "ach-002",
          "name": "Grammar Novice",
          "description": "Complete 10 grammar lessons",
          "iconUrl": "https://cdn.arq.app/badges/grammar-novice.svg",
          "category": "progress",
          "xpReward": 100,
          "unlockedAt": "2025-11-01T14:30:00Z",
          "rarity": "uncommon"
        },
        {
          "id": "ach-007",
          "name": "Week Warrior",
          "description": "Maintain a 7-day streak",
          "iconUrl": "https://cdn.arq.app/badges/week-warrior.svg",
          "category": "streak",
          "xpReward": 200,
          "unlockedAt": "2025-11-02T10:00:00Z",
          "rarity": "rare"
        }
      ],

      "locked": [
        {
          "id": "ach-003",
          "name": "Grammar Master",
          "description": "Complete 50 grammar lessons",
          "iconUrl": "https://cdn.arq.app/badges/grammar-master-locked.svg",
          "category": "progress",
          "xpReward": 500,
          "progress": 25,
          "progressTotal": 50,
          "rarity": "epic"
        }
      ],

      "statistics": {
        "totalUnlocked": 8,
        "totalAvailable": 50,
        "completionRate": 16,
        "totalXPFromAchievements": 800
      }
    }
  }
}
```

---

### 7.3 Get User Streak

**Endpoint**: `GET /api/v1/users/:id/streak`

**Description**: Get detailed streak information

**Path Parameters**:
- `id` (UUID): User ID (use "me" for current user)

**Success Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "streak": {
      "currentStreak": 7,
      "longestStreak": 15,
      "isActiveToday": true,
      "lastActivityDate": "2025-11-02",

      "streakHistory": [
        {"date": "2025-10-27", "active": true, "lessonsCompleted": 2},
        {"date": "2025-10-28", "active": true, "lessonsCompleted": 1},
        {"date": "2025-10-29", "active": true, "lessonsCompleted": 3},
        {"date": "2025-10-30", "active": true, "lessonsCompleted": 1},
        {"date": "2025-10-31", "active": true, "lessonsCompleted": 2},
        {"date": "2025-11-01", "active": true, "lessonsCompleted": 1},
        {"date": "2025-11-02", "active": true, "lessonsCompleted": 2}
      ],

      "nextMilestone": {
        "days": 14,
        "reward": "Achievement: Two-Week Warrior",
        "xpReward": 300
      },

      "streakSaverAvailable": true,
      "streakSaverCount": 1
    }
  }
}
```

---

## 8. GAMIFICATION ENDPOINTS

### 8.1 Get Leaderboard

**Endpoint**: `GET /api/v1/leaderboard`

**Description**: Get leaderboard rankings

**Query Parameters**:
| Parameter | Type | Required | Description | Values |
|-----------|------|----------|-------------|--------|
| `scope` | String | No | Leaderboard scope (default: global) | `global`, `class` |
| `period` | String | No | Time period (default: all_time) | `daily`, `weekly`, `monthly`, `all_time` |
| `classId` | UUID | No | Class ID (required if scope=class) | UUID |
| `limit` | Integer | No | Number of entries (default: 100, max: 100) | 1-100 |

**Example Request**:
```
GET /api/v1/leaderboard?scope=global&period=weekly&limit=10
```

**Success Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "leaderboard": {
      "scope": "global",
      "period": "weekly",
      "startDate": "2025-10-27",
      "endDate": "2025-11-02",

      "entries": [
        {
          "rank": 1,
          "userId": "user-001",
          "name": "Ahmed Khan",
          "avatarUrl": "https://cdn.arq.app/avatars/user001.jpg",
          "totalXP": 850,
          "level": 4,
          "badgeCount": 12,
          "isCurrentUser": false
        },
        {
          "rank": 2,
          "userId": "user-002",
          "name": "Fatima Ali",
          "avatarUrl": "https://cdn.arq.app/avatars/user002.jpg",
          "totalXP": 820,
          "level": 4,
          "badgeCount": 10,
          "isCurrentUser": false
        },
        {
          "rank": 5,
          "userId": "550e8400-e29b-41d4-a716-446655440000",
          "name": "You",
          "avatarUrl": "https://cdn.arq.app/avatars/user123.jpg",
          "totalXP": 750,
          "level": 3,
          "badgeCount": 8,
          "isCurrentUser": true
        }
      ],

      "currentUserEntry": {
        "rank": 5,
        "totalXP": 750,
        "xpGapToNext": 70,
        "percentile": 95
      }
    }
  }
}
```

---

## 9. SEARCH ENDPOINTS

### 9.1 Search Verses

**Endpoint**: `GET /api/v1/search/verses`

**Description**: Search Quranic verses with advanced grammatical filters

**Query Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `q` | String | Yes | Search query (Arabic or English) |
| `pos` | String | No | Filter by POS type |
| `gender` | String | No | Filter by gender |
| `number` | String | No | Filter by number |
| `case` | String | No | Filter by grammatical case |
| `page` | Integer | No | Page number (default: 1) |
| `limit` | Integer | No | Results per page (default: 20, max: 50) |

**Example Request**:
```
GET /api/v1/search/verses?q=الحمد&pos=noun&gender=masculine&limit=10
```

**Success Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "results": [
      {
        "verseId": "verse-002",
        "surah": 1,
        "verse": 2,
        "arabicText": "ٱلْحَمْدُ لِلَّهِ رَبِّ ٱلْعَٰلَمِينَ",
        "translation": "All praise is due to Allah, Lord of the worlds",
        "matchedWords": [
          {
            "wordId": "word-001",
            "text": "ٱلْحَمْدُ",
            "position": 1,
            "matchReason": "POS match: noun, Gender match: masculine"
          }
        ],
        "relevanceScore": 0.95
      }
    ],

    "facets": {
      "posTypes": [
        {"value": "noun", "count": 45},
        {"value": "verb", "count": 12},
        {"value": "particle", "count": 8}
      ],
      "genders": [
        {"value": "masculine", "count": 38},
        {"value": "feminine", "count": 7}
      ]
    }
  },
  "meta": {
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 65,
      "totalPages": 7
    },
    "searchQuery": "الحمد",
    "filters": {
      "pos": "noun",
      "gender": "masculine"
    },
    "executionTime": 45
  }
}
```

---

### 9.2 Autocomplete

**Endpoint**: `GET /api/v1/search/autocomplete`

**Description**: Get autocomplete suggestions for search

**Query Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `q` | String | Yes | Partial query (min 2 characters) |
| `limit` | Integer | No | Max suggestions (default: 10, max: 20) |

**Example Request**:
```
GET /api/v1/search/autocomplete?q=الح&limit=5
```

**Success Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "suggestions": [
      {
        "text": "الحمد",
        "type": "word",
        "frequency": 68,
        "translation": "the praise"
      },
      {
        "text": "الحكيم",
        "type": "word",
        "frequency": 45,
        "translation": "the Wise"
      },
      {
        "text": "الحق",
        "type": "word",
        "frequency": 38,
        "translation": "the truth"
      }
    ]
  }
}
```

---

## 10. ANALYTICS ENDPOINTS

### 10.1 Student Progress Analytics

**Endpoint**: `GET /api/v1/analytics/student/progress`

**Description**: Get detailed progress analytics for student dashboard

**Request Headers**:
```
Authorization: Bearer {accessToken}
```

**Query Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `period` | String | No | Time period (default: 30d) | Values: `7d`, `30d`, `90d`, `all` |

**Example Request**:
```
GET /api/v1/analytics/student/progress?period=30d
```

**Success Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "analytics": {
      "period": "30d",
      "startDate": "2025-10-03",
      "endDate": "2025-11-02",

      "xpTrend": [
        {"date": "2025-10-03", "xp": 50},
        {"date": "2025-10-04", "xp": 75},
        {"date": "2025-10-05", "xp": 100}
        // ... 30 days
      ],

      "activityHeatmap": [
        {"date": "2025-10-03", "lessonsCompleted": 2, "timeSpent": 1800},
        {"date": "2025-10-04", "lessonsCompleted": 1, "timeSpent": 900}
        // ... 30 days
      ],

      "performance": {
        "averageAccuracy": 78.5,
        "accuracyTrend": [
          {"week": "2025-W40", "accuracy": 75},
          {"week": "2025-W41", "accuracy": 78},
          {"week": "2025-W42", "accuracy": 82}
        ],
        "exercisesByType": [
          {"type": "multiple_choice", "completed": 45, "accuracy": 85},
          {"type": "fill_blank", "completed": 30, "accuracy": 70},
          {"type": "drag_drop", "completed": 25, "accuracy": 75}
        ]
      },

      "streakCalendar": [
        {"date": "2025-10-03", "active": true},
        {"date": "2025-10-04", "active": true},
        {"date": "2025-10-05", "active": false}
        // ... 30 days (for heatmap visualization)
      ]
    }
  }
}
```

---

## 11. TEACHER/CLASSROOM ENDPOINTS

### 11.1 Create Classroom

**Endpoint**: `POST /api/v1/classrooms`

**Description**: Create a new classroom (teacher only)

**Request Body**:
```json
{
  "name": "Beginner Arabic Grammar - Fall 2025",
  "description": "Introduction to Quranic Arabic grammar for beginners",
  "maxStudents": 30,
  "startDate": "2025-11-01",
  "endDate": "2026-02-01"
}
```

**Success Response** (201 Created):
```json
{
  "success": true,
  "data": {
    "classroom": {
      "id": "class-001",
      "name": "Beginner Arabic Grammar - Fall 2025",
      "description": "Introduction to Quranic Arabic grammar for beginners",
      "teacherId": "550e8400-e29b-41d4-a716-446655440000",
      "teacherName": "Prof. Ahmed Khan",
      "maxStudents": 30,
      "currentStudents": 0,
      "startDate": "2025-11-01",
      "endDate": "2026-02-01",
      "inviteCode": "ARQ-BEG-2025",
      "createdAt": "2025-11-02T10:30:00Z"
    }
  }
}
```

---

## 12. ERROR CODES

### 12.1 HTTP Status Codes

| Code | Name | Usage |
|------|------|-------|
| **200** | OK | Successful GET, PUT, PATCH, DELETE |
| **201** | Created | Successful POST (resource created) |
| **204** | No Content | Successful DELETE (no response body) |
| **400** | Bad Request | Invalid request format or validation error |
| **401** | Unauthorized | Missing or invalid authentication token |
| **403** | Forbidden | Authenticated but not authorized |
| **404** | Not Found | Resource does not exist |
| **409** | Conflict | Resource conflict (e.g., duplicate email) |
| **422** | Unprocessable Entity | Validation error (semantic) |
| **429** | Too Many Requests | Rate limit exceeded |
| **500** | Internal Server Error | Server error |
| **503** | Service Unavailable | Server overloaded or maintenance |

### 12.2 Error Code Reference

| Error Code | HTTP Status | Description | Solution |
|------------|-------------|-------------|----------|
| `VALIDATION_ERROR` | 400 | Request validation failed | Check request body/params |
| `INVALID_CREDENTIALS` | 401 | Login failed | Verify email and password |
| `TOKEN_EXPIRED` | 401 | Access token expired | Refresh token |
| `TOKEN_INVALID` | 401 | Malformed or invalid token | Re-authenticate |
| `FORBIDDEN` | 403 | Insufficient permissions | Check user role |
| `RESOURCE_NOT_FOUND` | 404 | Resource doesn't exist | Verify resource ID |
| `EMAIL_EXISTS` | 409 | Email already registered | Use different email |
| `LESSON_ALREADY_COMPLETED` | 409 | Lesson already marked complete | Skip completion |
| `RATE_LIMIT_EXCEEDED` | 429 | Too many requests | Wait and retry |
| `INTERNAL_ERROR` | 500 | Unexpected server error | Contact support |

---

## 13. RATE LIMITING

### 13.1 Rate Limit Headers

**Response Headers**:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1699900800
```

### 13.2 Rate Limits by Endpoint

| Endpoint Type | Limit | Window | Applies To |
|---------------|-------|--------|------------|
| **Public** | 10 req | 1 min | Unauthenticated users (by IP) |
| **Authenticated** | 100 req | 1 min | Authenticated users |
| **Search** | 30 req | 1 min | Search endpoints |
| **Login** | 10 req | 1 hour | Login attempts (by email) |
| **File Upload** | 5 req | 1 min | File uploads |

### 13.3 Rate Limit Exceeded Response

```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Too many requests. Please try again in 60 seconds.",
    "retryAfter": 60
  },
  "meta": {
    "timestamp": "2025-11-02T10:30:00Z"
  }
}
```

---

## 14. WEBHOOKS

### 14.1 Webhook Events

**Available Events**:
- `user.registered` - New user registration
- `lesson.completed` - User completes lesson
- `achievement.unlocked` - User unlocks achievement
- `streak.milestone` - User reaches streak milestone (7, 14, 30, 100 days)

### 14.2 Webhook Payload

**Example**: `lesson.completed` event

```json
{
  "event": "lesson.completed",
  "timestamp": "2025-11-02T10:30:00Z",
  "data": {
    "userId": "550e8400-e29b-41d4-a716-446655440000",
    "lessonId": "lesson-123",
    "lessonTitle": "Noun Properties",
    "xpEarned": 50,
    "completedAt": "2025-11-02T10:30:00Z"
  }
}
```

---

## CONCLUSION

This API specification provides a complete reference for all endpoints in the arQ platform. All endpoints follow RESTful principles, use JSON format, and include comprehensive error handling.

**For Implementation**:
- Backend Lead: Use this as implementation guide for NestJS controllers
- Frontend Lead: Use for API integration in Next.js
- Mobile Lead: Use for React Native API client
- QA Lead: Use for API testing scenarios

**Version**: 1.0 (API v1)
**Last Updated**: 2025-11-02
**Maintained By**: Backend Lead
**Review Cycle**: Updated with each API change

---

**Related Documents**:
- SOLUTION_ARCHITECTURE.md (system architecture)
- AGENT_OS_PROJECT_DEFINITION.md (team structure)
- WORD_LEVEL_ANALYSIS_SPECIFICATION.md (7 grammatical fields)
- HIERARCHICAL_GRAMMAR_COMPONENT_DESIGN.md (6-layer hierarchy)

---

**END OF API SPECIFICATION**
