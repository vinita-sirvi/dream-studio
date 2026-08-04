import type { Metadata } from "next";

import { returnPolicy } from "@/data/policies";
import { PolicyPage } from "@/components/site/policy-page";

export const metadata: Metadata = {
  title: "Returns & Exchange",
  description: returnPolicy.intro,
};

export default function Page() {
  return <PolicyPage policy={returnPolicy} />;
}
