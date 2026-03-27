import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Mail,
  Zap,
  Shield,
  Code,
  CheckCircle,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { Link } from "wouter";

export default function Home() {
  const features = [
    {
      icon: Mail,
      title: "Email Sending",
      description: "Send emails with HTML and plain text support, custom headers, and flexible recipient options.",
      color: "from-blue-500 to-blue-600",
    },
    {
      icon: Zap,
      title: "Verification Codes",
      description: "Generate and send verification codes with automatic expiration and one-time use validation.",
      color: "from-purple-500 to-purple-600",
    },
    {
      icon: Shield,
      title: "Secure & Reliable",
      description: "Gmail SMTP integration with comprehensive error handling and email delivery logging.",
      color: "from-emerald-500 to-emerald-600",
    },
    {
      icon: Code,
      title: "Developer Friendly",
      description: "RESTful API with clear documentation, type-safe endpoints, and interactive playground.",
      color: "from-orange-500 to-orange-600",
    },
  ];

  const capabilities = [
    "Send emails to multiple recipients",
    "Support for CC and BCC recipients",
    "HTML and plain text content",
    "Custom email headers",
    "Verification code generation",
    "Email delivery tracking",
    "Request validation and error handling",
    "Comprehensive API documentation",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg">
              <Mail className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-900">Email API</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/documentation">
              <Button variant="ghost" className="text-slate-700 hover:text-slate-900">
                Documentation
              </Button>
            </Link>
            <Link href="/playground">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                Try Playground
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full mb-6">
            <Sparkles className="h-4 w-4" />
            <span className="text-sm font-semibold">Professional Email API Service</span>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight">
            Send Emails with
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {" "}
              Elegance & Power
            </span>
          </h1>

          <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            A production-ready email API service built with Node.js and Nodemailer. Send emails, generate verification
            codes, and track delivery—all with a beautiful, intuitive interface.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/playground">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
                Start Testing <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/documentation">
              <Button size="lg" variant="outline" className="border-slate-300 text-slate-700">
                View Documentation
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="pt-6">
                  <div className={`inline-flex p-3 rounded-lg bg-gradient-to-br ${feature.color} mb-4`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">{feature.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Capabilities Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20 items-center">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Powerful Capabilities</h2>
            <p className="text-lg text-slate-600 mb-8">
              Everything you need to build a professional email system. From simple notifications to complex verification
              flows, our API handles it all.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {capabilities.map((capability, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-700">{capability}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl blur-2xl opacity-20"></div>
            <Card className="relative border-0 shadow-2xl overflow-hidden">
              <CardHeader className="bg-gradient-to-br from-slate-900 to-slate-800 text-white">
                <CardTitle className="font-mono text-sm">API Response Example</CardTitle>
              </CardHeader>
              <CardContent className="pt-6 bg-slate-950 text-slate-100 font-mono text-sm overflow-x-auto">
                <pre>{`{
  "success": true,
  "messageId": "<msg@gmail.com>",
  "logId": 42,
  "message": "Email sent successfully"
}`}</pre>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* API Endpoints Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 mb-20">
          <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">API Endpoints</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border-l-4 border-emerald-500 pl-6">
              <div className="flex items-center gap-2 mb-2">
                <Badge className="bg-emerald-100 text-emerald-700">POST</Badge>
                <code className="text-sm font-mono text-slate-700">/api/trpc/email.send</code>
              </div>
              <p className="text-slate-600">Send an email with custom headers and content</p>
            </div>

            <div className="border-l-4 border-purple-500 pl-6">
              <div className="flex items-center gap-2 mb-2">
                <Badge className="bg-purple-100 text-purple-700">POST</Badge>
                <code className="text-sm font-mono text-slate-700">/api/trpc/email.sendVerificationCode</code>
              </div>
              <p className="text-slate-600">Generate and send a verification code</p>
            </div>

            <div className="border-l-4 border-orange-500 pl-6">
              <div className="flex items-center gap-2 mb-2">
                <Badge className="bg-orange-100 text-orange-700">POST</Badge>
                <code className="text-sm font-mono text-slate-700">/api/trpc/email.verifyCode</code>
              </div>
              <p className="text-slate-600">Verify a previously sent verification code</p>
            </div>

            <div className="border-l-4 border-indigo-500 pl-6">
              <div className="flex items-center gap-2 mb-2">
                <Badge className="bg-indigo-100 text-indigo-700">GET</Badge>
                <code className="text-sm font-mono text-slate-700">/api/trpc/email.getLogs</code>
              </div>
              <p className="text-slate-600">Retrieve email sending history and logs</p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-lg p-12 text-center text-white mb-20">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-lg mb-8 opacity-90">
            Test the API playground or explore the full documentation to integrate email into your application.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/playground">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-slate-100">
                Try Playground <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/documentation">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                Read Documentation
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-8 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-slate-800 rounded-lg">
                <Mail className="h-4 w-4 text-blue-400" />
              </div>
              <span className="font-semibold text-slate-300">Email API</span>
            </div>
            <p className="text-sm">
              Built with <span className="text-red-400">❤</span> using Node.js, Nodemailer & React
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
