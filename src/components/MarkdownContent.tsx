import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";

interface MarkdownContentProps {
  content: string;
}

export function MarkdownContent({ content }: MarkdownContentProps) {
  return (
    <article className="prose prose-bp prose-zinc dark:prose-invert max-w-none font-prose prose-headings:scroll-mt-24 prose-headings:font-sans prose-headings:font-semibold prose-headings:tracking-tight prose-h1:hidden prose-h2:mt-12 prose-h2:border-b prose-h2:border-border prose-h2:pb-3 prose-h2:text-xl prose-h3:mt-8 prose-h3:font-sans prose-h3:text-base prose-p:leading-[1.75] prose-p:text-text-secondary prose-a:font-medium prose-a:text-accent prose-a:no-underline hover:prose-a:underline prose-strong:text-foreground prose-blockquote:border-accent prose-blockquote:bg-surface-muted prose-blockquote:py-1 prose-blockquote:not-italic prose-table:text-sm prose-th:bg-surface-muted prose-td:border-border prose-li:text-text-secondary prose-hr:border-border">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[
          rehypeSlug,
          [rehypeAutolinkHeadings, { behavior: "wrap" }],
        ]}
      >
        {content}
      </ReactMarkdown>
    </article>
  );
}