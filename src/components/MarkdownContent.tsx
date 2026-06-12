import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";

interface MarkdownContentProps {
  content: string;
}

export function MarkdownContent({ content }: MarkdownContentProps) {
  return (
    <div
      id="content"
      className="prose prose-bp prose-gray dark:prose-invert relative mb-14 mt-8 max-w-none font-sans [contain:inline-size] prose-headings:scroll-mt-[var(--scroll-mt)] prose-h1:hidden prose-h2:mt-10 prose-h2:font-semibold prose-h2:text-gray-900 dark:prose-h2:text-gray-200 prose-h3:mt-8 prose-h3:font-semibold prose-h3:text-gray-900 dark:prose-h3:text-gray-200 prose-p:leading-7 prose-p:text-gray-600 dark:prose-p:text-gray-400 prose-a:font-medium prose-a:text-primary prose-a:no-underline hover:prose-a:underline dark:prose-a:text-primary-light prose-strong:text-gray-900 dark:prose-strong:text-gray-200 prose-blockquote:border-primary prose-blockquote:text-gray-600 dark:prose-blockquote:border-primary-light dark:prose-blockquote:text-gray-400 prose-code:rounded prose-code:bg-gray-100 prose-code:px-1 prose-code:py-0.5 prose-code:text-gray-800 prose-code:before:content-none prose-code:after:content-none dark:prose-code:bg-gray-800/60 dark:prose-code:text-gray-200 prose-pre:rounded-xl prose-pre:border prose-pre:border-gray-200 prose-pre:bg-gray-50 dark:prose-pre:border-white/[0.07] dark:prose-pre:bg-gray-900 prose-table:text-sm prose-th:bg-gray-50 prose-th:text-gray-900 dark:prose-th:bg-gray-800/50 dark:prose-th:text-gray-200 prose-td:border-gray-100 dark:prose-td:border-white/[0.07] prose-li:text-gray-600 dark:prose-li:text-gray-400 prose-hr:border-gray-100 dark:prose-hr:border-gray-800"
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[
          rehypeSlug,
          [rehypeAutolinkHeadings, { behavior: "wrap" }],
        ]}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}