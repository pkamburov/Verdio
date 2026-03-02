import Link from "next/link";
import { Sprout, CloudSun, Bell, Droplets, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export default function Home() {
  return (
    <div className="max-w-6xl mx-auto space-y-12">
      {/* Hero Section */}
      <div className="text-center space-y-6 py-12">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-linear-to-br from-green-500 to-emerald-600 rounded-2xl shadow-lg">
          <Sprout className="w-12 h-12 text-white" />
        </div>
        <h1 className="text-5xl md:text-6xl font-bold text-green-900">
          Welcome to Verdio
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Your personal assistant for maintaining a thriving indoor garden.
          Track your plants, get care reminders, and watch your green space
          flourish.
        </p>
        <div className="flex gap-4 justify-center pt-4">
          <Link href="/plants">
            <Button
              size="lg"
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              View My Plants
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button
              size="lg"
              variant="outline"
              className="border-green-300 text-green-700 hover:bg-green-50"
            >
              Go to Dashboard
            </Button>
          </Link>
        </div>
      </div>

      {/* Feature Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="p-6 bg-white/60 backdrop-blur-sm border-green-100 hover:shadow-lg transition-shadow">
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
            <Droplets className="w-6 h-6 text-green-600" />
          </div>
          <h3 className="text-xl font-semibold text-green-900 mb-2">
            Watering Schedule
          </h3>
          <p className="text-gray-600">
            Never forget to water your plants again. Get timely reminders based
            on each plant's needs.
          </p>
        </Card>

        <Card className="p-6 bg-white/60 backdrop-blur-sm border-green-100 hover:shadow-lg transition-shadow">
          <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mb-4">
            <CloudSun className="w-6 h-6 text-amber-600" />
          </div>
          <h3 className="text-xl font-semibold text-green-900 mb-2">
            Weather Tracking
          </h3>
          <p className="text-gray-600">
            Monitor current weather conditions and adjust plant care
            accordingly.
          </p>
        </Card>

        <Card className="p-6 bg-white/60 backdrop-blur-sm border-green-100 hover:shadow-lg transition-shadow">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
            <Bell className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="text-xl font-semibold text-green-900 mb-2">
            Smart Notifications
          </h3>
          <p className="text-gray-600">
            Receive personalized care tips and alerts to keep your plants
            healthy.
          </p>
        </Card>
      </div>

      {/* Image Section */}
      <div className="relative h-96 rounded-2xl overflow-hidden shadow-xl">
        <img
          src="https://images.unsplash.com/photo-1667992714862-df8713baf8c6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnYXJkZW4lMjB3YXRlcmluZyUyMGNhbnxlbnwxfHx8fDE3NzI0NDg4NTR8MA&ixlib=rb-4.1.0&q=80&w=1080"
          alt="Garden watering"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent flex items-end">
          <div className="p-8 text-white">
            <h2 className="text-3xl font-semibold mb-2">
              Cultivate Your Green Space
            </h2>
            <p className="text-lg text-white/90">
              From beginner-friendly succulents to majestic fiddle leaf figs
            </p>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="text-center py-12">
        <Card className="p-8 bg-linear-to-r from-green-500 to-emerald-600 border-0 text-white">
          <h2 className="text-3xl font-semibold mb-4">
            Ready to grow your garden?
          </h2>
          <p className="text-lg text-green-50 mb-6 max-w-2xl mx-auto">
            Start tracking your plants today and discover how easy it is to
            maintain a beautiful, healthy indoor garden.
          </p>
          <Link href="/plants">
            <Button
              size="lg"
              variant="secondary"
              className="bg-white text-green-700 hover:bg-green-50"
            >
              Get Started
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </Card>
      </div>
    </div>
  );
}
