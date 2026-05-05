'use client';

/**
 * Tiny editor for `string[]` fields (used for `complactation` / `complactation_en`).
 * Each item has its own input + remove button; an "add" button appends a new
 * empty entry. Empty entries are pruned at save time by the parent form.
 */
import styles from '@/styles/admin.module.css';

interface Props {
  value: string[];
  onChange: (next: string[]) => void;
  placeholder?: string;
}

export function ListEditor({ value, onChange, placeholder }: Props) {
  function setAt(idx: number, v: string) {
    const next = [...value];
    next[idx] = v;
    onChange(next);
  }

  function removeAt(idx: number) {
    const next = [...value];
    next.splice(idx, 1);
    onChange(next);
  }

  function add() {
    onChange([...value, '']);
  }

  return (
    <div className={styles.listEditor}>
      {value.map((item, idx) => (
        <div key={idx} className={styles.listEditorRow}>
          <input
            className={styles.input}
            value={item}
            placeholder={placeholder}
            onChange={(e) => setAt(idx, e.target.value)}
          />
          <button
            type="button"
            className={`${styles.listIconBtn} ${styles.listIconBtnDanger}`}
            onClick={() => removeAt(idx)}
            aria-label="Видалити пункт"
          >
            ×
          </button>
        </div>
      ))}

      <button type="button" className={styles.listAddBtn} onClick={add}>
        + Додати пункт
      </button>
    </div>
  );
}
