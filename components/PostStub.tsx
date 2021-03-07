import { PostMeta } from "../lib/posts";

export default function PostStub({
  post,
  additionalClassName,
}: {
  post: PostMeta;
  additionalClassName?: string;
}) {
  return (
    <div
      className={`border-b border-grey-lighter pb-8 ${
        additionalClassName || ""
      }`}
    >
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
