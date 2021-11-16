import Head from "next/head";
import Image from "next/image";
import Link from "next/link";

export const siteTitle = "Andy Fiedler";

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
