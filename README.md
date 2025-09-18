# Portfolio Content Guide

This site is a static HTML/CSS/JS portfolio. The layout and styling remain fixed. All editable content lives in a single JSON file and is injected at runtime by JavaScript.

## Update Content Only (No Layout Changes)
- Edit `assets/data/content.json`.
- Push your changes; GitHub Pages will serve the updated content.

### Fields
- `profile`: name, title, passion, photo, resume, links
- `about`: professional (HTML allowed), personal (plain text), education (HTML allowed)
- `experience[]`: role, company, period, bullets[] (HTML allowed), tags
- `skills`: core (string), tags[] (strings)
- `projects[]`: name, description, stack[] (strings), url

### Example
```json
{
  "profile": { "name": "Chaitanya Dasari", "title": "Sr. Data Scientist" },
  "about": { "professional": "<strong>Senior Data Scientist</strong>..." },
  "experience": [
    { "role": "Senior Data Scientist", "company": "Piper Sandler", "period": "Apr 2024 – Present", "bullets": ["Delivered X"] }
  ],
  "skills": { "core": "Python · SQL ...", "tags": ["PyTorch", "Databricks"] },
  "projects": [ { "name": "ChatGPT NLP Analyzer", "url": "https://..." } ]
}
```

## Notes
- The script only updates text/content; it does not change the HTML structure or CSS.
- After adding many new list items, animations are refreshed automatically.
- If you add images, place them under `assets/picture/` and reference them via relative paths in JSON.
