---
title: Translation Score Table
description: To address the issue of outdated translations, we implement a scoring system to measure how closely translated pages align with the source English content, and if they differ too much, we disable them.
---

# Translation Score Table

To address the issue of outdated translations, we implement a scoring system to measure how closely translated pages align with the source English content, and if they differ too much, we disable them.

The core Preact documentation is written in English and we rely on the community to translate it into other languages. However, contributors come and go, leaving some translations outdated and the content in those languages may become problematic. We don't want to delete the hard work of translators, but we need a way of ensuring users are getting information that is close to the original source.

Along those lines, we automatically score translated pages based on how closely they align, using links, code blocks, and page structure as our markers. If the total (weighted) score is less than `0.4`, the translation will be disabled and users will be given the English version of the page instead. The content remains as-is, however, waiting for a generous contributor to update it and get it back in good standing. This page should aid in identifying which translations are most in need of attention.

<translation-score-table></translation-score-table>
