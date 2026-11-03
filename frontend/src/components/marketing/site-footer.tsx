import Image from "next/image";
import Link from "next/link";

import { getMarketingLinks } from "@/lib/marketing-links";
import { GITHUB_URL, UPSTREAM_GITHUB_URL } from "@/lib/site";

const linkClassName = "hover:text-foreground transition-colors";

/** Crawlable footer shared by the landing page, SEO pages, and blog. */
export function SiteFooter() {
  const columns = [
    { heading: "Guias", links: getMarketingLinks("guide").map(({ href, label }) => ({ href, label })) },
    {
      heading: "Comparativos",
      links: [...getMarketingLinks("comparison").map(({ href, label }) => ({ href, label })), { href: "/blog", label: "Todos os artigos" }],
    },
    {
      heading: "Produto",
      links: [
        ...getMarketingLinks("product").map(({ href, label }) => ({ href, label })),
        { href: "/sign-up", label: "Começar a criar clipes" },
        { href: "/#pricing", label: "Preços" },
        { href: "/affiliate", label: "Afiliados" },
        { href: "/status", label: "Status do serviço" },
        { href: "/privacy", label: "Privacidade" },
        { href: "/terms", label: "Termos de uso" },
      ],
    },
  ];

  return (
    <footer className="border-t px-6 py-12">
      <div className="mx-auto grid max-w-6xl gap-10 sm:grid-cols-2 lg:grid-cols-[1.2fr_1fr_1fr_1fr]">
        <div>
          <Link href="/" className="flex items-center gap-2">
            <Image src="/logo.png" alt="Kortes" width={24} height={24} className="rounded-md" />
            <span className="text-sm font-semibold" style={{ fontFamily: "var(--font-syne), system-ui" }}>
              Kortes
            </span>
          </Link>
          <p className="mt-3 max-w-xs text-xs leading-6 text-muted-foreground">
            Criador de clipes com IA. Cole um link e receba cortes verticais legendados, prontos para postar.
          </p>
          <div className="mt-4 flex gap-4 text-xs text-muted-foreground">
            <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className={linkClassName}>Código-fonte</a>
            <span>&copy; {new Date().getFullYear()}</span>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            Baseado no{" "}
            <a href={UPSTREAM_GITHUB_URL} target="_blank" rel="noopener noreferrer" className={linkClassName}>SupoClip</a>
            {" "}(AGPL-3.0).
          </p>
        </div>
        {columns.map((column) => (
          <nav key={column.heading} aria-label={`Links de ${column.heading}`}>
            <p className="text-xs font-semibold uppercase tracking-[0.16em]">{column.heading}</p>
            <ul className="mt-4 space-y-2.5 text-xs text-muted-foreground">
              {column.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={linkClassName}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
    </footer>
  );
}
