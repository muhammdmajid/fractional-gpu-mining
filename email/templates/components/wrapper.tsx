import {
  Body,
  Container,
  Head,
  Html,
  Tailwind,
  Preview,
  Section,
} from "@react-email/components";
import Footer from "./footer";
import { Header } from "./header";
import { SEO_CONFIG } from "@/config/index";


interface WrapperProps {
  children: React.ReactNode;
  previewText?: string;
  title?: string;
  url?: string;
}

export const Wrapper = ({
  children,
  previewText = "You have a new message from our team.",
  title = "Notification",
  url,
}: WrapperProps) => {
  const effectiveBaseUrl = url || SEO_CONFIG.seo.baseUrl;

  return (
    <Tailwind>
      <Html>
        <Head>
          <title>{title}</title>
        </Head>
        <Preview>{previewText}</Preview>

        <Body className="bg-[#f3f4f8] text-[#0a0a0a] font-sans m-0 p-0 min-w-[600px]">
          <Container className="max-w-[600px] mx-auto">
            <Section className="pt-12 w-full">
              <Section className="bg-white rounded-lg shadow-md overflow-hidden w-full">
                <Header url={effectiveBaseUrl} />
                {children}
              </Section>
            </Section>
            <Footer url={effectiveBaseUrl} />
          </Container>
        </Body>
      </Html>
    </Tailwind>
  );
};
export default Wrapper;
