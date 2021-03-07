import Layout from "../../components/layout";
import { getAllPostIds, getPostData, PostMeta } from "../../lib/posts";
import Head from "next/head";
import Header from "../../components/header";
import PageGroup from "../../components/PageGroup";

function TitleBlock({ post }: { post: PostMeta }) {
  return (
    <div className="border-b border-grey-lighter pb-8 sm:pb-12">
      <span className="font-body text-green text-sm inline-block bg-green-light mb-5 sm:mb-8 px-2 py-1 rounded-full">
        category
      </span>
      <h2 className="font-body font-semibold text-primary dark:text-white text-3xl sm:text-4xl md:text-5xl block leading-tight">
        {post.title}
      </h2>
      <div className="flex items-center pt-5 sm:pt-8">
        <p className="font-body font-light text-primary dark:text-white pr-2">
          {post.date}
        </p>
      </div>
    </div>
  );
}

function PostBody({ post }: any) {
  return (
    <article
      className="border-b border-grey-lighter py-8 sm:py-12 prose prose dark:prose-dark max-w-none"
      dangerouslySetInnerHTML={{ __html: post.contentHtml }}
    ></article>
  );
}

export default function Post({ postData }) {
  return (
    <Layout>
      <Head>
        <title>{postData.title}</title>
      </Head>
      <div id="main">
        <Header />
        <PageGroup>
          <div className="pt-16 lg:pt-20">
            <TitleBlock post={postData} />
            <PostBody post={postData} />
          </div>
        </PageGroup>
      </div>
    </Layout>
  );
}

export async function getStaticPaths() {
  const paths = getAllPostIds();
  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const postData = await getPostData(params.id);
  return {
    props: {
      postData,
    },
  };
}
