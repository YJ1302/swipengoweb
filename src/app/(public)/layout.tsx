import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Preloader } from "@/components/ui/Preloader";
import { LoadingProvider } from "@/components/providers/LoadingProvider";
import { MobileCTA } from "@/components/ui/MobileCTA";

export default function PublicLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <LoadingProvider>
            <Preloader />
            <Header />
            <main className="pb-20 md:pb-0">{children}</main>
            <Footer />
            <MobileCTA />
        </LoadingProvider>
    );
}
