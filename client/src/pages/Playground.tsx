import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle, Loader2, Mail } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

type ResponseLog = {
  id: string;
  type: "send" | "verify" | "verify-code";
  status: "success" | "error" | "loading";
  message: string;
  data?: any;
  timestamp: Date;
};

export default function Playground() {
  const [activeTab, setActiveTab] = useState("send");
  const [logs, setLogs] = useState<ResponseLog[]>([]);

  // Send Email Form
  const [sendForm, setSendForm] = useState({
    to: "",
    from: "",
    subject: "",
    text: "",
    html: "",
    cc: "",
    bcc: "",
  });

  // Verification Code Form
  const [verifyForm, setVerifyForm] = useState({
    email: "",
    subject: "",
    codeLength: 6,
  });

  // Verify Code Form
  const [verifyCodeForm, setVerifyCodeForm] = useState({
    email: "",
    code: "",
  });

  // API Mutations
  const sendEmailMutation = trpc.email.send.useMutation();
  const sendVerificationCodeMutation = trpc.email.sendVerificationCode.useMutation();
  const verifyCodeMutation = trpc.email.verifyCode.useMutation();

  const addLog = (log: Omit<ResponseLog, "id" | "timestamp">) => {
    const newLog: ResponseLog = {
      ...log,
      id: Date.now().toString(),
      timestamp: new Date(),
    };
    setLogs((prev) => [newLog, ...prev].slice(0, 10));
  };

  const handleSendEmail = async () => {
    if (!sendForm.to || !sendForm.subject) {
      toast.error("Please fill in required fields (to, subject)");
      return;
    }

    addLog({
      type: "send",
      status: "loading",
      message: "Sending email...",
    });

    try {
      const result = await sendEmailMutation.mutateAsync({
        to: sendForm.to,
        from: sendForm.from || undefined,
        subject: sendForm.subject,
        text: sendForm.text || undefined,
        html: sendForm.html || undefined,
        cc: sendForm.cc || undefined,
        bcc: sendForm.bcc || undefined,
      });

      addLog({
        type: "send",
        status: "success",
        message: "Email sent successfully",
        data: result,
      });

      toast.success("Email sent successfully!");
      setSendForm({ to: "", from: "", subject: "", text: "", html: "", cc: "", bcc: "" });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to send email";
      addLog({
        type: "send",
        status: "error",
        message,
      });
      toast.error(message);
    }
  };

  const handleSendVerificationCode = async () => {
    if (!verifyForm.email) {
      toast.error("Please enter an email address");
      return;
    }

    addLog({
      type: "verify",
      status: "loading",
      message: "Sending verification code...",
    });

    try {
      const result = await sendVerificationCodeMutation.mutateAsync({
        email: verifyForm.email,
        subject: verifyForm.subject || undefined,
        codeLength: verifyForm.codeLength,
      });

      addLog({
        type: "verify",
        status: "success",
        message: "Verification code sent successfully",
        data: result,
      });

      toast.success("Verification code sent!");
      setVerifyForm({ email: "", subject: "", codeLength: 6 });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to send verification code";
      addLog({
        type: "verify",
        status: "error",
        message,
      });
      toast.error(message);
    }
  };

  const handleVerifyCode = async () => {
    if (!verifyCodeForm.email || !verifyCodeForm.code) {
      toast.error("Please fill in all fields");
      return;
    }

    addLog({
      type: "verify-code",
      status: "loading",
      message: "Verifying code...",
    });

    try {
      const result = await verifyCodeMutation.mutateAsync({
        email: verifyCodeForm.email,
        code: verifyCodeForm.code,
      });

      addLog({
        type: "verify-code",
        status: "success",
        message: result.message,
        data: result,
      });

      toast.success(result.message);
      setVerifyCodeForm({ email: "", code: "" });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to verify code";
      addLog({
        type: "verify-code",
        status: "error",
        message,
      });
      toast.error(message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <Mail className="h-8 w-8 text-blue-600" />
            <h1 className="text-4xl font-bold text-slate-900">API Playground</h1>
          </div>
          <p className="text-lg text-slate-600">
            Test the Email API endpoints interactively
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Forms */}
          <div className="lg:col-span-2 space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="send">Send Email</TabsTrigger>
                <TabsTrigger value="verify">Send Code</TabsTrigger>
                <TabsTrigger value="verify-code">Verify Code</TabsTrigger>
              </TabsList>

              {/* Send Email Tab */}
              <TabsContent value="send">
                <Card className="border-0 shadow-lg">
                  <CardHeader className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-t-lg">
                    <CardTitle>Send Email</CardTitle>
                    <CardDescription className="text-emerald-100">
                      Send a custom email with HTML and text content
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="col-span-2">
                        <Label htmlFor="to" className="text-slate-700 font-semibold">
                          To <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="to"
                          type="email"
                          placeholder="recipient@example.com"
                          value={sendForm.to}
                          onChange={(e) => setSendForm({ ...sendForm, to: e.target.value })}
                          className="mt-1"
                        />
                      </div>

                      <div>
                        <Label htmlFor="from" className="text-slate-700 font-semibold">
                          From
                        </Label>
                        <Input
                          id="from"
                          type="email"
                          placeholder="sender@example.com"
                          value={sendForm.from}
                          onChange={(e) => setSendForm({ ...sendForm, from: e.target.value })}
                          className="mt-1"
                        />
                      </div>

                      <div>
                        <Label htmlFor="cc" className="text-slate-700 font-semibold">
                          CC
                        </Label>
                        <Input
                          id="cc"
                          type="email"
                          placeholder="cc@example.com"
                          value={sendForm.cc}
                          onChange={(e) => setSendForm({ ...sendForm, cc: e.target.value })}
                          className="mt-1"
                        />
                      </div>

                      <div className="col-span-2">
                        <Label htmlFor="bcc" className="text-slate-700 font-semibold">
                          BCC
                        </Label>
                        <Input
                          id="bcc"
                          type="email"
                          placeholder="bcc@example.com"
                          value={sendForm.bcc}
                          onChange={(e) => setSendForm({ ...sendForm, bcc: e.target.value })}
                          className="mt-1"
                        />
                      </div>

                      <div className="col-span-2">
                        <Label htmlFor="subject" className="text-slate-700 font-semibold">
                          Subject <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="subject"
                          placeholder="Email subject"
                          value={sendForm.subject}
                          onChange={(e) => setSendForm({ ...sendForm, subject: e.target.value })}
                          className="mt-1"
                        />
                      </div>

                      <div className="col-span-2">
                        <Label htmlFor="text" className="text-slate-700 font-semibold">
                          Plain Text Content
                        </Label>
                        <Textarea
                          id="text"
                          placeholder="Plain text version of your email"
                          value={sendForm.text}
                          onChange={(e) => setSendForm({ ...sendForm, text: e.target.value })}
                          className="mt-1 h-24"
                        />
                      </div>

                      <div className="col-span-2">
                        <Label htmlFor="html" className="text-slate-700 font-semibold">
                          HTML Content
                        </Label>
                        <Textarea
                          id="html"
                          placeholder="<h1>Hello</h1><p>Welcome!</p>"
                          value={sendForm.html}
                          onChange={(e) => setSendForm({ ...sendForm, html: e.target.value })}
                          className="mt-1 h-24 font-mono text-sm"
                        />
                      </div>
                    </div>

                    <Button
                      onClick={handleSendEmail}
                      disabled={sendEmailMutation.isPending}
                      className="w-full bg-emerald-600 hover:bg-emerald-700"
                    >
                      {sendEmailMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        "Send Email"
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Send Verification Code Tab */}
              <TabsContent value="verify">
                <Card className="border-0 shadow-lg">
                  <CardHeader className="bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-t-lg">
                    <CardTitle>Send Verification Code</CardTitle>
                    <CardDescription className="text-purple-100">
                      Generate and send a verification code
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6 space-y-4">
                    <div>
                      <Label htmlFor="verify-email" className="text-slate-700 font-semibold">
                        Email <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="verify-email"
                        type="email"
                        placeholder="user@example.com"
                        value={verifyForm.email}
                        onChange={(e) => setVerifyForm({ ...verifyForm, email: e.target.value })}
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="verify-subject" className="text-slate-700 font-semibold">
                        Subject (Optional)
                      </Label>
                      <Input
                        id="verify-subject"
                        placeholder="Your Verification Code"
                        value={verifyForm.subject}
                        onChange={(e) => setVerifyForm({ ...verifyForm, subject: e.target.value })}
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="code-length" className="text-slate-700 font-semibold">
                        Code Length
                      </Label>
                      <Input
                        id="code-length"
                        type="number"
                        min="4"
                        max="10"
                        value={verifyForm.codeLength}
                        onChange={(e) => setVerifyForm({ ...verifyForm, codeLength: parseInt(e.target.value) })}
                        className="mt-1"
                      />
                    </div>

                    <Button
                      onClick={handleSendVerificationCode}
                      disabled={sendVerificationCodeMutation.isPending}
                      className="w-full bg-purple-600 hover:bg-purple-700"
                    >
                      {sendVerificationCodeMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        "Send Code"
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Verify Code Tab */}
              <TabsContent value="verify-code">
                <Card className="border-0 shadow-lg">
                  <CardHeader className="bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-t-lg">
                    <CardTitle>Verify Code</CardTitle>
                    <CardDescription className="text-orange-100">
                      Verify a previously sent verification code
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6 space-y-4">
                    <div>
                      <Label htmlFor="verify-code-email" className="text-slate-700 font-semibold">
                        Email <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="verify-code-email"
                        type="email"
                        placeholder="user@example.com"
                        value={verifyCodeForm.email}
                        onChange={(e) => setVerifyCodeForm({ ...verifyCodeForm, email: e.target.value })}
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="code" className="text-slate-700 font-semibold">
                        Verification Code <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="code"
                        placeholder="123456"
                        value={verifyCodeForm.code}
                        onChange={(e) => setVerifyCodeForm({ ...verifyCodeForm, code: e.target.value })}
                        className="mt-1"
                      />
                    </div>

                    <Button
                      onClick={handleVerifyCode}
                      disabled={verifyCodeMutation.isPending}
                      className="w-full bg-orange-600 hover:bg-orange-700"
                    >
                      {verifyCodeMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Verifying...
                        </>
                      ) : (
                        "Verify Code"
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Response Logs */}
          <div className="lg:col-span-1">
            <Card className="border-0 shadow-lg sticky top-4">
              <CardHeader className="bg-gradient-to-r from-slate-600 to-slate-700 text-white rounded-t-lg">
                <CardTitle className="text-lg">Response Log</CardTitle>
                <CardDescription className="text-slate-200">
                  Last 10 requests
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4 max-h-96 overflow-y-auto space-y-3">
                {logs.length === 0 ? (
                  <p className="text-slate-500 text-sm text-center py-8">
                    No requests yet. Try sending an email!
                  </p>
                ) : (
                  logs.map((log) => (
                    <div
                      key={log.id}
                      className={`p-3 rounded-lg border-l-4 ${
                        log.status === "success"
                          ? "bg-green-50 border-green-500"
                          : log.status === "error"
                            ? "bg-red-50 border-red-500"
                            : "bg-blue-50 border-blue-500"
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        {log.status === "success" && (
                          <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        )}
                        {log.status === "error" && (
                          <AlertCircle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                        )}
                        {log.status === "loading" && (
                          <Loader2 className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0 animate-spin" />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-slate-700 mb-1">
                            {log.type.toUpperCase()}
                          </p>
                          <p className="text-xs text-slate-600 break-words">
                            {log.message}
                          </p>
                          {log.data && (
                            <p className="text-xs text-slate-500 mt-1 font-mono">
                              ID: {log.data.logId || log.data.id}
                            </p>
                          )}
                          <p className="text-xs text-slate-400 mt-1">
                            {log.timestamp.toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
