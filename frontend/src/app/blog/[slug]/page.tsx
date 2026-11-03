import { OpusClipComparisonArticle } from "@/components/articles/opusclip-comparison-article";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { blogPosts, getBlogPost, getBlogPostMetadata } from "@/lib/blog-posts";

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) {
    return {};
  }

  return getBlogPostMetadata(post);
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post || slug !== "supoclip-vs-opusclip") {
    notFound();
  }

  return <OpusClipComparisonArticle post={post} />;
}
