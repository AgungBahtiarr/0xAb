---
title: "Building My Developer Portfolio with Astro 7"
pubDate: "2026-07-05"
description: "A deep dive into how I built this ultra-minimal, high-performance portfolio site using Astro 7, Tailwind CSS v4, and dynamic content collections."
tags: ["astro", "tailwind", "webdev"]
draft: false
---
Welcome to my very first blog post! In this entry, I want to write about how I designed and implemented this portfolio site.

## Why Astro?

Astro is a modern web framework designed for building content-heavy websites. Its primary feature is "Zero JS by default" which compiles pages to static HTML, stripping out all JavaScript unless it is explicitly needed (using Islands).

## Design System

The design of this website is completely monochromatic (black and white only) with a single vibrant accent color: `#FFD93D`. This color was extracted directly from the brand logo.

```typescript
// A quick code snippet sample
const techStack = {
  framework: "Astro v7",
  styles: "Tailwind CSS v4",
  accentColor: "#FFD93D"
};
console.log(`Building with ${techStack.framework}`);
```

Stay tuned for more updates!
