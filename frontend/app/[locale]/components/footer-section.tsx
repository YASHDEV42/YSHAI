"use client";

type FooterText = {
  description: string;
  product: {
    title: string;
    features: string;
    pricing: string;
    api: string;
    integrations: string;
  };
  company: {
    title: string;
    about: string;
    blog: string;
    careers: string;
    contact: string;
  };
  legal: {
    title: string;
    privacy: string;
    terms: string;
    security: string;
  };
  copyright: string;
};

export const FooterSection = ({ locale, text }: { locale: string; text: FooterText }) => {
  return (
    <footer
      className="border-t border-border/40 mt-20"
      dir={locale === "ar" ? "rtl" : "ltr"}
    >
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">Y</span>
              </div>
              <span className="text-xl font-bold">YSHAI</span>
            </div>
            <p className="text-sm text-muted-foreground">{text.description}</p>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-semibold mb-4">{text.product.title}</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-foreground transition-colors">{text.product.features}</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">{text.product.pricing}</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">{text.product.api}</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">{text.product.integrations}</a></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold mb-4">{text.company.title}</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-foreground transition-colors">{text.company.about}</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">{text.company.blog}</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">{text.company.careers}</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">{text.company.contact}</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold mb-4">{text.legal.title}</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-foreground transition-colors">{text.legal.privacy}</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">{text.legal.terms}</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">{text.legal.security}</a></li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-border/40 mt-12 pt-8 text-center text-sm text-muted-foreground">
          {text.copyright}
        </div>
      </div>
    </footer>
  );
};
