/**
 * Floating call button shown on mobile. CSS handles the responsive show/hide,
 * so no `window.innerWidth` checks are needed (legacy version did them in JS,
 * which broke SSR).
 */
import callerStyle from '@/styles/caller.module.css';
import { SvgSelectors } from './SvgSelectors';

export function Caller() {
  return (
    <a className={callerStyle.mobile_call} href="tel:+380638604966" aria-label="Зателефонувати в Lovy Moment">
      <SvgSelectors id="heandset" />
    </a>
  );
}
