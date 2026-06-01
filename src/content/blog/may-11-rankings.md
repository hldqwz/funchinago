---
title: "Vision Models Are Quietly Taking Over — Look at the Rankings"
date: 2026-05-11
description: "Models that can see images are climbing faster than text-only models. The ranking data shows a shift that most people haven't noticed yet."
tags: ["rankings", "weekly", "analysis", "multimodal"]
locale: "en"
---

Here's something I noticed this week while updating the site: I added multimodal labels to every model in the table. The pattern was staring me in the face.

Vision-capable models are climbing. Pure text models are falling. Not dramatically, not overnight — but consistently, week after week.

<!-- more -->

## The numbers

I split the top 50 into two groups: models that can process images as input, and models that can't.

Vision-capable models: average rank improved 4.1 positions over the past 8 weeks.
Text-only models: average rank declined 1.9 positions over the same period.

The gap is widening. Every week, the vision models pull ahead a little more.

## Why now

Three things came together:

1. **Vision got good enough.** A year ago, image understanding was a party trick. Now it's production-ready. Models can extract text, identify objects, read charts, and describe scenes with real accuracy.

2. **The price came down.** Vision inference used to be 3-5x the cost of text. Now it's more like 1.5-2x, and dropping. The price premium is no longer prohibitive.

3. **Use cases multiplied.** Document processing, UI testing, content moderation, social media analysis, accessibility tools — all of these need vision. Developers who added images to their workflows discovered they couldn't go back.

## Models leading the vision wave

- **Qwen 3** — strongest open-source vision model, climbed to #15 this week
- **Claude Opus 4.6** — still the best at complex visual reasoning (charts, diagrams, multi-image tasks)
- **Gemini 2.0** — the video understanding capability sets it apart from the rest

## What this means for model selection

If you're starting a new project, assume you'll need vision at some point. Even if your MVP is text-only, pick a model that can handle images. You'll save yourself a migration later.

The multimodal filter on our rankings table makes this easy. Click "Vision" and see every model that can process images. It's a feature that didn't exist on this site a month ago. Now I can't imagine the table without it.

Because the data is telling us: text-only is the past. The future can see.
