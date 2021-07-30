import Head from "next/head";
import Layout, { siteTitle } from "../../components/layout";
import { getSortedPostsData, PostMeta } from "../../lib/posts";
import { GetStaticProps } from "next";
import Header from "../../components/header";
import PageGroup from "../../components/PageGroup";
import PostStub from "../../components/PostStub";

export default function Blog({ allPostsData }: { allPostsData: PostMeta[] }) {
  return (
    <Layout home>
      <Head>
        <title>{siteTitle}</title>
      </Head>

      <div id="main">
        <Header />
        <PageGroup>
          <div>
            <div className="py-16 lg:py-20">
              <h3 className="font-body font-semibold text-primary dark:text-white text-4xl md:text-5xl lg:text-6xl pt-5">
                Posts
              </h3>
              <div className="pt-8 lg:pt-12">
                {allPostsData.map((p, idx) => (
                  <PostStub
                    key={p.id}
                    post={p}
                    additionalClassName={idx > 0 && "pt-10"}
                  />
                ))}
              </div>
            </div>
          </div>
        </PageGroup>

        <PageGroup>
          <div className="flex flex-col sm:flex-row justify-between items-center border-t border-grey-lighter py-10 sm:py-12">
            <div className="flex flex-col sm:flex-row items-center mr-auto">
              <p className="font-body font-light text-primary dark:text-white pt-5 sm:pt-0">
                ©2021 Andy Fiedler
              </p>
            </div>
            {/* <div className="flex items-center pt-5 sm:pt-0 mr-auto sm:mr-0">
              <a href="https://github.com/ " target="_blank">
                <i className="text-4xl text-primary dark:text-white pl-5 hover:text-secondary dark:hover:text-secondary transition-colors bx bxl-github"></i>
              </a>

              <a href="https://codepen.io/ " target="_blank">
                <i className="text-4xl text-primary dark:text-white pl-5 hover:text-secondary dark:hover:text-secondary transition-colors bx bxl-codepen"></i>
              </a>

              <a href="https://www.linkedin.com/ " target="_blank">
                <i className="text-4xl text-primary dark:text-white pl-5 hover:text-secondary dark:hover:text-secondary transition-colors bx bxl-linkedin"></i>
              </a>
            </div> */}
          </div>
        </PageGroup>
      </div>
    </Layout>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const allPostsData = getSortedPostsData();
  return {
    props: {
      allPostsData,
    },
  };
};
