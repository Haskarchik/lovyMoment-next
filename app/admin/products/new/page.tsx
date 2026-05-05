'use client';

/**
 * /admin/products/new — empty form for creating a fresh product. Live
 * preview updates as you type.
 */
import Link from 'next/link';
import { ProductForm } from '@/components/admin/ProductForm';
import { useAuth } from '@/components/admin/AuthProvider';
import styles from '@/styles/admin.module.css';

export default function NewProductPage() {
  const { can } = useAuth();
  if (!can('canEdit')) {
    return (
      <>
        <h1 className={styles.pageTitle}>Новий товар</h1>
        <div className={styles.alertError}>
          У вас немає права <strong>«Редагувати товари»</strong> — створення нових товарів недоступне.
        </div>
        <div className={styles.actionRow}>
          <Link href="/admin/products" className={styles.btnGhost}>← Усі товари</Link>
        </div>
      </>
    );
  }

  return (
    <>
      <h1 className={styles.pageTitle}>Новий товар</h1>
      <p className={styles.pageSubtitle}>
        Заповніть мінімум — назву (UK), id, головне фото та теги. Решту можна додати пізніше.
      </p>

      <div className={styles.actionRow}>
        <Link href="/admin/products" className={styles.btnGhost}>
          ← Усі товари
        </Link>
      </div>

      <ProductForm initial={null} />
    </>
  );
}
