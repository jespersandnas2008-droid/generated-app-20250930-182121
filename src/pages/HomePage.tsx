import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { CheckCircle, Repeat, ShieldCheck, Zap } from "lucide-react";
import { motion, Variants } from "framer-motion";
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};
const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
    },
  },
};
const FeatureCard = ({ icon: Icon, title, description }: { icon: React.ElementType, title: string, description: string }) => (
  <motion.div
    className="p-6 bg-card rounded-xl border shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300"
    variants={itemVariants}
  >
    <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-primary/10 text-primary mb-4">
      <Icon className="h-6 w-6" />
    </div>
    <h3 className="text-lg font-semibold mb-2">{title}</h3>
    <p className="text-muted-foreground text-sm">{description}</p>
  </motion.div>
);
const PricingCard = ({ plan, price, features, primary = false }: { plan: string, price: string, features: string[], primary?: boolean }) => (
  <motion.div
    className={`p-8 rounded-2xl border ${primary ? 'bg-primary text-primary-foreground border-primary shadow-xl' : 'bg-card'}`}
    variants={itemVariants}
    whileHover={{ scale: 1.02, y: -5 }}
    transition={{ type: "spring", stiffness: 300 }}
  >
    <h3 className="text-lg font-semibold uppercase tracking-wider mb-2">{plan}</h3>
    <p className="text-4xl font-bold mb-4">{price}<span className={`text-sm font-normal ${primary ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>/month</span></p>
    <ul className="space-y-3 mb-8">
      {features.map((feature, i) => (
        <li key={i} className="flex items-center gap-3">
          <CheckCircle className={`h-5 w-5 ${primary ? 'text-primary-foreground/80' : 'text-primary'}`} />
          <span>{feature}</span>
        </li>
      ))}
    </ul>
    <Button asChild size="lg" className={`w-full ${primary ? 'bg-primary-foreground text-primary hover:bg-primary-foreground/90' : 'bg-primary text-primary-foreground hover:bg-primary/90'}`}>
      <Link to="/login">Get Started</Link>
    </Button>
  </motion.div>
);
export function HomePage() {
  return (
    <div className="bg-background text-foreground min-h-screen">
      <ThemeToggle className="fixed top-4 right-4" />
      <header className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2 text-xl font-bold font-display">
          <Repeat className="h-6 w-6 text-primary" />
          Ritual
        </Link>
        <nav className="flex items-center gap-4">
          <Button variant="ghost" asChild>
            <Link to="/login">Login</Link>
          </Button>
          <Button asChild className="transition-all duration-200 hover:shadow-lg hover:shadow-primary/20">
            <Link to="/login">Get Started</Link>
          </Button>
        </nav>
      </header>
      <main>
        {/* Hero Section */}
        <section className="text-center py-24 md:py-32 lg:py-40 max-w-4xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold font-display tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70">
              Build Habits That Last
            </h1>
            <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Ritual is a visually stunning and minimalist habit tracker designed to help you build better routines with elegance and focus.
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <Button asChild size="lg" className="text-lg px-8 py-6 transition-transform duration-200 hover:scale-105">
                <Link to="/login">Start for Free</Link>
              </Button>
            </div>
          </motion.div>
        </section>
        {/* Features Section */}
        <section className="py-16 md:py-24 bg-muted/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold font-display">Why Ritual?</h2>
              <p className="mt-4 text-muted-foreground">
                A better, more focused way to build the life you want.
              </p>
            </div>
            <motion.div
              className="mt-12 grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
            >
              <FeatureCard
                icon={Zap}
                title="Minimalist Design"
                description="A clean, uncluttered interface that helps you focus on what truly matters: your habits."
              />
              <FeatureCard
                icon={Repeat}
                title="Track Your Progress"
                description="Visualize your journey with beautiful charts and insightful statistics. Stay motivated by seeing how far you've come."
              />
              <FeatureCard
                icon={ShieldCheck}
                title="Elegant & Simple"
                description="No complex setups. Just pure, simple habit tracking that feels delightful to use every single day."
              />
            </motion.div>
          </div>
        </section>
        {/* Pricing Section */}
        <section className="py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold font-display">Simple, Transparent Pricing</h2>
              <p className="mt-4 text-muted-foreground">
                Choose the plan that's right for you.
              </p>
            </div>
            <motion.div
              className="mt-12 grid gap-8 grid-cols-1 lg:grid-cols-3 max-w-4xl mx-auto"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
            >
              <PricingCard
                plan="Free"
                price="$0"
                features={["Up to 3 habits", "Basic statistics", "Light & Dark mode"]}
              />
              <PricingCard
                plan="Pro"
                price="$5"
                features={["Unlimited habits", "Advanced statistics", "Push notifications", "PDF reports"]}
                primary
              />
               <PricingCard
                plan="Lifetime"
                price="$49"
                features={["Everything in Pro", "One-time payment", "Priority support", "Lifetime updates"]}
              />
            </motion.div>
          </div>
        </section>
      </main>
      <footer className="border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col sm:flex-row justify-between items-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Ritual. All rights reserved.</p>
          <p className="mt-4 sm:mt-0">Built with ❤��� at Cloudflare</p>
        </div>
      </footer>
    </div>
  );
}