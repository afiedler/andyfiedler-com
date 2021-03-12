import "tailwindcss/tailwind.css";
import "prism-themes/themes/prism-vsc-dark-plus.css";
import { AppProps } from "next/app";

function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default App;
