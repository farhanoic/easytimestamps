# Translation Review Guide

## Manual Review Checklist for Native Speakers

### Pre-Review Setup
- [ ] Ensure you have access to the application in your target language
- [ ] Have the English version available for reference
- [ ] Test on both desktop and mobile devices
- [ ] Use different browsers (Chrome, Firefox, Safari)

### Language Quality Review

#### 1. Accuracy & Completeness
- [ ] All text is translated (no English text remaining)
- [ ] Translations accurately convey the original meaning
- [ ] Technical terms are appropriately localized
- [ ] Numbers, dates, and times follow local conventions
- [ ] Currency and units are localized where applicable

#### 2. Linguistic Quality
- [ ] Grammar is correct and natural
- [ ] Spelling follows local standards (e.g., US vs UK English)
- [ ] Punctuation follows local conventions
- [ ] Capitalization rules are followed
- [ ] Tone and style are consistent throughout
- [ ] Terminology is consistent across all text

#### 3. Cultural Appropriateness
- [ ] No culturally insensitive content
- [ ] Examples and references are culturally relevant
- [ ] Colors, symbols, and imagery are appropriate
- [ ] Time formats match local preferences (12/24 hour)
- [ ] Date formats follow local conventions (MM/DD vs DD/MM)
- [ ] Address formats are localized
- [ ] Phone number formats are correct

### UI/UX Review

#### 4. Layout & Typography
- [ ] Text fits properly in buttons and menus
- [ ] No text overflow or truncation
- [ ] Line breaks are appropriate
- [ ] Text alignment works with reading direction (LTR/RTL)
- [ ] Font rendering is clear and readable
- [ ] Special characters display correctly

#### 5. Functional Testing
- [ ] All buttons and links work correctly
- [ ] Form validation messages appear in correct language
- [ ] Error messages are translated and helpful
- [ ] Success messages are appropriate
- [ ] Tooltips and help text are accessible
- [ ] Search functionality works with localized terms

#### 6. Content Flow
- [ ] Navigation makes sense in the target language
- [ ] Information hierarchy is logical
- [ ] Call-to-action buttons are compelling
- [ ] Instructions are clear and actionable
- [ ] Help documentation is useful

### Platform-Specific Checks

#### Web Application
- [ ] Page titles are translated
- [ ] URL slugs are localized (if applicable)
- [ ] Meta descriptions are translated
- [ ] Alt text for images is translated
- [ ] Form labels and placeholders are clear

#### Mobile Considerations
- [ ] Text remains readable on small screens
- [ ] Touch targets are appropriately sized
- [ ] Swipe gestures work correctly
- [ ] App store descriptions are localized

### Quality Assurance Checklist

#### Critical Issues (Must Fix)
- [ ] Missing translations
- [ ] Incorrect or misleading translations
- [ ] Broken functionality in target language
- [ ] Cultural inappropriateness
- [ ] Legal compliance issues

#### Major Issues (Should Fix)
- [ ] Unnatural or awkward phrasing
- [ ] Inconsistent terminology
- [ ] UI layout problems
- [ ] Accessibility issues

#### Minor Issues (Nice to Fix)
- [ ] Style improvements
- [ ] Minor grammatical adjustments
- [ ] Better word choices
- [ ] Enhanced local relevance

### Language-Specific Considerations

#### Spanish (es)
- [ ] Formal vs informal address (tú/usted) is consistent
- [ ] Regional variations considered (Latin America vs Spain)
- [ ] Gendered language is handled appropriately
- [ ] Accents and special characters display correctly

#### French (fr)
- [ ] Formal vs informal address (tu/vous) is appropriate
- [ ] Gendered language is correct
- [ ] Canadian vs European French considerations
- [ ] Accents and cedillas display properly

#### German (de)
- [ ] Formal vs informal address (du/Sie) is consistent
- [ ] Compound words are properly formed
- [ ] Capitalization rules for nouns are followed
- [ ] Umlauts (ä, ö, ü, ß) display correctly

#### Portuguese (pt)
- [ ] Brazilian vs European Portuguese is consistent
- [ ] Formal vs informal address is appropriate
- [ ] Gendered language is handled correctly
- [ ] Accents and special characters display properly

#### Japanese (ja)
- [ ] Appropriate level of politeness (keigo)
- [ ] Kanji, hiragana, katakana usage is correct
- [ ] Text direction and line breaks are proper
- [ ] Cultural context is appropriate

#### Korean (ko)
- [ ] Appropriate level of formality
- [ ] Honorific language is used correctly
- [ ] Hangul displays properly
- [ ] Cultural context is maintained

#### Chinese (zh-CN)
- [ ] Simplified vs Traditional characters are correct
- [ ] Cultural references are appropriate for mainland China
- [ ] Formal tone is maintained
- [ ] Character encoding is correct

### Review Documentation Template

```markdown
## Translation Review Report
**Language:** [Language Code]
**Reviewer:** [Name and Qualifications]
**Review Date:** [Date]
**Version:** [App Version]

### Summary
- Overall Quality: [Excellent/Good/Fair/Poor]
- Completion Rate: [%]
- Critical Issues: [Number]
- Major Issues: [Number]
- Minor Issues: [Number]

### Critical Issues Found
1. [Issue description]
   - Location: [Where found]
   - Current Text: [What it says now]
   - Suggested Fix: [What it should say]
   - Impact: [Why this matters]

### Major Issues Found
[Similar format to critical issues]

### Minor Issues Found
[Similar format to critical issues]

### Cultural Appropriateness Notes
[Any cultural considerations or recommendations]

### Overall Recommendations
[General suggestions for improvement]

### Approval Status
- [ ] Approved for release
- [ ] Approved with minor fixes
- [ ] Requires major revisions
- [ ] Not approved - significant issues

**Reviewer Signature:** [Name]
**Date:** [Date]
```

### Quality Standards

#### Minimum Acceptance Criteria
- 100% translation completeness
- No critical functional issues
- No cultural inappropriateness
- Consistent terminology usage
- Proper grammar and spelling

#### Excellence Criteria
- Natural, native-like language
- Culturally adapted content
- Optimal UI/UX for target market
- Enhanced local relevance
- Accessibility compliance

### Review Process

1. **Initial Automated Check**
   - Run translation QA tool
   - Fix critical automated issues
   - Generate baseline report

2. **Native Speaker Review**
   - Assign qualified native speaker
   - Provide access to staging environment
   - Complete comprehensive review checklist
   - Document all findings

3. **Issue Resolution**
   - Prioritize critical and major issues
   - Implement fixes
   - Re-test affected areas
   - Verify fixes with reviewer

4. **Final Approval**
   - Reviewer confirms fixes
   - Sign off on quality
   - Approve for release

### Reviewer Qualifications

#### Required
- Native speaker of target language
- Fluent in English for comparison
- Basic understanding of software/web applications
- Attention to detail

#### Preferred
- Translation or localization experience
- Technical writing background
- UI/UX design awareness
- Cultural consulting experience
- Previous software testing experience

### Tools and Resources

#### Testing Tools
- Browser developer tools
- Mobile device simulators
- Screen readers for accessibility
- Multiple browsers and devices

#### Reference Materials
- Style guides for target language
- Terminology databases
- Cultural reference materials
- Local legal and compliance requirements

#### Communication
- Direct access to development team
- Translation management system access
- Issue tracking system access
- Regular review meetings scheduled