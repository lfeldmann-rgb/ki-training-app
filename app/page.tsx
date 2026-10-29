// The salespage for KI-Praxis — the route `/`.
//
// Built by the skill `salespage` from the approved deck
// docs/marketing/salespage-de.md (voice: docs/marketing/voice.md). Every
// visible sentence is a `home.*` key in every messages/<code>.json; the price
// comes from the registry through formatPrice(), never as text.
//
// Sections, in the agreed order: hero · problem → promise · benefits · what
// you get (#inside) · who is behind it · the offer (#offer) · FAQ · final CTA.
//
// ⚠️ The width wrapper `mx-auto w-full max-w-5xl px-4 sm:px-6` is the one
// PublicHeader uses, so the headline and the header's brand mark share a left
// edge (the shipped page measured why).
//
// The buy button follows app/plans/page.tsx: signed out, the shared cached
// link from checkoutLinksFor(); signed in, the click-time action that carries
// the member's identity; and a sentence instead of a button whenever a
// blocker says there is no working checkout — never a dead link.
import { getLocale, getTranslations } from "next-intl/server";
import { ArrowRight, Check, Clock, MessageSquareText, PhoneCall } from "lucide-react";

import { auth } from "@/auth";
import { PublicHeader } from "@/components/public-header";
import { SiteFooter } from "@/components/site-footer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Callout } from "@/components/ui/callout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Figure } from "@/components/ui/figure";
import {
  blockerFor,
  checkoutBlockersFor,
  checkoutLinksFor,
  offerRef,
} from "@/lib/digistore/checkout";
import { formatPrice, paymentOptionsOf, sellableProducts } from "@/lib/digistore/products";
import { hasDigistoreApiKey } from "@/lib/digistore/settings";
import { publicCovers } from "@/lib/practice/covers";
import { practiceTopics } from "@/lib/practice/manage";

import { startCheckoutAction } from "./plans/actions";

// The covers are 1280×853 WebP (content/media/ki-praxis/).
const COVER = { width: 1280, height: 853 } as const;

// Each benefit hangs on the feature that delivers it — the icon means what it
// sits next to (docs/salespage.md § 3).
const BENEFITS = [
  { key: "calls", icon: PhoneCall },
  { key: "replies", icon: MessageSquareText },
  { key: "delegate", icon: Clock },
] as const;

// One per row of the confirmed feature list, every row.
const FEATURES = ["course", "selfCheck", "game", "practice", "assistant"] as const;
const STACK = ["stack1", "stack2", "stack3", "stack4", "stack5"] as const;
const FAQ = ["basics", "time", "fit", "aiCost", "subscription", "seller"] as const;

const PRODUCT_KEY = "ki_praxis";

export default async function Home() {
  const t = await getTranslations("home");
  const tPlans = await getTranslations("plans");
  const locale = await getLocale();
  const signedIn = Boolean((await auth())?.user);

  const topics = await practiceTopics();
  const covers = await publicCovers(topics.map((topic) => topic.slug));
  const heroCover = topics[0] ? covers.get(topics[0].slug) : undefined;

  // The one product this page argues for.
  const def = sellableProducts().find((d) => d.key === PRODUCT_KEY) ?? null;
  const option = def ? paymentOptionsOf(def)[0] : undefined;
  const ref = def && option ? offerRef(def.key, option.key) : null;
  let buy: { blocker: string | null; url: string | null } = { blocker: "error", url: null };
  if (def && ref) {
    if (signedIn) {
      buy = { blocker: blockerFor(await checkoutBlockersFor([def]), ref), url: null };
    } else {
      const link = (await checkoutLinksFor([def], {}, locale)).get(ref);
      buy = link ? { blocker: link.blocker ?? null, url: link.url } : buy;
    }
  }

  return (
    <>
      <PublicHeader />

      <main>
        {/* 1 · Hero */}
        <section className="py-16 sm:py-24">
          <div className="mx-auto grid w-full max-w-5xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2">
            <div>
              <Badge variant="secondary" className="mb-5">
                {t("badge")}
              </Badge>
              <h1 className="text-4xl font-semibold text-balance sm:text-5xl">{t("title")}</h1>
              <p className="text-muted-foreground mt-5 max-w-xl text-lg text-pretty">{t("subtitle")}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button asChild size="lg">
                  <a href="#offer">
                    {t("buy")}
                    <ArrowRight aria-hidden />
                  </a>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <a href="#inside">{t("inside")}</a>
                </Button>
              </div>
            </div>
            {heroCover ? (
              <Figure
                src={heroCover.src}
                width={COVER.width}
                height={COVER.height}
                alt={heroCover.alt}
                priority
                sizes="(min-width: 1024px) 480px, 100vw"
                className="overflow-hidden rounded-xl border"
              />
            ) : null}
          </div>
        </section>

        <div className="mx-auto w-full max-w-5xl px-4 sm:px-6">
          {/* 2 · Problem → promise */}
          <section className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-semibold text-balance sm:text-3xl">{t("problem.title")}</h2>
            <p className="text-muted-foreground mt-4 text-lg">{t("problem.pain")}</p>
            <p className="mt-4 text-lg font-medium">{t("problem.promise")}</p>
          </section>

          {/* 3 · Benefits */}
          <section className="mt-24">
            <h2 className="text-center text-2xl font-semibold sm:text-3xl">{t("benefits.title")}</h2>
            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {BENEFITS.map(({ key, icon: Icon }) => (
                <Card key={key}>
                  <CardHeader>
                    <Icon aria-hidden className="text-primary mb-2 size-5" />
                    <CardTitle>{t(`benefits.${key}.title`)}</CardTitle>
                    <CardDescription>{t(`benefits.${key}.body`)}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </section>

          {/* 4 · What you get — every feature by its name in the app */}
          <section id="inside" className="mt-24 scroll-mt-24">
            <h2 className="text-center text-2xl font-semibold sm:text-3xl">{t("features.title")}</h2>
            <ul className="mx-auto mt-10 grid max-w-3xl gap-x-8 gap-y-5 sm:grid-cols-2">
              {FEATURES.map((key) => (
                <li key={key} className="flex gap-3">
                  <Check aria-hidden className="text-primary mt-1 size-4 shrink-0" />
                  <p>
                    <span className="font-semibold">{t(`features.${key}.name`)}</span>
                    {": "}
                    <span className="text-muted-foreground">{t(`features.${key}.line`)}</span>
                  </p>
                </li>
              ))}
            </ul>

            {topics.length > 0 ? (
              <>
                <h3 className="mt-14 text-center text-xl font-semibold">{t("features.lessonsTitle")}</h3>
                <ol className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {topics.map((topic, index) => {
                    const cover = covers.get(topic.slug);
                    return (
                      <li key={topic.slug}>
                        <Card className="h-full gap-0 overflow-hidden p-0">
                          {cover ? (
                            <Figure
                              src={cover.src}
                              width={COVER.width}
                              height={COVER.height}
                              alt={cover.alt}
                              sizes="(min-width: 1024px) 320px, (min-width: 640px) 50vw, 100vw"
                            />
                          ) : null}
                          <CardContent className="p-4">
                            <p className="text-muted-foreground text-sm">{index + 1}.</p>
                            <p className="font-medium">{topic.title}</p>
                          </CardContent>
                        </Card>
                      </li>
                    );
                  })}
                </ol>
              </>
            ) : null}
          </section>

          {/* 5 · Who is behind it — the founder line, no invented proof */}
          <section className="mx-auto mt-24 max-w-2xl">
            <Card>
              <CardHeader>
                <CardTitle level="h2">{t("founder.title")}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg">{t("founder.body")}</p>
              </CardContent>
            </Card>
          </section>

          {/* 6 · The offer — ONE product, the price from the registry */}
          <section id="offer" className="mx-auto mt-24 max-w-md scroll-mt-24">
            {!hasDigistoreApiKey() ? (
              <Callout variant="info" className="mb-4">
                {t("setupHint")}
              </Callout>
            ) : null}
            <Card className="border-primary">
              <CardContent className="flex flex-col gap-4 pt-6">
                <h2 className="text-2xl font-semibold">{def?.name}</h2>
                {def ? (
                  <p className="flex flex-wrap items-baseline gap-2">
                    <span className="text-4xl font-semibold">{formatPrice(def, locale)}</span>
                    <span className="text-muted-foreground text-sm">{t("offer.once")}</span>
                  </p>
                ) : null}
                <ul className="flex flex-col gap-2 text-sm">
                  {STACK.map((key) => (
                    <li key={key} className="flex gap-2">
                      <Check aria-hidden className="text-primary mt-0.5 size-4 shrink-0" />
                      <span>{t(`offer.${key}`)}</span>
                    </li>
                  ))}
                </ul>
                {buy.blocker ? (
                  <p className="text-muted-foreground rounded-lg border border-dashed p-3 text-center text-sm">
                    {tPlans(`blocked_${buy.blocker}`)}
                  </p>
                ) : signedIn ? (
                  <form action={startCheckoutAction}>
                    <input type="hidden" name="planKey" value={def!.key} />
                    <input type="hidden" name="optionKey" value={option!.key} />
                    <Button type="submit" size="lg" className="w-full">
                      {t("buy")}
                    </Button>
                  </form>
                ) : buy.url ? (
                  <Button asChild size="lg" className="w-full">
                    <a href={buy.url}>{t("buy")}</a>
                  </Button>
                ) : null}
                <p className="text-muted-foreground text-sm">{t("offer.withdrawal")}</p>
                <p className="text-muted-foreground text-sm">{t("offer.seller")}</p>
                <p className="text-muted-foreground text-sm">{t("offer.after")}</p>
              </CardContent>
            </Card>
          </section>

          {/* 7 · FAQ */}
          <section className="mx-auto mt-24 max-w-2xl">
            <h2 className="text-center text-2xl font-semibold">{t("faq.title")}</h2>
            <Accordion type="single" collapsible className="mt-8">
              {FAQ.map((key) => (
                <AccordionItem key={key} value={key}>
                  <AccordionTrigger>{t(`faq.${key}.q`)}</AccordionTrigger>
                  <AccordionContent>{t(`faq.${key}.a`)}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </section>

          {/* 8 · Final CTA */}
          <section className="bg-primary/5 mt-24 mb-16 rounded-xl px-6 py-12 text-center">
            <h2 className="text-2xl font-semibold text-balance">{t("finalCta.title")}</h2>
            <Button asChild size="lg" className="mt-6">
              <a href="#offer">{t("buy")}</a>
            </Button>
          </section>
        </div>
      </main>

      <SiteFooter />
    </>
  );
}
