import MaxWidthWrapper from "@/components/max-width-wrapper";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function UnauthorizedPage() {
  return (
    <MaxWidthWrapper>
      <h1 className="text-2xl">Access Denied</h1>
      <p className="my-6 ">
        You are not authenticated to access this page. Please do it
        access or return to <strong>home</strong>.
      </p>
      <Button asChild>
        <Link href="/proposals">Home</Link>
      </Button>
    </MaxWidthWrapper>
  );
}
