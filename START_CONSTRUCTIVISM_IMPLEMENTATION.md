# Quick Start Prompt for Claude Code

Copy and paste this prompt to start a new Claude Code session for implementing the Constructivism theme:

---

## Prompt for New Claude Code Session

```
I need you to implement a Russian Constructivism-inspired redesign for this React + TypeScript + MUI application.

**Context:**
- This is a business portal scaffold that will become the new default aesthetic
- The Constructivism theme should be subtle and sophisticated (not overwhelming)
- We're making it the DEFAULT theme (replacing current "basic" theme)

**Your Task:**
Read and follow CONSTRUCTIVISM_IMPLEMENTATION_CHECKLIST.md step-by-step. Work through each phase sequentially, checking off boxes as you complete tasks.

**Key Files to Reference:**
1. REDESIGN.md - Design specifications (color palette, typography, aesthetic notes)
2. CONSTRUCTIVISM_IMPLEMENTATION_CHECKLIST.md - Your implementation guide (follow this)

**Important Rules:**
- Follow the checklist exactly - all code snippets are provided
- Test after each phase before moving to next
- Check off boxes as you complete tasks
- If you encounter issues, document them in the checklist
- Run `npm test` after major changes to ensure no regressions

**Start with:**
Phase 1: Foundation Setup (adding fonts, updating colors, adding CSS)

Let me know when you've read the checklist and are ready to begin Phase 1.
```

---

## Alternative: Direct Start Prompt

If you want Claude to just start working immediately without explanation:

```
Implement the Constructivism theme for this React app by following CONSTRUCTIVISM_IMPLEMENTATION_CHECKLIST.md.

Start with Phase 1: Foundation Setup. Work through each task, check off boxes, and proceed to the next phase only after testing.

Begin now with task 1.1: Add Google Fonts.
```

---

## Files Claude Will Need Access To

**Must Read:**
- `CONSTRUCTIVISM_IMPLEMENTATION_CHECKLIST.md` - The step-by-step guide
- `REDESIGN.md` - Design specifications (optional, checklist has all info)

**Will Modify:**
- `src/index.html`
- `src/index.css`
- `src/data/configurableData.ts`
- `src/theme/portalTheme.ts`
- `src/layouts/Layout.tsx`
- `src/pages/Home.tsx`
- `README.md`
- `CLAUDE.md`

**Will Create:**
- `src/components/constructivism/GeometricAccent.tsx`
- `src/components/constructivism/index.ts`

---

## Expected Timeline

- **Phase 1:** 1-2 hours (fonts, colors, CSS)
- **Phase 2:** 1 hour (remove UI, update colors)
- **Phase 3:** 1 hour (geometric accent component)
- **Phase 4:** 3-4 hours (comprehensive testing)
- **Phase 5:** 1 hour (documentation)
- **Phase 6:** 1 hour (git, deployment)

**Total:** 8-10 hours

---

## Success Criteria

When implementation is complete:
- ✅ All checkboxes in CONSTRUCTIVISM_IMPLEMENTATION_CHECKLIST.md are checked
- ✅ `npm test` passes (97/97 tests)
- ✅ `npm run build` succeeds
- ✅ Typography uses Bebas Neue headers + Work Sans body
- ✅ Colors are #8B0000 (red) + #D4A574 (tan) + #FAF7F2 (background)
- ✅ Buttons have outlined style with fill on hover
- ✅ ONE subtle geometric accent on dashboard hero card
- ✅ Dark mode still works
- ✅ All pages functional and styled consistently

---

## Quick Commands

```bash
# Start dev server
npm run dev

# Run tests
npm test

# Build
npm run build

# Check for errors
npm run lint
```

---

## If You Get Stuck

**Common Issues:**

1. **Fonts not loading:** Check `src/index.html` has Google Fonts link
2. **Colors not applying:** Check CSS variables in `src/index.css` and `configurableData.ts`
3. **Styles not applying:** May need `!important` in CSS for specificity
4. **Tests failing:** Run `npm test -- -u` to update snapshots if UI changed

**Troubleshooting Section:** See end of CONSTRUCTIVISM_IMPLEMENTATION_CHECKLIST.md

---

## Notes

- The checklist is designed to be followed linearly
- Each task has exact code snippets to copy/paste
- Test after each phase before proceeding
- Update checkboxes so you can track progress
- If session ends, next Claude can pick up from last checked box

---

**Ready to start? Use the prompt above to begin implementation.**
