# Portfolio / résumé site — retro OS desktop concept

## Concept
The site is a simulated desktop (Windows XP "Luna" aesthetic — blue glossy titlebars, Bliss-style wallpaper). Visitors interact with icons, open draggable windows, and use a Start menu / taskbar, with each window functioning as a section of the résumé or portfolio.

Confirmed direction: Windows XP "Luna" theme (blue glossy titlebars, rounded chrome), matching the reference screenshot — not the flatter, grayer Windows 2000 look.

## Icon-to-content map

| Desktop icon | Section it opens |
|---|---|
| My Computer | About Me — "System Properties" style panel, skills as installed hardware/drivers |
| My Documents | Résumé — opens like a WordPad/Notepad doc, downloadable as real PDF |
| Internet Explorer | Contact / social links — styled as browser bookmarks |
| Recycle Bin | Old/abandoned projects, "failed experiments" (self-aware fun) |
| Project folders (one per project) | Case studies — each folder contains "files" (screenshots, write-ups) |
| Winamp | Playlist widget for personality, or reframed as an "achievements" jukebox |
| CCleaner / Recuva | Cheeky "Testimonials / References" recovery tool joke |
| Paint | Pixel art portfolio *(later build)* |
| Outlook | Contact form styled as an email client ("Compose new message") |

## Interaction details
- Boot sequence on first load: brief startup flicker/logo/chime before the desktop appears
- Draggable windows with real stacking order, minimize to taskbar, restore on click
- Start menu with name at top like a user account, linking to each section
- Live system clock in the tray
- Desktop icons: single-click to select (dotted box), double-click to open
- Right-click context menu on desktop (Arrange Icons, Refresh, Properties → "About this site")
- Hourglass cursor briefly on window open
- Sound design included: startup chime, click, error "ding" — with a mute toggle available
- Easter egg: fake BSOD on an unexpected click, played for laughs

## Visual & technical approach
- Font: Tahoma / MS Sans Serif via webfont
- Classic XP blue titlebar theme, with an optional silver/olive skin switcher as a meta touch
- Build: HTML/CSS/JS or React, custom pointer-event drag logic (no heavy libraries needed)
- Mobile fallback: windows open full-screen as stacked "apps" instead of draggable, since dragging doesn't work well on touch

## Confirmed decisions
- Era: XP Luna
- Sound: included, with mute toggle
- Icon list: confirmed as above, with Paint → pixel art portfolio flagged as a later build

## Next steps
- Build a working HTML prototype with 2–3 sample windows to validate feel
- Design the pixel art portfolio window (later build, once core desktop is working)
