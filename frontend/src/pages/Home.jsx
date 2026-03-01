import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  Search,
  Shield,
  Users,
  MapPin,
  Bell,
  Trophy,
  ArrowRight,
  Sparkles,
  ChevronRight,
} from "lucide-react";

const Home = () => {
  const { user } = useAuth();

  const features = [
    {
      icon: <Search className="w-6 h-6" />,
      title: "Report Lost Items",
      desc: "Quickly post details about your lost belongings with photos and location.",
      gradient: "from-primary-500 to-accent-500",
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      title: "Found Items Board",
      desc: "Browse items found across campus and claim what belongs to you.",
      gradient: "from-emerald-500 to-teal-500",
    },
    {
      icon: <Bell className="w-6 h-6" />,
      title: "Instant Notifications",
      desc: "Get notified when someone finds an item matching your description.",
      gradient: "from-amber-500 to-orange-500",
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Secure Verification",
      desc: "Verified student accounts ensure trust and accountability.",
      gradient: "from-violet-500 to-purple-500",
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Community Driven",
      desc: "Built by students, for students — connect and help each other.",
      gradient: "from-pink-500 to-rose-500",
    },
    {
      icon: <Trophy className="w-6 h-6" />,
      title: "Earn Rewards",
      desc: "Gain points for helping return lost items — climb the leaderboard!",
      gradient: "from-yellow-500 to-amber-500",
    },
  ];

  const stats = [
    { value: "250+", label: "Items Returned" },
    { value: "1,000+", label: "Active Students" },
    { value: "99%", label: "Recovery Rate" },
    { value: "50+", label: "Campus Buildings" },
  ];

  return (
    <div className="min-h-screen bg-surface text-surface-dark overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4">
        {/* Background effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-100/60 rounded-full blur-[128px]" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-400/10 rounded-full blur-[128px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-50/80 rounded-full blur-[200px]" />
        </div>

        <div className="relative max-w-7xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 border border-primary-200/50 rounded-full mb-8">
            <Sparkles className="w-4 h-4 text-primary-500" />
            <span className="text-sm text-primary-700 font-medium">
              University Lost & Found Platform
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight mb-6 text-surface-dark">
            Lost Something?
            <br />
            <span className="bg-gradient-to-r from-primary-500 via-accent-500 to-primary-500 bg-clip-text text-transparent">
              We'll Bring It Back
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed">
            Back2U is a campus-based web platform for reporting lost and found
            items, verifying ownership, and coordinating safe returns all in one
            trusted space designed for students.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {user ? (
              <Link
                to={user.role === "admin" ? "/admin" : "/dashboard"}
                className="group px-8 py-4 bg-gradient-to-r from-primary-500 to-accent-500 rounded-xl font-semibold text-lg text-white hover:from-primary-600 hover:to-accent-600 transition-all shadow-xl shadow-primary-500/20 hover:shadow-primary-500/30 flex items-center gap-2"
              >
                Go to Dashboard
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            ) : (
              <>
                <Link
                  to="/register"
                  className="group px-8 py-4 bg-gradient-to-r from-primary-500 to-accent-500 rounded-xl font-semibold text-lg text-white hover:from-primary-600 hover:to-accent-600 transition-all shadow-xl shadow-primary-500/20 hover:shadow-primary-500/30 flex items-center gap-2"
                >
                  Get Started Free
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/login"
                  className="px-8 py-4 bg-white border border-gray-200 rounded-xl font-semibold text-lg text-surface-dark hover:bg-gray-50 transition-all shadow-sm"
                >
                  Sign In
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="relative py-16 px-4 border-y border-gray-200/60">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-primary-500 to-accent-500 bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="relative py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-surface-dark">
              Everything You Need to{" "}
              <span className="bg-gradient-to-r from-primary-500 to-accent-500 bg-clip-text text-transparent">
                Find & Return
              </span>
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              A powerful set of tools designed to help the campus community
              recover lost belongings quickly and securely.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <div
                key={i}
                className="group p-6 bg-white border border-gray-200/60 rounded-2xl hover:shadow-lg hover:shadow-primary-500/5 hover:border-primary-200/60 transition-all duration-300"
              >
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${f.gradient} flex items-center justify-center mb-4 shadow-md text-white group-hover:scale-110 transition-transform`}
                >
                  {f.icon}
                </div>
                <h3 className="text-lg font-semibold mb-2 text-surface-dark">
                  {f.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="relative p-12 bg-gradient-to-br from-primary-500 to-accent-500 rounded-3xl text-center overflow-hidden shadow-2xl shadow-primary-500/20">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.15),transparent)]" />
            <div className="relative">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-white">
                Ready to Join the Community?
              </h2>
              <p className="text-primary-100 max-w-lg mx-auto mb-8">
                Sign up now and help make your campus a place where nothing
                stays lost for long.
              </p>
              {!user && (
                <Link
                  to="/register"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-white text-primary-600 rounded-xl font-semibold text-lg hover:bg-primary-50 transition-all shadow-xl"
                >
                  Create Your Account
                  <ChevronRight className="w-5 h-5" />
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200/60 py-12 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
              <Search className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold bg-gradient-to-r from-primary-500 to-accent-500 bg-clip-text text-transparent">
              Back2U
            </span>
          </div>
          <p className="text-sm text-gray-400">
            © 2026 Back2U. Built for students, by students.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
