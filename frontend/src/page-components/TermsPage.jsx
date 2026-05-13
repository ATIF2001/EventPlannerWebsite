"use client";

import Link from "next/link";
import Seo from "../components/Seo";
import { useSiteContent } from "../hooks/useSiteContent";
import page01 from "../assets/TermsAndConditions/mk-highlight-page-01.jpg";
import page02 from "../assets/TermsAndConditions/mk-highlight-page-02.jpg";
import page03 from "../assets/TermsAndConditions/mk-highlight-page-03.jpg";
import page04 from "../assets/TermsAndConditions/mk-highlight-page-04.jpg";
import page05 from "../assets/TermsAndConditions/mk-highlight-page-05.jpg";
import page06 from "../assets/TermsAndConditions/mk-highlight-page-06.jpg";
import page07 from "../assets/TermsAndConditions/mk-highlight-page-07.jpg";
import page08 from "../assets/TermsAndConditions/mk-highlight-page-08.jpg";
import page09 from "../assets/TermsAndConditions/mk-highlight-page-09.jpg";
import page10 from "../assets/TermsAndConditions/mk-highlight-page-10.jpg";
import page11 from "../assets/TermsAndConditions/mk-highlight-page-11.jpg";
import page12 from "../assets/TermsAndConditions/mk-highlight-page-12.jpg";
import page13 from "../assets/TermsAndConditions/mk-highlight-page-13.jpg";
import page14 from "../assets/TermsAndConditions/mk-highlight-page-14.jpg";
import page15 from "../assets/TermsAndConditions/mk-highlight-page-15.jpg";
import page16 from "../assets/TermsAndConditions/mk-highlight-page-16.jpg";
import page17 from "../assets/TermsAndConditions/mk-highlight-page-17.jpg";
import page18 from "../assets/TermsAndConditions/mk-highlight-page-18.jpg";
import page19 from "../assets/TermsAndConditions/mk-highlight-page-19.jpg";

const pages = [
  page01,
  page02,
  page03,
  page04,
  page05,
  page06,
  page07,
  page08,
  page09,
  page10,
  page11,
  page12,
  page13,
  page14,
  page15,
  page16,
  page17,
  page18,
  page19,
];

function TermsPage() {
  const { getText } = useSiteContent();

  return (
    <main className="min-h-screen bg-[#05070b] px-6 pb-20 pt-80 text-white md:px-12">
      <Seo
        title={getText("seo.terms.title", "Terms & Conditions | MK Wedding Planner")}
        description={getText(
          "seo.terms.description",
          "Read the terms and conditions for using MK Wedding Planner services and website."
        )}
        keywords={getText("seo.terms.keywords", "terms and conditions, legal, policy")}
        path="/terms-and-conditions"
      />

      <div className="mx-auto max-w-4xl">
        <p className="text-white/70">
          <Link href="/" className="hover:underline">
            Home
          </Link>{" "}
          | Terms & Conditions
        </p>

        <h1 className="mt-4 text-4xl font-light md:text-6xl">Terms & Conditions</h1>

        <div className="mt-10 space-y-3">
          {pages.map((src, index) => (
            <img
              key={index}
              src={src}
              alt={`Terms and conditions page ${index + 1}`}
              className="w-full rounded-sm shadow-lg"
              loading={index < 3 ? "eager" : "lazy"}
            />
          ))}
        </div>
      </div>
    </main>
  );
}

export default TermsPage;

