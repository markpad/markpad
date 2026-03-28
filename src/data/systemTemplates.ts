import type { CreateTemplateInput, VariableSchema } from '@/lib/repositories'

/**
 * System templates that ship with Markpad.
 * These are seeded into IndexedDB on first load.
 */

const textVar = (label: string, defaultValue: string): VariableSchema => ({
  type: 'text',
  label,
  default: defaultValue,
})

const listVar = (label: string, defaultValue: string[]): VariableSchema => ({
  type: 'list',
  label,
  default: defaultValue,
})

export const systemTemplates: CreateTemplateInput[] = [
  {
    title: 'Blog Post',
    description: 'Medium/Substack-inspired clean article with author, date, and reading time.',
    category: 'writing',
    themeId: 'blog-post',
    isSystem: true,
    variablesSchema: {
      title: textVar('Title', 'The Art of Writing Clean Code'),
      author: textVar('Author', 'Sarah Chen'),
      date: textVar('Date', 'March 10, 2026'),
      readTime: textVar('Read Time', '5 min read'),
    },
    content: `---

title: The Art of Writing Clean Code
author: Sarah Chen
date: March 10, 2026
readTime: 5 min read

---

# {{title}}

_A reflection on craftsmanship in software engineering_

**By {{author}}** · {{date}} · {{readTime}}

## Why Clean Code Matters

Every developer has inherited a codebase that made them question their career choices. **Clean code** isn't just about aesthetics — it's about respect for your future self and your teammates.

### The Hidden Cost of Messy Code

1. Onboarding new developers takes weeks instead of days
2. Simple features require complex workarounds
3. Bug fixes introduce new bugs
4. Technical debt compounds like interest

> "Any fool can write code that a computer can understand. Good programmers write code that humans can understand."
> — Martin Fowler

## Principles That Stand the Test of Time

### 1. Meaningful Names

Variables, functions, and classes should **reveal their intent**. If a name requires a comment, the name should be changed.

### 2. Small Functions

Each function should do **one thing** and do it well. A good rule of thumb: if you can't describe what a function does without using "and," it's doing too much.

### 3. DRY, But Wisely

Don't Repeat Yourself is valuable, but **premature abstraction** is worse than duplication. Wait until you see the pattern three times before abstracting.

## Final Thoughts

Clean code is a journey, not a destination. Every pull request is an opportunity to leave the codebase a little better than you found it.

---

_What are your principles for writing clean code? Share your thoughts below._
`,
  },
  {
    title: 'Resume / CV',
    description: 'Professional resume with contact info, experience, and skills sections.',
    category: 'professional',
    themeId: 'resume-cv',
    isSystem: true,
    variablesSchema: {
      name: textVar('Full Name', 'John Developer'),
      title: textVar('Job Title', 'Senior Software Engineer'),
      location: textVar('Location', 'San Francisco, CA'),
      email: textVar('Email', 'john@example.com'),
      github: textVar('GitHub', 'github.com/johndeveloper'),
      certifications: listVar('Certifications', [
        'AWS Certified Solutions Architect',
        'Google Cloud Professional Developer',
        'Certified Kubernetes Administrator',
      ]),
    },
    content: `---

name: John Developer
title: Senior Software Engineer
location: San Francisco, CA
email: john@example.com
github: github.com/johndeveloper
certifications:
  - AWS Certified Solutions Architect
  - Google Cloud Professional Developer
  - Certified Kubernetes Administrator

---

# {{name}}

_{{title}}_ — {{location}}
[{{email}}](mailto:{{email}}) | [{{github}}](https://github.com)

## Experience

### Lead Frontend Engineer — TechCorp Inc.

_January 2022 — Present_

- Architected and led migration from legacy jQuery codebase to **React 18** with TypeScript
- Reduced bundle size by 45% through code splitting and lazy loading
- Mentored team of 5 junior developers with weekly code reviews

### Full Stack Developer — StartupXYZ

_March 2019 — December 2021_

- Built real-time collaboration features using **WebSocket** and **CRDT**
- Designed RESTful API serving 10K+ daily active users
- Implemented CI/CD pipeline reducing deployment time from hours to minutes

## Skills

| Category    | Technologies                           |
| ----------- | -------------------------------------- |
| Frontend    | React, TypeScript, Next.js, Tailwind   |
| Backend     | Node.js, Python, PostgreSQL, Redis     |
| DevOps      | Docker, Kubernetes, AWS, GitHub Actions |
| Testing     | Jest, Playwright, Cypress              |

## Certifications

{% for cert in certifications %}
- {{cert}}
{% endfor %}

## Education

### B.S. Computer Science — University of California, Berkeley

_2015 — 2019_ — GPA: 3.8/4.0
`,
  },
  {
    title: 'Academic Paper',
    description: 'Formal academic paper with abstract, sections, references, and citations.',
    category: 'academic',
    themeId: 'academic-paper',
    isSystem: true,
    variablesSchema: {
      title: textVar('Paper Title', 'The Impact of Typography on Reading Comprehension'),
      subtitle: textVar('Subtitle', 'A Systematic Review'),
      author: textVar('Author', 'Dr. Emily Richards'),
      institution: textVar('Institution', 'Stanford University'),
      department: textVar('Department', 'Department of Cognitive Science'),
      date: textVar('Date', 'March 2024'),
      keywords: textVar('Keywords', 'typography, reading, comprehension, digital media'),
    },
    content: `---

title: The Impact of Typography on Reading Comprehension
subtitle: A Systematic Review
author: Dr. Emily Richards
institution: Stanford University
department: Department of Cognitive Science
date: March 2024
keywords: typography, reading, comprehension, digital media

---

# {{title}}: {{subtitle}}

_{{author}}_
_{{institution}}, {{department}}_
_{{date}}_

**Keywords:** {{keywords}}

**Abstract**

This paper examines the relationship between typographic choices and reading comprehension across various digital platforms. Through a comprehensive analysis of existing literature, we identify key factors that influence readability and propose guidelines for optimal text presentation.

## Introduction

Typography plays a crucial role in how information is perceived and processed by readers. The selection of appropriate fonts, spacing, and layout can significantly impact comprehension and retention rates (Smith & Johnson, 2023).

### Research Questions

The present study addresses the following questions:

1. How does font selection affect reading speed?
2. What role does line spacing play in comprehension?
3. Are serif or sans-serif fonts more effective for digital reading?

## Literature Review

Previous research has established several key findings:

> "The choice of typeface is not merely aesthetic; it fundamentally shapes the reader's cognitive engagement with the text" (Williams, 2022, p. 45).

### Table 1: Summary of Key Studies

| Author         | Year | Sample Size | Key Finding                    |
| -------------- | ---- | ----------- | ------------------------------ |
| Johnson et al. | 2021 | n=450       | Serif fonts improved retention |
| Chen           | 2022 | n=320       | Line height affects speed      |
| Patel & Smith  | 2023 | n=275       | Contrast is critical           |

## Methodology

The systematic review followed PRISMA guidelines for transparent reporting.

## Discussion

The findings suggest that **optimal typography** requires careful consideration of multiple factors working in concert.

## References

See [full bibliography](https://example.com/references) for complete citations.
`,
  },
  {
    title: 'Meeting Notes',
    description: 'Structured meeting notes with attendees, agenda, and action items.',
    category: 'professional',
    themeId: 'minimalist',
    isSystem: true,
    variablesSchema: {
      meetingTitle: textVar('Meeting Title', 'Sprint Planning'),
      date: textVar('Date', 'March 15, 2026'),
      organizer: textVar('Organizer', 'Jane Smith'),
      attendees: listVar('Attendees', ['Jane Smith', 'John Doe', 'Alice Johnson']),
    },
    content: `---

meetingTitle: Sprint Planning
date: March 15, 2026
organizer: Jane Smith
attendees:
  - Jane Smith
  - John Doe
  - Alice Johnson

---

# {{meetingTitle}}

**Date:** {{date}} · **Organizer:** {{organizer}}

## Attendees

{% for person in attendees %}
- {{person}}
{% endfor %}

## Agenda

1. Review last sprint outcomes
2. Discuss blockers and dependencies
3. Plan next sprint priorities
4. Assign tasks and deadlines

## Discussion Notes

### Last Sprint Review

- Feature X was shipped on time
- Bug fix for login flow is still pending review
- Performance improvements showed 20% faster load times

### Blockers

- Waiting on design approval for the new dashboard
- API rate limits need to be addressed

## Action Items

| Task | Owner | Due Date |
| ---- | ----- | -------- |
| Review PR #234 | John Doe | March 17 |
| Update API docs | Alice Johnson | March 18 |
| Design review meeting | Jane Smith | March 16 |

## Next Meeting

**Date:** March 22, 2026 — Same time, same place.
`,
  },
  {
    title: 'Technical Documentation',
    description: 'API or library documentation with code examples and tables.',
    category: 'technical',
    themeId: 'technical-docs',
    isSystem: true,
    variablesSchema: {
      projectName: textVar('Project Name', 'MyAPI'),
      version: textVar('Version', '2.0.0'),
      baseUrl: textVar('Base URL', 'https://api.example.com/v2'),
    },
    content: `---

projectName: MyAPI
version: 2.0.0
baseUrl: https://api.example.com/v2

---

# {{projectName}} Documentation

> Version {{version}} · Base URL: \`{{baseUrl}}\`

## Getting Started

Install the SDK:

\`\`\`bash
npm install {{projectName}}-sdk
\`\`\`

Initialize the client:

\`\`\`typescript
import { createClient } from '{{projectName}}-sdk'

const client = createClient({
  baseUrl: '{{baseUrl}}',
  apiKey: process.env.API_KEY,
})
\`\`\`

## Authentication

All requests require an API key passed in the \`Authorization\` header:

\`\`\`
Authorization: Bearer YOUR_API_KEY
\`\`\`

## Endpoints

### GET /users

Returns a list of users.

| Parameter | Type   | Required | Description          |
| --------- | ------ | -------- | -------------------- |
| page      | number | No       | Page number (def: 1) |
| limit     | number | No       | Items per page (def: 20) |
| search    | string | No       | Search by name       |

**Response:**

\`\`\`json
{
  "data": [{ "id": 1, "name": "John", "email": "john@example.com" }],
  "total": 42,
  "page": 1
}
\`\`\`

### POST /users

Create a new user.

\`\`\`json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "role": "admin"
}
\`\`\`

## Error Handling

| Code | Meaning               |
| ---- | --------------------- |
| 400  | Bad Request           |
| 401  | Unauthorized          |
| 404  | Not Found             |
| 429  | Rate Limit Exceeded   |
| 500  | Internal Server Error |
`,
  },
  {
    title: 'Blank Document',
    description: 'A clean slate. Start writing from scratch.',
    category: 'general',
    themeId: 'standard-blue',
    isSystem: true,
    variablesSchema: {},
    content: `# Untitled Document

Start writing here...
`,
  },
]
