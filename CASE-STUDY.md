# Case Study: A Windows XP Desktop, Rebuilt as a Portfolio

## Concept

Most portfolio sites are a scroll of sections. This one is a desktop.

The site simulates a Windows XP "Luna" environment — the blue glossy titlebars, the green Start button, the Bliss-style wallpaper — and turns each résumé section into something you'd actually click on: **My Computer** for an about-me panel, **My Documents** for a résumé, **Internet Explorer** for contact links, a **Terminal** you can actually type commands into. Windows drag, resize, minimize, and maximize like the real thing. The whole thing boots with a BIOS POST sequence before it even gets to the desktop.

The goal wasn't nostalgia for its own sake. It was to make "here's my work" into something with a little friction and a little delight — a site that rewards poking around, the way the real OS once did.

## Architecture

The site is a React + TypeScript + Vite app, but the interesting part isn't the stack — it's the shape of the code underneath the desktop metaphor.

**Everything is a plugin.** A single array (`AppConfig[]` in `src/apps/registry.ts`) describes every app on the desktop: its id, title, icon, default window position/size, and the component that renders inside it. The desktop icons, Start Menu, and taskbar don't know anything about "About" or "Terminal" specifically — they just map over that array and filter by `showOnDesktop` / `showInStartMenu`. Adding an app means writing a component and adding one entry to the array. Nothing else has to change.

That pattern paid off directly during the build: six apps — Winamp, CCleaner, Outlook, Paint, and the project case-study windows — were added in a single commit, with zero changes to the window manager, drag logic, or taskbar. The registry pattern meant horizontal growth was cheap.

**One reducer runs every window.** Position, size, z-order, minimized/maximized state — all of it lives in a single `windowManagerReducer`, keyed by app id. There's no per-app window logic; a window is just an entry in that state tree, and `OPEN`/`CLOSE`/`FOCUS`/`MOVE`/`RESIZE`/`TOGGLE_MAXIMIZE` actions are the entire vocabulary. This is what makes drag, resize, minimize, and maximize behave identically across every single app without each one having to implement it.

**Dragging and resizing are hand-rolled**, not a library. Two small hooks (`useDraggable`, `useResizable`) use the Pointer Events API to mutate a window's inline styles directly during a drag — no React re-render on every mouse-move — and only commit the final position/size to state once, on release. It's the same trick native apps use to stay responsive: don't route high-frequency input through the full render pipeline.

**Sound is synthesized, not sampled.** There are no audio files in this project. A small `SoundEngine` class generates every click, chime, and error "ding" from raw oscillator tones via the Web Audio API — closer in spirit to how the real OS's system sounds worked than dropping in MP3s would have been.

**Three skins, one set of components.** Blue (Luna), Silver, and Olive are implemented entirely as CSS custom-property overrides on `<html data-skin="...">` — the same components render all three, they just point at different gradient tokens. Switching skins is a design-system exercise, not a component-forking one.

## A Tour of the Desktop

**Boot sequence.** Before the desktop loads, the site plays a two-phase boot: a black-screen BIOS POST sequence (memory test, drive detection, a POST beep) followed by the familiar blue Windows loading bar. It's skippable with any keypress — the point is atmosphere, not friction.

**My Computer** — an about-me panel styled as a System Properties dialog: name, role, location, and a "System" summary, with skills reframed as installed hardware and a personality list of "installed drivers" (`ecommerce_ops.sys`, `homelab.sys`, `financial_modeling.sys`).

**My Documents** — the résumé, rendered as a plain-text Notepad document.

**Internet Explorer** — contact info, styled as browser chrome with a Favorites bookmark list instead of a contact form.

**Recycle Bin** — the joke writes itself: an "Empty Recycle Bin" button that triggers a fake Blue Screen of Death instead of actually deleting anything.

**Winamp** — reframed as an achievements jukebox: a clickable playlist where each track is a professional accomplishment, complete with a scrolling LCD "now playing" readout.

**CCleaner / Recuva** — testimonials presented as "recovered" deleted files from a disk-scan, because testimonials-as-undeleted-data is funnier than a testimonials carousel.

**Outlook** — a "Compose New Message" form for contact. Submitting it doesn't silently pretend to send mail; it honestly tells you sending isn't wired up yet and gives you the real email address instead.

**Paint** — a preview stub for a pixel-art gallery that's still in progress.

**Terminal** — the deepest cut. A real `cmd.exe`-style window with its own command parser: `help`, `ls`, `cd`, `cat`, `whoami`, `neofetch`, `history`, and an easter egg (`sudo hire-me`) that denies you the first time and grants access — redirecting to the contact window — the second. The command table is a pure, fully unit-tested function, decoupled from the DOM and the rest of the app, so commands like `cd resume` can reuse the exact same "open a window" machinery every desktop icon uses.

**Homelab** — a real project case study (systems administration work: Proxmox, Docker, pfSense, TrueNAS, Nginx Proxy Manager) that includes a "Network Services" shortcut showing each service's real logo, deep-linking back into the case study.

**Blue Screen of Death** — the site's central easter egg, triggered from the Recycle Bin, rendered as an authentically deadpan fake crash screen.

## How It Was Built

The build moved in clear phases, visible in the commit history:

1. **Core shell.** A static HTML prototype (built first, to validate the "feel" before committing to an architecture) was rewritten in React/TypeScript, establishing the plugin registry, the window-manager reducer, the drag hooks, and the sound engine — with four apps wired up to prove the pattern.
2. **Chrome and personality.** The skin system, boot sequence, BSOD, resize/maximize, and a mobile fallback (windows go full-screen and undraggable below a breakpoint, since drag-to-resize doesn't make sense on a touchscreen) were layered on top of the shared window primitives — none of it touched per-app code.
3. **Horizontal expansion.** Six more apps shipped in one commit, proving the registry pattern scaled.
4. **Refinement.** Wallpaper, icon sizing, taskbar height — the unglamorous pass that makes a prototype feel like a finished product.
5. **Depth.** A BIOS-style boot redesign, the Terminal app, hand-built icon assets, a real content pass (replacing placeholder text with actual bio/contact/project info), a Network Services app (later folded into the Homelab case study as a shortcut rather than staying a standalone icon — a good example of cutting a feature back once it found its real home), and finally window content that scales itself when you resize or maximize a window, so a bigger window isn't just a bigger empty box.
6. **Taskbar polish.** A calendar popup on the tray clock and a "Show Desktop" quick-launch button — small, real Windows behaviors that round out the illusion.

## Notable Decisions

**Scaling window content without fighting the drag hooks.** Windows already scaled their content 1.3× when maximized, using a "shrink the layout, then transform it back up" trick. Extending that to *live, manual* resizing — so text keeps filling the window as you drag it bigger, not just when you hit Maximize — turned out to be the trickiest problem in the whole build. The obvious approaches (CSS `zoom`, percentage-based sizing) both broke down under a live drag, because the box being resized is mutated directly for performance and never touches React state until you let go. The fix was to have the resize hook update the content wrapper's transform in the exact same synchronous tick it moves the window — so the two can never drift out of sync, even for a single frame.

**Cutting a feature back to where it belonged.** Network Services shipped as its own desktop app, then got moved inside the Homelab case study as a clickable shortcut once it became clear that's what it actually was — supporting detail for one project, not a standalone destination. Not every feature earns a permanent spot on the desktop.

**Honest stubs over fake functionality.** Outlook's "Send" button doesn't silently no-op — it tells you plainly that sending isn't wired up and gives you a real way to reach out. Small thing, but it's the difference between a demo and something a stranger might actually try to use.

## Current Status

Most of the desktop is real, filled-in content. A few sections are still placeholders, by design rather than oversight — this is a living site, not a frozen deliverable:

- **Résumé** — not yet written in.
- **Winamp achievements** and **CCleaner testimonials** — content pending.
- **Contact** — email is real; LinkedIn, GitHub, and the browser address bar are still placeholder.
- **Paint** — currently a preview image with a "coming soon" pixel-art gallery behind it.

Everything else — About, the Terminal, the Homelab case study, the boot sequence, the skin system, the taskbar — is finished and live.
