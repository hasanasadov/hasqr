import { Header } from "@/components/header"
import { QRGenerator } from "@/components/qr-generator"

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <QRGenerator />
      
      {/* Footer */}
      <footer className="border-t border-border py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              HASQR — Professional QR Code Generator
            </p>
            <p className="text-xs text-muted-foreground">
              Free to use. No watermarks. No limits.
            </p>
          </div>
        </div>
      </footer>
    </main>
  )
}
