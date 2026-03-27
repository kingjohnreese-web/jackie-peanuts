import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";

export default function Documentation() {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const codeBlock = (code: string, id: string, language: string = "json") => (
    <div className="relative">
      <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto text-sm">
        <code>{code}</code>
      </pre>
      <Button
        size="sm"
        variant="ghost"
        className="absolute top-2 right-2 h-8 w-8 p-0"
        onClick={() => copyToClipboard(code, id)}
      >
        <Copy className={`h-4 w-4 ${copiedId === id ? "text-green-500" : ""}`} />
      </Button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-slate-900 mb-3">Email API Documentation</h1>
          <p className="text-lg text-slate-600">
            Complete guide to using the Email API service
          </p>
        </div>

        {/* Overview */}
        <Card className="mb-8 border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
            <CardTitle>Overview</CardTitle>
            <CardDescription className="text-blue-100">
              Base URL: <code className="bg-blue-800 px-2 py-1 rounded">https://your-domain.com/api</code>
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <p className="text-slate-700 mb-4">
              The Email API provides a simple, RESTful interface for sending emails and managing verification codes.
              All requests are made via tRPC procedures, which handle validation and error handling automatically.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-slate-700">
                <strong>Authentication:</strong> Currently, all endpoints are public. For production use, consider adding
                API key authentication.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Endpoints */}
        <div className="space-y-6">
          {/* Send Email Endpoint */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-t-lg">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Send Email</CardTitle>
                  <CardDescription className="text-emerald-100">
                    Send an email with custom headers and content
                  </CardDescription>
                </div>
                <Badge className="bg-emerald-500">POST</Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <Tabs defaultValue="request" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="request">Request</TabsTrigger>
                  <TabsTrigger value="response">Response</TabsTrigger>
                  <TabsTrigger value="example">Example</TabsTrigger>
                </TabsList>

                <TabsContent value="request" className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-2">Endpoint</h4>
                    <code className="bg-slate-100 px-3 py-2 rounded block text-sm">
                      POST /api/trpc/email.send
                    </code>
                  </div>

                  <div>
                    <h4 className="font-semibold text-slate-900 mb-2">Parameters</h4>
                    <div className="space-y-3">
                      <div className="border-l-4 border-emerald-500 pl-4">
                        <p className="font-mono text-sm text-slate-700">
                          <span className="text-red-600">*</span> to: string
                        </p>
                        <p className="text-sm text-slate-600">Recipient email address</p>
                      </div>
                      <div className="border-l-4 border-slate-300 pl-4">
                        <p className="font-mono text-sm text-slate-700">from: string</p>
                        <p className="text-sm text-slate-600">Sender email address (optional, defaults to configured email)</p>
                      </div>
                      <div className="border-l-4 border-slate-300 pl-4">
                        <p className="font-mono text-sm text-slate-700">subject: string</p>
                        <p className="text-sm text-slate-600">Email subject (required)</p>
                      </div>
                      <div className="border-l-4 border-slate-300 pl-4">
                        <p className="font-mono text-sm text-slate-700">text: string</p>
                        <p className="text-sm text-slate-600">Plain text content (optional)</p>
                      </div>
                      <div className="border-l-4 border-slate-300 pl-4">
                        <p className="font-mono text-sm text-slate-700">html: string</p>
                        <p className="text-sm text-slate-600">HTML content (optional)</p>
                      </div>
                      <div className="border-l-4 border-slate-300 pl-4">
                        <p className="font-mono text-sm text-slate-700">cc: string</p>
                        <p className="text-sm text-slate-600">CC recipients (optional)</p>
                      </div>
                      <div className="border-l-4 border-slate-300 pl-4">
                        <p className="font-mono text-sm text-slate-700">bcc: string</p>
                        <p className="text-sm text-slate-600">BCC recipients (optional)</p>
                      </div>
                      <div className="border-l-4 border-slate-300 pl-4">
                        <p className="font-mono text-sm text-slate-700">headers: object</p>
                        <p className="text-sm text-slate-600">Custom email headers (optional)</p>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="response" className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-2">Success Response (200)</h4>
                    {codeBlock(
                      JSON.stringify(
                        {
                          success: true,
                          messageId: "<message-id@gmail.com>",
                          logId: 1,
                          message: "Email sent successfully",
                        },
                        null,
                        2
                      ),
                      "send-response"
                    )}
                  </div>

                  <div>
                    <h4 className="font-semibold text-slate-900 mb-2">Error Response</h4>
                    {codeBlock(
                      JSON.stringify(
                        {
                          error: {
                            code: "INTERNAL_SERVER_ERROR",
                            message: "Failed to send email: Invalid email address",
                          },
                        },
                        null,
                        2
                      ),
                      "send-error"
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="example" className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-2">JavaScript/TypeScript</h4>
                    {codeBlock(
                      `const response = await fetch('/api/trpc/email.send', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    json: {
      to: 'user@example.com',
      subject: 'Hello',
      html: '<p>Welcome!</p>',
      text: 'Welcome!'
    }
  })
});
const data = await response.json();`,
                      "send-example-js",
                      "javascript"
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Send Verification Code Endpoint */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-t-lg">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Send Verification Code</CardTitle>
                  <CardDescription className="text-purple-100">
                    Generate and send a verification code via email
                  </CardDescription>
                </div>
                <Badge className="bg-purple-500">POST</Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <Tabs defaultValue="request" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="request">Request</TabsTrigger>
                  <TabsTrigger value="response">Response</TabsTrigger>
                  <TabsTrigger value="example">Example</TabsTrigger>
                </TabsList>

                <TabsContent value="request" className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-2">Endpoint</h4>
                    <code className="bg-slate-100 px-3 py-2 rounded block text-sm">
                      POST /api/trpc/email.sendVerificationCode
                    </code>
                  </div>

                  <div>
                    <h4 className="font-semibold text-slate-900 mb-2">Parameters</h4>
                    <div className="space-y-3">
                      <div className="border-l-4 border-purple-500 pl-4">
                        <p className="font-mono text-sm text-slate-700">
                          <span className="text-red-600">*</span> email: string
                        </p>
                        <p className="text-sm text-slate-600">Recipient email address</p>
                      </div>
                      <div className="border-l-4 border-slate-300 pl-4">
                        <p className="font-mono text-sm text-slate-700">subject: string</p>
                        <p className="text-sm text-slate-600">Email subject (optional, defaults to "Your Verification Code")</p>
                      </div>
                      <div className="border-l-4 border-slate-300 pl-4">
                        <p className="font-mono text-sm text-slate-700">codeLength: number</p>
                        <p className="text-sm text-slate-600">Code length 4-10 (optional, defaults to 6)</p>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="response" className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-2">Success Response (200)</h4>
                    {codeBlock(
                      JSON.stringify(
                        {
                          success: true,
                          code: "123456",
                          logId: 2,
                          message: "Verification code sent successfully",
                        },
                        null,
                        2
                      ),
                      "verify-response"
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="example" className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-2">JavaScript/TypeScript</h4>
                    {codeBlock(
                      `const response = await fetch('/api/trpc/email.sendVerificationCode', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    json: {
      email: 'user@example.com',
      codeLength: 6
    }
  })
});
const data = await response.json();
console.log('Code:', data.result.data.code);`,
                      "verify-example-js",
                      "javascript"
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Verify Code Endpoint */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-t-lg">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Verify Code</CardTitle>
                  <CardDescription className="text-orange-100">
                    Verify a previously sent verification code
                  </CardDescription>
                </div>
                <Badge className="bg-orange-500">POST</Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <Tabs defaultValue="request" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="request">Request</TabsTrigger>
                  <TabsTrigger value="response">Response</TabsTrigger>
                </TabsList>

                <TabsContent value="request" className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-2">Endpoint</h4>
                    <code className="bg-slate-100 px-3 py-2 rounded block text-sm">
                      POST /api/trpc/email.verifyCode
                    </code>
                  </div>

                  <div>
                    <h4 className="font-semibold text-slate-900 mb-2">Parameters</h4>
                    <div className="space-y-3">
                      <div className="border-l-4 border-orange-500 pl-4">
                        <p className="font-mono text-sm text-slate-700">
                          <span className="text-red-600">*</span> email: string
                        </p>
                        <p className="text-sm text-slate-600">Email address to verify</p>
                      </div>
                      <div className="border-l-4 border-orange-500 pl-4">
                        <p className="font-mono text-sm text-slate-700">
                          <span className="text-red-600">*</span> code: string
                        </p>
                        <p className="text-sm text-slate-600">Verification code to verify</p>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="response" className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-2">Success Response (200)</h4>
                    {codeBlock(
                      JSON.stringify(
                        {
                          success: true,
                          message: "Verification code is valid",
                        },
                        null,
                        2
                      ),
                      "verify-code-success"
                    )}
                  </div>

                  <div>
                    <h4 className="font-semibold text-slate-900 mb-2">Error Response</h4>
                    {codeBlock(
                      JSON.stringify(
                        {
                          success: false,
                          message: "Invalid or expired verification code",
                        },
                        null,
                        2
                      ),
                      "verify-code-error"
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Get Logs Endpoint */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-t-lg">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Get Email Logs</CardTitle>
                  <CardDescription className="text-indigo-100">
                    Retrieve email sending history and logs
                  </CardDescription>
                </div>
                <Badge className="bg-indigo-500">GET</Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <Tabs defaultValue="request" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="request">Request</TabsTrigger>
                  <TabsTrigger value="response">Response</TabsTrigger>
                </TabsList>

                <TabsContent value="request" className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-2">Endpoint</h4>
                    <code className="bg-slate-100 px-3 py-2 rounded block text-sm">
                      GET /api/trpc/email.getLogs
                    </code>
                  </div>

                  <div>
                    <h4 className="font-semibold text-slate-900 mb-2">Parameters</h4>
                    <div className="space-y-3">
                      <div className="border-l-4 border-slate-300 pl-4">
                        <p className="font-mono text-sm text-slate-700">limit: number</p>
                        <p className="text-sm text-slate-600">Maximum number of logs to return (1-100, default: 50)</p>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="response" className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-2">Response</h4>
                    {codeBlock(
                      JSON.stringify(
                        [
                          {
                            id: 1,
                            to: "user@example.com",
                            from: "sender@gmail.com",
                            subject: "Welcome",
                            status: "sent",
                            messageId: "<message-id@gmail.com>",
                            createdAt: "2024-03-27T10:30:00.000Z",
                          },
                        ],
                        null,
                        2
                      ),
                      "logs-response"
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Best Practices */}
        <Card className="mt-8 border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-slate-600 to-slate-700 text-white rounded-t-lg">
            <CardTitle>Best Practices</CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <div className="space-y-2">
              <h4 className="font-semibold text-slate-900">Email Validation</h4>
              <p className="text-slate-700">
                Always validate email addresses on the client side before sending requests. The API will reject invalid
                email formats.
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold text-slate-900">Rate Limiting</h4>
              <p className="text-slate-700">
                For production use, implement rate limiting to prevent abuse. Consider limiting requests per IP or user.
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold text-slate-900">Error Handling</h4>
              <p className="text-slate-700">
                Always handle errors gracefully. Check the error message and code to determine the cause of failure.
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold text-slate-900">Verification Codes</h4>
              <p className="text-slate-700">
                Verification codes expire after 10 minutes. Codes can only be verified once and are marked as used after
                successful verification.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
