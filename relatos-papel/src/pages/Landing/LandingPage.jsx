import Head from "../../components/utils/HeadLanding";
import LandingHeader from "../../components/layout/LandingHeader";
import LandingHero from "../../components/landing/LandingHero";
import { useLangRouting } from "../../hooks/useLangRouting";
import { useCountdownRedirect } from "../../hooks/useCountdownRedirect";
import { useTranslation } from "react-i18next";
import { APP_ORIGIN } from "../../constants/env";
import "../../assets/css/styles-landing.css";

export default function LandingPage() {
    const { lang } = useLangRouting();
    const { t } = useTranslation("landing");

    const canonical = `${APP_ORIGIN}/${lang}/`;

    const { remaining, cancelled } = useCountdownRedirect({
        seconds: 5,
        to: `/${lang}/catalog`,
        enabled: true
    });

    return (
        <>
            <Head
                lang={lang}
                title={t("seo.title")}
                description={t("seo.description")}
                keywords={t("seo.keywords")}
                canonical={canonical}
                ogImage={`${canonical}assets/img/og-landing.jpg`}
                siteName="Librería dígital"
                locale={lang === "es" ? "es_EC" : "en_US"}
            />

            <div className="landing landing--full landing--page">
                <LandingHeader />
                <main id="main" className="landing__main">
                    <LandingHero lang={lang} />
                </main>
            </div>
        </>
    );
}