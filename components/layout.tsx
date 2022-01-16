import Head from "next/head";

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
