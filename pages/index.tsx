import Head from "next/head";
import Layout, { siteTitle } from "../components/layout";
import { getSortedPostsData, PostMeta } from "../lib/posts";
import { GetStaticProps } from "next";
import Header from "../components/header";
import PageGroup from "../components/PageGroup";
import RecentPosts from "../components/RecentPosts";

export default function Home({ allPostsData }: { allPostsData: PostMeta[] }) {
  return (
    <Layout home>
      <Head>
        <title>{siteTitle}</title>
      </Head>

      <div id="main">
        <Header />
        <PageGroup>
          <div>
            <div className="border-b border-grey-lighter py-16 lg:py-20">
              <h1 className="font-body font-semibold text-primary dark:text-white text-4xl md:text-5xl lg:text-6xl pt-3">
                Hi, I’m John Doe.
              </h1>
              <p className="font-body font-light text-primary dark:text-white text-xl pt-3">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </p>
              <a
                href="/"
                className="mt-12 block sm:inline-block px-10 py-4 bg-secondary transition-colors hover:bg-green font-body font-semibold text-white text-xl sm:text-2xl text-center sm:text-left"
              >
                Say Hello!
              </a>
            </div>

            <div className="border-b border-grey-lighter py-16 lg:py-20">
              <div className="flex items-center pb-6">
                <img src="/assets/img/icon-story.png" alt="icon story" />
                <h3 className="font-body font-semibold text-primary dark:text-white text-2xl ml-3">
                  My Story
                </h3>
              </div>
              <div>
                <p className="font-body font-light text-primary dark:text-white">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Nibh mauris cursus mattis molestie. Et leo duis ut diam. Sit
                  amet tellus cras adipiscing enim eu turpis. Adipiscing at in
                  tellus integer feugiat.
                  <br />
                  <br />
                  Maecenas accumsan lacus vel facilisis. Eget egestas purus
                  viverra accumsan in nisl nisi scelerisque eu. Non tellus orci
                  ac auctor augue mauris augue neque gravida. Auctor augue
                  mauris augue neque gravida in fermentum et sollicitudin.
                  Tempus urna et pharetra pharetra massa massa ultricies mi
                  quis. Amet mauris commodo quis imperdiet massa. Integer vitae
                  justo eget magna fermentum iaculis eu non.
                </p>
              </div>
            </div>

            <div className="py-16 lg:py-20">
              <div className="flex items-center pb-6">
                <img src="/assets/img/icon-story.png" alt="icon story" />
                <h3 className="font-body font-semibold text-primary dark:text-white text-2xl ml-3">
                  Posts
                </h3>
                <a
                  href="/posts"
                  className="flex items-center pl-10 font-body italic text-green dark:text-green-light transition-colors dark:hover:text-secondary hover:text-secondary"
                >
                  All posts
                  <img
                    src="/assets/img/long-arrow-right.png"
                    className="ml-3"
                    alt="arrow right"
                  />
                </a>
              </div>
              <RecentPosts count={3} allPosts={allPostsData} />
            </div>

            <div className="pb-16 lg:pb-20">
              <div className="flex items-center pb-6">
                <img src="/assets/img/icon-project.png" alt="icon story" />
                <h3 className="font-body font-semibold text-primary dark:text-white text-2xl ml-3">
                  My Projects
                </h3>
              </div>
              <div>
                <a
                  href=" / "
                  className="px-4 sm:px-6 py-4 border border-grey-lighter flex justify-between items-center mb-6"
                >
                  <span className="w-9/10 pr-8">
                    <h4 className="font-body font-semibold text-primary dark:text-white text-lg">
                      TailwindCSS
                    </h4>
                    <p className="font-body font-light text-primary dark:text-white">
                      Rapidly build modern websites without ever leaving your
                      HTML.
                    </p>
                  </span>
                  <span className="w-1/10">
                    <img
                      src="/assets/img/chevron-right.png"
                      className="mx-auto"
                      alt="chevron right"
                    />
                  </span>
                </a>

                <a
                  href=" / "
                  className="px-4 sm:px-6 py-4 border border-grey-lighter flex justify-between items-center mb-6"
                >
                  <span className="w-9/10 pr-8">
                    <h4 className="font-body font-semibold text-primary dark:text-white text-lg">
                      Maizzle
                    </h4>
                    <p className="font-body font-light text-primary dark:text-white">
                      Framework for Rapid Email Prototyping
                    </p>
                  </span>
                  <span className="w-1/10">
                    <img
                      src="/assets/img/chevron-right.png"
                      className="mx-auto"
                      alt="chevron right"
                    />
                  </span>
                </a>

                <a
                  href=" / "
                  className="px-4 sm:px-6 py-4 border border-grey-lighter flex justify-between items-center mb-6"
                >
                  <span className="w-9/10 pr-8">
                    <h4 className="font-body font-semibold text-primary dark:text-white text-lg">
                      Alpine.js
                    </h4>
                    <p className="font-body font-light text-primary dark:text-white">
                      Think of it like Tailwind for JavaScript.
                    </p>
                  </span>
                  <span className="w-1/10">
                    <img
                      src="/assets/img/chevron-right.png"
                      className="mx-auto"
                      alt="chevron right"
                    />
                  </span>
                </a>

                <a
                  href=" / "
                  className="px-4 sm:px-6 py-4 border border-grey-lighter flex justify-between items-center mb-6"
                >
                  <span className="w-9/10 pr-8">
                    <h4 className="font-body font-semibold text-primary dark:text-white text-lg">
                      PostCSS
                    </h4>
                    <p className="font-body font-light text-primary dark:text-white">
                      A tool for transforming CSS with JavaScript
                    </p>
                  </span>
                  <span className="w-1/10">
                    <img
                      src="/assets/img/chevron-right.png"
                      className="mx-auto"
                      alt="chevron right"
                    />
                  </span>
                </a>
              </div>
            </div>
          </div>
        </PageGroup>

        <PageGroup>
          <div className="flex flex-col sm:flex-row justify-between items-center border-t border-grey-lighter py-10 sm:py-12">
            <div className="flex flex-col sm:flex-row items-center mr-auto">
              <a href="/" className="mr-auto sm:mr-6">
                <img src="/assets/img/logo.svg" alt="logo" />
              </a>
              <p className="font-body font-light text-primary dark:text-white pt-5 sm:pt-0">
                ©2020 John Doe.
              </p>
            </div>
            <div className="flex items-center pt-5 sm:pt-0 mr-auto sm:mr-0">
              <a href="https://github.com/ " target="_blank">
                <i className="text-4xl text-primary dark:text-white pl-5 hover:text-secondary dark:hover:text-secondary transition-colors bx bxl-github"></i>
              </a>

              <a href="https://codepen.io/ " target="_blank">
                <i className="text-4xl text-primary dark:text-white pl-5 hover:text-secondary dark:hover:text-secondary transition-colors bx bxl-codepen"></i>
              </a>

              <a href="https://www.linkedin.com/ " target="_blank">
                <i className="text-4xl text-primary dark:text-white pl-5 hover:text-secondary dark:hover:text-secondary transition-colors bx bxl-linkedin"></i>
              </a>
            </div>
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
