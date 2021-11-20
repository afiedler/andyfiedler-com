import Head from "next/head";
import Image from "next/image";
import Layout, { siteTitle } from "../components/layout";
import { getSortedPostsData, PostMeta } from "../lib/posts";
import { GetStaticProps } from "next";
import Header from "../components/header";
import PageGroup from "../components/PageGroup";
import RecentPosts from "../components/RecentPosts";
import wgpuWasmThumb from "../projects/wgpu-wasm-viewer/thumbnail.png";

const blockPadding = "py-6 lg:py-10";

function ProjectsBlock() {
  return (
    <div className={blockPadding}>
      <div className="flex items-baseline pb-6">
        <h3 className="font-body font-semibold text-primary dark:text-white text-2xl">
          Projects
        </h3>
      </div>
      <div>
        <a
          href="https://github.com/afiedler/wgpu-wasm-viewer"
          target="_blank"
          className="px-4 sm:px-6 py-4 border border-grey-lighter flex justify-between items-center mb-6"
        >
          <span className="pr-8">
            <Image src={wgpuWasmThumb} unoptimized />
          </span>
          <span className="pr-8">
            <h4 className="font-body font-semibold text-primary dark:text-white text-lg">
              WGPU-WASM viewer
            </h4>
            <p className="font-body font-light text-primary dark:text-white">
              A simple GLTF 3D viewer demonstrating the Rust packages{" "}
              <code>wgpu</code>, <code>egui</code>, and{" "}
              <code>wasm-bindgen</code>.
            </p>
          </span>
        </a>
      </div>
    </div>
  );
}

interface AllPostsProps {
  allPostsData: PostMeta[];
}

function RecentPostsBlock({ allPostsData }: AllPostsProps) {
  return (
    <div className={blockPadding}>
      <div className="flex items-baseline pb-6">
        <h3 className="font-body font-semibold text-primary dark:text-white text-2xl">
          Posts
        </h3>
        <a
          href="/posts"
          className="pl-10 font-body italic text-green dark:text-green-light transition-colors dark:hover:text-secondary hover:text-secondary"
        >
          All posts →
        </a>
      </div>
      <RecentPosts count={5} allPosts={allPostsData} />
    </div>
  );
}

export default function Home({ allPostsData }: AllPostsProps) {
  return (
    <Layout home>
      <Head>
        <title>{siteTitle}</title>
      </Head>

      <div id="main">
        <Header />
        <PageGroup>
          <div>
            <ProjectsBlock />
            <RecentPostsBlock allPostsData={allPostsData} />
          </div>
        </PageGroup>

        <PageGroup>
          <div className="flex flex-col sm:flex-row justify-between items-center border-t border-grey-lighter py-10 sm:py-12">
            <div className="flex flex-col sm:flex-row items-center mr-auto">
              <p className="font-body font-light text-primary dark:text-white pt-5 sm:pt-0">
                ©2021 Andy Fiedler.
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
