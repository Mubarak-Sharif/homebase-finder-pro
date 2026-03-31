import { Shield, TrendingUp, Users, Headphones } from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "Verified Listings",
    description: "Every property is verified by our team to ensure authenticity and accuracy.",
  },
  {
    icon: TrendingUp,
    title: "Market Insights",
    description: "Get real-time market data and price trends to make informed investment decisions.",
  },
  {
    icon: Users,
    title: "Trusted Agents",
    description: "Connect with certified agents who provide professional guidance throughout.",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    description: "Our dedicated support team is always ready to help with any queries or concerns.",
  },
];

const WhyChooseUs = () => {
  return (
    <section className="py-20 bg-secondary">
      <div className="container mx-auto px-4 text-center">
        <p className="text-primary font-medium text-sm tracking-widest uppercase mb-2">Why Choose Us</p>
        <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-12">
          The Smart Way to Find Property
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, i) => (
            <div
              key={feature.title}
              className="bg-card rounded-xl p-6 text-center shadow-sm hover:shadow-md transition-shadow animate-fade-in"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <feature.icon className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-heading font-semibold text-lg text-card-foreground mb-2">{feature.title}</h3>
              <p className="text-muted-foreground text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
