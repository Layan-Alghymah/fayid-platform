import { Link } from "wouter";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Construction } from "lucide-react";

type ComingSoonProps = {
  title: string;
  description: string;
};

export default function ComingSoon({ title, description }: ComingSoonProps) {
  return (
    <Layout>
      <div className="max-w-lg mx-auto px-4 py-24 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 mb-6">
          <Construction className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-3xl font-extrabold mb-3">{title}</h1>
        <p className="text-muted-foreground leading-relaxed mb-8">{description}</p>
        <Link href="/products">
          <Button size="lg" className="gap-2">
            <ArrowLeft className="w-5 h-5" />
            تصفح المنتجات
          </Button>
        </Link>
      </div>
    </Layout>
  );
}
