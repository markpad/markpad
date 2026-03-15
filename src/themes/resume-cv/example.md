---

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

### Senior Developer — StartupXYZ

_March 2019 — December 2021_

- Built real-time collaboration features using WebSockets
- Implemented CI/CD pipeline reducing deploy time by 60%
- Contributed to open-source design system with _200+ GitHub stars_

## Skills

| Category  | Technologies                          |
| --------- | ------------------------------------- |
| Languages | TypeScript, JavaScript, Python, Go    |
| Frontend  | React, Next.js, Vue, Tailwind CSS     |
| Backend   | Node.js, Express, GraphQL, PostgreSQL |
| Tools     | Git, Docker, AWS, GitHub Actions      |

## Education

### M.S. Computer Science — Stanford University

_2017 — 2019_

> Focus: Human-Computer Interaction and Distributed Systems

### B.S. Computer Science — UC Berkeley

_2013 — 2017_

```
Awards: Dean's List (6 semesters), ACM Programming Contest Finalist
```

### Certifications

{% for cert in certifications %}

- {{cert}}
  {% endfor %}

![Professional headshot](https://picsum.photos/600/300?random=31)