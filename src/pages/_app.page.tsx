import { ChakraProvider } from "@chakra-ui/react";
import type { AppProps } from "next/app";
import { theme } from "@/pages/chakra/theme";
import Layout from "./components/Layout/Layout";
import { RecoilRoot } from "recoil";
import Head from "next/head";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <RecoilRoot>
      <ChakraProvider theme={theme}>
        <Head>
          {/* Set the title */}
          <title>ComiCraft : Arts Meet Community</title>
          
        
          
          {/* Optional: Meta tags for SEO and responsiveness */}
          <meta name="description" content="ComiCraft: A place where art meets community. Share and explore comics, art, and creativity!" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
        </Head>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </ChakraProvider>
    </RecoilRoot>
  );
}

export default MyApp;
