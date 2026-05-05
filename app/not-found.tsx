/**
 * 404 page. Pure server component, served when the dynamic routes call
 * `notFound()` or when the URL doesn't match anything.
 */
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export default function NotFound() {
  const locale = 'uk' as const;
  return (
    <>
      <Header locale={locale} />
      <main className="container" style={{ padding: '4rem 1rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>404</h1>
        <p style={{ marginBottom: '2rem' }}>Сторінку не знайдено. Можливо, вона була видалена або переміщена.</p>
        <Link href="/">← Повернутися на головну</Link>
      </main>
      <Footer locale={locale} />
    </>
  );
}
