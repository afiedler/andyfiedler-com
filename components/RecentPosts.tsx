import { PostMeta } from "../lib/posts";

function Post({ post }: { post: PostMeta }) {
  return (
    <div className="border-b border-grey-lighter pb-8">
      <span className="font-body text-green text-sm inline-block bg-green-light mb-4 px-2 py-1 rounded-full">
        category
      </span>
      <a
        href={`/posts/${post.id}`}
        className="font-body font-semibold text-primary dark:text-white transition-colors dark:hover:text-secondary hover:text-green text-lg block"
      >
        {post.title}
      </a>
      <div className="flex items-center pt-4">
        <p className="font-body font-light text-primary dark:text-white pr-2">
          {post.date}
        </p>
      </div>
    </div>
  );
}

export default function RecentPosts({
  count,
  allPosts,
}: {
  count: number;
  allPosts: PostMeta[];
}) {
  const recent = [];
  for (let i = 0; i < Math.min(allPosts.length, count); i++)
    recent.push(allPosts[i]);
  return (
    <div className="pt-8">
      {recent.map((r) => (
        <Post post={r} key={r.id} />
      ))}
    </div>
  );
}
