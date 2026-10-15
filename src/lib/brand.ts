/** Shown on every poster, so each one printed and hung on a wall points back here. */
export const SITE = 'skyofyourday.com';
/**
 * Printed at the foot of every poster. Posters are adaptations of CC BY-SA star data, so they are
 * shared under CC BY-SA 4.0 and must credit it (see LICENSE and the terms page).
 */
export const POSTER_CREDIT = `${SITE}  ·  CC BY-SA 4.0  ·  HYG star data`;
/** Ko-fi page for voluntary donations; leave empty to hide the invitation. */
export const KOFI_URL = 'https://ko-fi.com/skyofyourday';
/**
 * The same page as Ko-fi's embeddable tip panel. It is loaded only when someone asks for it,
 * so until then nothing on this site reaches Ko-fi. If Ko-fi changes its widget, take the
 * current address from ko-fi.com/manage/widgets and put it here.
 */
export const KOFI_EMBED = `${KOFI_URL}/?hidefeed=true&widget=true&embed=true&preview=true`;
