# Screen reader checklist

Manual pass for the main components with NVDA (Windows) or VoiceOver (macOS). The automated
suite (`npm run test:a11y`) already covers keyboard behavior, focus management, 200% zoom and
axe, so this pass only checks what a screen reader actually announces.

Exact wording changes between screen readers and browsers. What matters is that the **role**,
**name**, **state** and **description** listed below are all spoken, in any order.

## Setup

1. Run `npm run dev` and open a story on its own page, without the Storybook UI:
   `http://localhost:6006/iframe.html?id=<story-id>&viewMode=story` (the ids are listed below).
2. Pick one pairing and stick to it for the whole pass:
   - **NVDA + Firefox or Chrome** (Windows). Start NVDA with `Ctrl+Alt+N`; `NVDA+Space` toggles
     between browse mode and focus mode, `NVDA+T` reads the page title, `Insert+F7` lists
     elements.
   - **VoiceOver + Safari** (macOS). Toggle with `Cmd+F5`. `VO` is `Ctrl+Option`; `VO+→`/`VO+←`
     read the next/previous item, `VO+Space` activates, `VO+U` opens the rotor.
3. Move with **Tab** first (what keyboard users hear), then read the story with browse mode / `VO+→`
   (what screen reader users hear when exploring).
4. Write down anything missing, repeated or confusing next to the component and fix it before
   ticking the box.

## Components

### Button — `primitives-button--variants`, `--disabled`, `--loading`

- [ ] Tab to a button: hears its label and "button".
- [ ] `--disabled`: disabled buttons are skipped by Tab; in browse mode they are read as
      "unavailable" / "dimmed".
- [ ] `--loading`: hears the label, then "Loading", and "unavailable" / "dimmed". Enter does
      nothing.

### Input and FormField — `forms-formfield--default`, `--required`, `--with-error`, `--validation`

- [ ] Tab into the field: hears the label ("Email"), "edit" / "edit text", then the helper text.
- [ ] `--required`: also hears "required". The asterisk itself is not read.
- [ ] `--with-error`: hears "invalid entry" / "invalid data" and the error message after the
      helper text.
- [ ] `--validation`: submit with an empty field. Focus moves back to the field (or you move to it)
      and the error message is read with it.
- [ ] `--hidden-label`: the label is still read although it is not visible.

### Checkbox — `forms-checkbox--states`, `--select-all`

- [ ] Hears the label, "checkbox" and "checked" / "not checked".
- [ ] Space toggles it and the new state is announced right away.
- [ ] The indeterminate box is read as "half checked" (NVDA) or "mixed" (VoiceOver).
- [ ] A description (`--with-description`) is read after the label.
- [ ] `--select-all`: toggling "Select all" updates the items, and each item reads its new state
      when you move to it.

### RadioGroup — `forms-radiogroup--default`, `--with-description-and-error`

- [ ] Tab into the group: hears the group label ("Delivery", "grouping" / "radio group"), then the
      checked radio with "radio button", "checked" and its position ("1 of 3").
- [ ] Arrow keys select the next radio and announce its label and state; "Store pickup" is skipped
      or read as unavailable.
- [ ] `--with-description-and-error`: hears the group description, the error and "required" /
      "invalid" when entering the group.

### Switch — `forms-switch--states`, `--with-description`

- [ ] Hears the label, "switch" (or "toggle button") and "on" / "off".
- [ ] Space flips it and announces the new state.
- [ ] Disabled switches are read as unavailable.

### Select — `forms-select--default`, `--states`, `--groups`

- [ ] Hears the label ("Fruit"), "combo box" / "pop-up button" and the current option
      (the placeholder "Pick a fruit" when nothing is selected).
- [ ] `Alt+↓` (Windows) or `VO+Space` (macOS) opens the list; options and the "Durian (out of
      season)" unavailable state are read.
- [ ] `--groups`: the group names ("Fruits", "Vegetables") are read when moving between groups.

### Slider — `forms-slider--default`, `--formatted-value`

- [ ] Hears the label ("Volume"), "slider" and the value ("40").
- [ ] Arrow keys change the value and each new value is announced.
- [ ] `--formatted-value`: the value is read as "$250", not "250".

### Tabs — `navigation-tabs--line`, `--manual-activation`

- [ ] Tab into the tab list: hears "Project", "tab list", then "Overview", "tab", "selected",
      "1 of 4".
- [ ] Arrow keys move between tabs and announce each one; "Archive" is read as unavailable.
- [ ] Tab from the tab list moves to the panel and hears "property page" / "tab panel" named after
      the tab, then its text.
- [ ] `--manual-activation`: arrows announce the tab without "selected" until Enter or Space.

### Accordion — `navigation-accordion--single`, `--disabled-item`

- [ ] Each header is read as a heading (level 3 by default) containing a button, with
      "expanded" / "collapsed".
- [ ] Enter or Space toggles it and announces the new state.
- [ ] Moving into an open section reads it as a region named after its header.
- [ ] `--disabled-item`: the "warranty" header is read as unavailable.

### Modal — `overlays-modal--default`, `--controlled-confirmation`

- [ ] Opening it announces "dialog", the title ("Invite a teammate") and the description, then
      the focused control ("Close, button").
- [ ] Browse mode / `VO+→` cannot reach the page behind the dialog.
- [ ] Closing it (Escape, Close, click on the backdrop) puts you back on "Invite teammate,
      button".
- [ ] `--controlled-confirmation`: announced as "alert dialog" with "Delete this project?" and
      the description.

### DropdownMenu — `overlays-dropdownmenu--default`

- [ ] The trigger reads "Options", "menu button" / "button, collapsed, has pop-up menu".
- [ ] Opening it announces "menu" and the first item ("Edit, menu item, 1 of 5" or similar). The
      shortcut text ("Ctrl+E") is not read.
- [ ] Arrow keys read each item; "Move to folder" is read as unavailable.
- [ ] Moving into "Delete" reads the "Danger zone" group name.
- [ ] Escape closes it and announces the trigger again, now "collapsed".

### Toast — `feedback-toast--default`, `--with-action`

- [ ] Showing a toast announces its title and description once, without moving focus.
- [ ] A "danger" toast is announced immediately, interrupting other speech.
- [ ] F8 moves to the newest toast and reads it; Tab reaches "Undo" and "Dismiss notification".
- [ ] Escape dismisses it and you are back on the button you came from.

### Tooltip — `feedback-tooltip--default`, `--on-icon-button`

- [ ] Tab to the trigger: hears its name, "button", then the tooltip text as its description
      ("Copy the link to your clipboard").
- [ ] `--on-icon-button`: hears "Info, button" and then "Account details".
- [ ] The tooltip text is not read a second time as separate content.
