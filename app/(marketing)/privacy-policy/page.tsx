import type { Metadata } from "next";

import { privacyPolicy } from "@/data/policies";
import { PolicyPage } from "@/components/site/policy-page";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: privacyPolicy.intro,
};

export default function Page() {
  return <PolicyPage policy={privacyPolicy} />;
}
