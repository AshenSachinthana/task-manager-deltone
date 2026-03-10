import Link from "next/link";

export default function NotFound() {
  return (
    <div className="not-found">
      <div className="not-found-code">404</div>
      <h1 className="not-found-title">Page not found</h1>
      <p className="not-found-text">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link href="/" className="not-found-link">
        &larr; Back to Task Flow
      </Link>
    </div>
  );
}
