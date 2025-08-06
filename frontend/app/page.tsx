import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Sparkles, 
  FileText, 
  Package, 
  TrendingUp, 
  Clock,
  CheckCircle,
  ArrowRight,
  Zap,
  Building
} from 'lucide-react'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4">
            <Sparkles className="h-3 w-3 mr-1" />
            AI-Powered Demo
          </Badge>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Camber Sales Automation
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Transform your quote-to-order process from 45 minutes to 45 seconds
          </p>
        </div>

        {/* Value Props */}
        <div className="grid grid-cols-3 gap-4 mb-12">
          <Card className="border-0 shadow-lg">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold text-green-600">100%</p>
                  <p className="text-sm text-gray-600">Quote Accuracy</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold text-blue-600">60x</p>
                  <p className="text-sm text-gray-600">Faster Processing</p>
                </div>
                <Zap className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold text-purple-600">$247K</p>
                  <p className="text-sm text-gray-600">Pipeline This Week</p>
                </div>
                <TrendingUp className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <Link href="/quote">
            <Card className="group hover:shadow-xl transition-all cursor-pointer border-0 shadow-lg overflow-hidden">
              <div className="h-2 bg-gradient-to-r from-blue-500 to-blue-600"></div>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl flex items-center gap-2">
                      <FileText className="h-6 w-6 text-blue-600" />
                      Quote Builder
                    </CardTitle>
                    <CardDescription className="mt-2">
                      Create intelligent quotes with AI-powered extraction
                    </CardDescription>
                  </div>
                  <ArrowRight className="h-6 w-6 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>AI document extraction</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Real-time inventory status</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Smart pricing & discounts</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Quote lifecycle tracking</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/orders">
            <Card className="group hover:shadow-xl transition-all cursor-pointer border-0 shadow-lg overflow-hidden">
              <div className="h-2 bg-gradient-to-r from-emerald-500 to-emerald-600"></div>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl flex items-center gap-2">
                      <Package className="h-6 w-6 text-emerald-600" />
                      Order Queue
                    </CardTitle>
                    <CardDescription className="mt-2">
                      Process orders with 100% confidence scoring
                    </CardDescription>
                  </div>
                  <ArrowRight className="h-6 w-6 text-gray-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Source intelligence badges</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Quote metadata tracking</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Confidence scoring</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Auto-processing to ERP</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Demo Flow Preview */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-center">Demo Flow</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between max-w-4xl mx-auto">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <FileText className="h-8 w-8 text-blue-600" />
                </div>
                <p className="text-sm font-medium">Upload RFQ</p>
                <p className="text-xs text-gray-500">AI Extraction</p>
              </div>
              <ArrowRight className="h-6 w-6 text-gray-400" />
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Sparkles className="h-8 w-8 text-purple-600" />
                </div>
                <p className="text-sm font-medium">Build Quote</p>
                <p className="text-xs text-gray-500">Smart Pricing</p>
              </div>
              <ArrowRight className="h-6 w-6 text-gray-400" />
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <p className="text-sm font-medium">Accept Quote</p>
                <p className="text-xs text-gray-500">Capture PO</p>
              </div>
              <ArrowRight className="h-6 w-6 text-gray-400" />
              <div className="text-center">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Package className="h-8 w-8 text-emerald-600" />
                </div>
                <p className="text-sm font-medium">Auto Convert</p>
                <p className="text-xs text-gray-500">100% Confidence</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* UI Version Selection */}
        <Card className="border-0 shadow-lg mt-8">
          <CardHeader>
            <CardTitle className="text-center">Choose Your Experience</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-6">
              {/* Standard UI */}
              <div className="text-center">
                <h3 className="font-semibold mb-2">Standard UI</h3>
                <p className="text-sm text-gray-600 mb-4">Beautiful, modern interface optimized for demos</p>
                <div className="space-y-2">
                  <Link href="/quote">
                    <Button variant="outline" className="w-full">
                      Quote Builder (Standard)
                    </Button>
                  </Link>
                  <Link href="/orders">
                    <Button variant="outline" className="w-full">
                      Order Queue (Standard)
                    </Button>
                  </Link>
                </div>
              </div>
              
              {/* B2B Optimized UI */}
              <div className="text-center">
                <h3 className="font-semibold mb-2">B2B Power User UI</h3>
                <p className="text-sm text-gray-600 mb-4">Dense, efficient interface for high-volume sales teams</p>
                <div className="space-y-2">
                  <Link href="/quote-b2b">
                    <Button className="w-full bg-blue-600 hover:bg-blue-700">
                      Quote Builder (B2B)
                    </Button>
                  </Link>
                  <Link href="/orders-b2b">
                    <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
                      Order Queue (B2B)
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer Actions */}
        <div className="text-center mt-12">
          <p className="text-sm text-gray-500">
            Ready for production • API-compatible • Enterprise-grade • Keyboard-driven
          </p>
        </div>
      </div>
    </main>
  )
}