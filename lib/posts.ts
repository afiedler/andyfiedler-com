import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";
import prism from "remark-prism";

export type PostMeta = {
  id: string;
  title: string;
  date: string;
};

const postsDirectory = path.join(process.cwd(), "posts");

export function getSortedPostsData(): PostMeta[] {
  // Get file names under /posts
  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = fileNames.map((fileName) => {
    // Remove ".md" and date from file name to get id
    const id = fileName
      .replace(/\.md$/, "")
      .replace(/^\d{4}\-\d{2}\-\d{2}\-/, "");

    // Read markdown file as string
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, "utf8");

    // Use gray-matter to parse the post metadata section
    const matterResult = matter(fileContents);

    // Combine the data with the id
    return {
      id,
      ...matterResult.data,
    } as PostMeta;
  });

  // Check for duplicate IDs
  const uniqIds = new Set();
  for (const p of allPostsData) {
    if (uniqIds.has(p.id)) throw new Error("duplicate post ID: " + p.id);
    uniqIds.add(p.id);
  }

  // Sort posts by date
  return allPostsData.sort((a, b) => {
    if (a.date < b.date) {
      return 1;
    } else {
      return -1;
    }
  });
}

export function getAllPostIds() {
  const fileNames = fs.readdirSync(postsDirectory);
  return fileNames.map((fileName) => {
    const id = fileName
      .replace(/\.md$/, "")
      .replace(/^\d{4}\-\d{2}\-\d{2}\-/, "");
    return {
      params: {
        id,
      },
    };
  });
}

export async function getPostData(id) {
  const fileNames = fs.readdirSync(postsDirectory);
  const fileName = fileNames.find((file) => {
    const fileId = file
      .replace(/\.md$/, "")
      .replace(/^\d{4}\-\d{2}\-\d{2}\-/, "");
    return fileId === id;
  });
  const fullPath = path.join(postsDirectory, fileName);
  const fileContents = fs.readFileSync(fullPath, "utf8");

  // Use gray-matter to parse the post metadata section
  const matterResult = matter(fileContents);

  // Use remark to convert markdown into HTML string
  const processedContent = await remark()
    .use(html)
    .use(prism)
    .process(matterResult.content);
  const contentHtml = processedContent.toString();

  // Combine the data with the id and contentHtml
  return {
    id,
    contentHtml,
    ...matterResult.data,
  };
}
