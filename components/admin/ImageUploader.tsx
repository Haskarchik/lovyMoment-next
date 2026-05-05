'use client';

/**
 * Drag-and-drop image uploader for the admin form.
 *
 * Files are uploaded directly to Firebase Storage at
 *   `products/<productId>/<timestamp>-<sanitised-filename>`
 * and the resulting download URLs are reported back via `onChange`.
 *
 * Modes:
 *   - `single`  — `value` is `string`, replaces on upload
 *   - `multi`   — `value` is `string[]`, appends on upload
 *
 * Removing an item only drops the URL from the form state. The file in
 * Storage stays orphaned. Cleaning up orphans is a TODO — we'd need a
 * Cloud Function or scheduled job to do that safely.
 */
import { useCallback, useRef, useState, type DragEvent } from 'react';
import { ref as storageRef, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

import { clientStorage } from '@/lib/firebase-client';
import styles from '@/styles/admin.module.css';

interface BaseProps {
  /** Used as folder name in Storage (`products/<productId>`). */
  productId: string;
}

interface SingleProps extends BaseProps {
  mode: 'single';
  value: string;
  onChange: (url: string) => void;
  label?: string;
  hint?: string;
}

interface MultiProps extends BaseProps {
  mode: 'multi';
  value: string[];
  onChange: (urls: string[]) => void;
  label?: string;
  hint?: string;
}

type Props = SingleProps | MultiProps;

function sanitise(filename: string): string {
  return filename.replace(/[^a-z0-9._-]+/gi, '-').replace(/^-+|-+$/g, '');
}

export function ImageUploader(props: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [progress, setProgress] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFiles = useCallback(
    async (fileList: FileList | null) => {
      if (!fileList || fileList.length === 0) return;
      setError(null);

      const files = Array.from(fileList).filter((f) => f.type.startsWith('image/'));
      if (files.length === 0) {
        setError('Можна завантажувати лише зображення');
        return;
      }

      const folder = props.productId || 'unsorted';
      const uploadedUrls: string[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const name = `${Date.now()}-${sanitise(file.name)}`;
        const path = `products/${folder}/${name}`;
        const fileRef = storageRef(clientStorage(), path);
        const task = uploadBytesResumable(fileRef, file);

        try {
          await new Promise<void>((resolve, reject) => {
            task.on(
              'state_changed',
              (snap) => {
                const pct = Math.round((snap.bytesTransferred / snap.totalBytes) * 100);
                setProgress(`Завантаження ${i + 1}/${files.length} — ${pct}%`);
              },
              (err) => reject(err),
              () => resolve()
            );
          });
          const url = await getDownloadURL(task.snapshot.ref);
          uploadedUrls.push(url);
        } catch (err: any) {
          setError(err?.message ?? 'Помилка завантаження');
          break;
        }
      }

      setProgress(null);

      if (uploadedUrls.length === 0) return;

      if (props.mode === 'single') {
        props.onChange(uploadedUrls[0]);
      } else {
        props.onChange([...(props.value ?? []), ...uploadedUrls]);
      }
    },
    [props]
  );

  function onDragOver(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragging(true);
  }
  function onDragLeave() {
    setDragging(false);
  }
  function onDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragging(false);
    handleFiles(e.dataTransfer.files);
  }

  function removeAt(idx: number) {
    if (props.mode === 'single') {
      props.onChange('');
    } else {
      const next = [...props.value];
      next.splice(idx, 1);
      props.onChange(next);
    }
  }

  const items: string[] = props.mode === 'single' ? (props.value ? [props.value] : []) : props.value ?? [];

  return (
    <div>
      {props.label && <label className={styles.formLabel}>{props.label}</label>}

      <div
        className={`${styles.uploader} ${dragging ? styles.uploaderActive : ''}`}
        onClick={() => inputRef.current?.click()}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
      >
        <div>📁 Перетягніть фото сюди або клікніть для вибору</div>
        {props.hint && <div className={styles.uploaderHint}>{props.hint}</div>}
        {progress && <div className={styles.uploadProgress}>{progress}</div>}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple={props.mode === 'multi'}
          style={{ display: 'none' }}
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>

      {error && <div className={styles.alertError} style={{ marginTop: 10 }}>{error}</div>}

      {items.length > 0 && (
        <div className={styles.imageList}>
          {items.map((url, idx) => (
            <div
              key={url + idx}
              className={`${styles.imageItem} ${idx === 0 && props.mode === 'multi' ? styles.imageMain : ''}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt={`upload ${idx + 1}`} />
              <button
                type="button"
                className={styles.imageRemove}
                aria-label="Видалити"
                onClick={(e) => {
                  e.stopPropagation();
                  removeAt(idx);
                }}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
