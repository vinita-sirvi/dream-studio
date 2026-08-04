import type { Metadata } from "next";

import { termsPolicy } from "@/data/policies";
import { PolicyPage } from "@/components/site/policy-page";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: termsPolicy.intro,
};

export default function Page() {
  return <PolicyPage policy={termsPolicy} />;
}
