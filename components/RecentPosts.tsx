import { PostMeta } from "../lib/posts";
import PostStub from "./PostStub";

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
      {recent.map((r, idx) => (
        <PostStub
          post={r}
          key={r.id}
          additionalClassName={idx > 0 && "pt-10"}
        />
      ))}
    </div>
  );
}
