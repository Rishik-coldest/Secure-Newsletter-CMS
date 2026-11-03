import Link from 'next/link';
import { prisma } from '../lib/prisma';

export const instant = false;

interface DevToArticle {
  id: number;
  title: string;
  description: string;
  cover_image: string | null;
  url: string;
  user: {
    name: string;
  };
  published_at: string;
}

async function getExternalArticles(): Promise<DevToArticle[]> {
  try {
    const res = await fetch('https://dev.to/api/articles', {
      next: { revalidate: 3600 }, // Cache for 1 hour
    });
    if (!res.ok) return [];
    return await res.json();
  } catch (error) {
    console.error('Failed to fetch external feeds:', error);
    return [];
  }
}

export default async function NewslettersPage() {
  // 1. Fetch local newsletters with "Sent" status from PostgreSQL
  const localNewsletters = await prisma.newsletter.findMany({
    where: { status: 'Sent' },
    orderBy: { createdAt: 'desc' },
    include: {
      author: {
        select: { name: true, email: true },
      },
    },
  });

  // 2. Fetch external articles
  const externalArticles = await getExternalArticles();

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl min-h-screen">
      {/* Page Header */}
      <header className="mb-12 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight mb-3 text-primary">
          Public Newsletter Hub
        </h1>
        <p className="text-base-content/70 max-w-2xl mx-auto">
          Stay informed with our internal newsletters and trending developer insights.
        </p>
      </header>

      {/*Internal Published Newsletters */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6 border-b border-base-300 pb-2 flex items-center gap-2">
          <span>📰</span> Internal Publications
        </h2>
        
        {localNewsletters.length === 0 ? (
          <div className="alert alert-info shadow-sm max-w-md mx-auto text-center justify-center">
            <div>
              <span>No published newsletters are currently available.</span>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {localNewsletters.map((newsletter) => (
              <div key={newsletter.id} className="card bg-base-100 shadow-xl border border-base-200 hover:shadow-2xl transition-all duration-300">
                <figure className="relative h-48 w-full bg-base-300">
                  <img
                    src={newsletter.image || "https://unsplash.com"}
                    alt={newsletter.title}
                    className="w-full h-full object-cover"
                  />
                </figure>
                <div className="card-body p-6">
                  <span className="badge badge-primary badge-sm font-semibold uppercase tracking-wider">
                    {newsletter.status}
                  </span>
                  <h3 className="card-title text-xl font-bold mt-2 line-clamp-1">
                    {newsletter.title}
                  </h3>
                  <p className="text-base-content/70 text-sm my-3 line-clamp-3">
                    {newsletter.content}
                  </p>
                  <div className="border-t border-base-200 pt-4 mt-auto flex flex-col gap-1 text-xs text-base-content/60">
                    <div>By: <span className="font-medium text-base-content">{newsletter.author?.name || newsletter.author?.email}</span></div>
                    <div>Published: {new Date(newsletter.createdAt).toLocaleDateString()}</div>
                  </div>
                  <div className="card-actions justify-between items-center mt-4 pt-2 border-t border-base-100 text-xs">
                    <button className="btn btn-ghost btn-xs gap-1 text-base-content/70 hover:text-primary">❤️ Like</button>
                    <button className="btn btn-ghost btn-xs gap-1 text-base-content/70 hover:text-primary">💬 Comment</button>
                    <button className="btn btn-ghost btn-xs gap-1 text-base-content/70 hover:text-primary">🔗 Share</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Section B: External Feeds (Dev.to Integration) */}
      <section>
        <h2 className="text-2xl font-bold mb-6 border-b border-base-300 pb-2 flex items-center gap-2">
          <span>🚀</span> Trending Publications
        </h2>

        {externalArticles.length === 0 ? (
          <div className="text-center text-base-content/50 py-8">
            Unable to load external developer articles at this time.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {externalArticles.map((article) => (
              <div key={article.id} className="card bg-base-100 shadow-lg border border-base-200 hover:scale-[1.01] transition-transform duration-200">
                <figure className="relative h-44 w-full bg-base-200">
                  <img
                    src={article.cover_image || "https://unsplash.com"}
                    alt={article.title}
                    className="w-full h-full object-cover"
                  />
                </figure>
                <div className="card-body p-5">
                  <span className="badge badge-secondary badge-outline badge-sm font-medium">
                    Dev.to Global Feed
                  </span>
                  <h3 className="card-title text-base font-bold mt-2 line-clamp-2 hover:text-secondary">
                    <a href={article.url} target="_blank" rel="noopener noreferrer">
                      {article.title}
                    </a>
                  </h3>
                  <p className="text-base-content/70 text-xs my-2 line-clamp-2">
                    {article.description}
                  </p>
                  <div className="mt-auto pt-3 border-t border-base-100 flex items-center justify-between text-[11px] text-base-content/50">
                    <span>By: {article.user.name}</span>
                    <span>{new Date(article.published_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
