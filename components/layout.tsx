import Head from "next/head";
import Image from "next/image";
import Link from "next/link";

const name = "[Your Name]";
export const siteTitle = "Next.js Sample Website";

export default function Layout({
  children,
  home,
}: {
  children: React.ReactNode;
  home?: boolean;
}) {
  return (
    <>
      <Head>
        <meta name="description" content="Andy Fiedler's Personal Site" />
      </Head>
      {children}
    </>
  );
}
