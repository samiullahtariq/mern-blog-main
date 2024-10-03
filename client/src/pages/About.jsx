import React from "react";
import { Helmet } from "react-helmet";

export default function About() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Helmet>
    <title>About PluseUp: Who are we and what is our mission - PluseUp</title>
    <meta name="description" content="At PluseUp, we are provide SEO solutions focused on boosting online visibility and driving long-term growth."/>
    <link rel="canonical" href="https://www.pluseup.com/about" />
    <meta name="robots" content="index, follow" />
   </Helmet>
      <div className="max-w-2xl mx-auto p-3">
        <div>
          <h1 className="text-3xl font-semibold text-center my-7">
            About PluseUp
          </h1>
          <div className="text-md flex flex-col gap-6">
            <p className="text-gray-500">
              At PluseUp, we specialize in providing cutting-edge SEO solutions
              that deliver real results. With a deep understanding of search
              engine algorithms, digital trends, and user behavior, we are
              committed to helping businesses achieve sustainable growth through
              strategic, data-driven SEO.
            </p>

            <h1 className="text-2xl font-semibold text-center">Who We Are</h1>
            <p className="text-gray-500">
              We are a team of passionate SEO professionals dedicated to
              optimizing websites and increasing online visibility. Our
              expertise covers the full spectrum of SEO—technical optimization,
              content strategy, on-page and off-page strategy, and data
              analysis. We pride ourselves on staying ahead of industry changes,
              ensuring our clients always benefit from the latest SEO practices
              and Google updates.
            </p>

            <h1 className="text-xl font-semibold text-center">Our Mission</h1>
            <p className="text-gray-500">
              Our mission is to empower businesses by expanding their
              online presence and driving meaningful, lasting growth. We're more
              than just an SEO service provider—we're a partner invested in your
              success.
            </p>
            <br/>
          </div>
        </div>
      </div>
    </div>
  );
}
