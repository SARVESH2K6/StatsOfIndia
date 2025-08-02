import React from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Badge } from "../components/ui/badge"
import { Button } from "../components/ui/button"
import { BarChart3, Users, TrendingUp, MapPin, Calendar, BookOpen, Globe2 } from "lucide-react"
import { ThemeToggle } from "../components/theme-toggle"
import { useTopic, useRandomFunFact, useStatistics } from "../hooks/useData"

const topics = [
  { id: "crime", name: "Crime & Safety", icon: "🚔", color: "bg-red-100 text-red-800", desc: "Explore crime rates, safety indices, and law enforcement statistics across India." },
  { id: "education", name: "Education", icon: "📚", color: "bg-blue-100 text-blue-800", desc: "Dive into literacy rates, school enrollments, and higher education trends in India." },
  { id: "tourism", name: "Tourism", icon: "🏛️", color: "bg-green-100 text-green-800", desc: "Discover tourism hotspots, visitor numbers, and travel trends across Indian states." },
  { id: "agriculture", name: "Agriculture", icon: "🌾", color: "bg-yellow-100 text-yellow-800", desc: "Analyze crop production, farmer statistics, and agricultural exports in India." },
  { id: "health", name: "Health", icon: "🏥", color: "bg-purple-100 text-purple-800", desc: "Review health indices, hospital data, and public health trends in India." },
  { id: "economy", name: "Economy", icon: "💰", color: "bg-orange-100 text-orange-800", desc: "Track GDP, employment, and economic growth statistics for India." },
]

const funFacts: Record<string, string> = {
  crime: "Delhi has the highest number of registered crimes among Indian cities.",
  education: "India has the world’s largest school system, with over 1.5 million schools.",
  tourism: "The Taj Mahal attracts over 7 million visitors every year.",
  agriculture: "India is the world’s largest producer of milk and pulses.",
  health: "India eradicated polio in 2014, a major public health achievement.",
  economy: "India is the world’s fastest-growing major economy as of 2023.",
}

const statExamples: Record<string, { label: string; value: string; icon: React.ReactNode }[]> = {
  crime: [
    { label: "Total Crimes (2022)", value: "6.2M", icon: <BarChart3 className="w-5 h-5 text-red-500" /> },
    { label: "Crime Rate per 100k", value: "445", icon: <TrendingUp className="w-5 h-5 text-orange-500" /> },
    { label: "Safest State", value: "Nagaland", icon: <MapPin className="w-5 h-5 text-green-500" /> },
  ],
  education: [
    { label: "Literacy Rate", value: "77.7%", icon: <BookOpen className="w-5 h-5 text-blue-500" /> },
    { label: "Schools", value: "1.5M+", icon: <Users className="w-5 h-5 text-purple-500" /> },
    { label: "Top State", value: "Kerala", icon: <MapPin className="w-5 h-5 text-green-500" /> },
  ],
  tourism: [
    { label: "Annual Visitors", value: "17M+", icon: <Globe2 className="w-5 h-5 text-green-500" /> },
    { label: "Top Attraction", value: "Taj Mahal", icon: <MapPin className="w-5 h-5 text-pink-500" /> },
    { label: "Tourism GDP", value: "$247B", icon: <TrendingUp className="w-5 h-5 text-orange-500" /> },
  ],
  agriculture: [
    { label: "Farmers", value: "150M+", icon: <Users className="w-5 h-5 text-green-500" /> },
    { label: "Top Crop", value: "Rice", icon: <BarChart3 className="w-5 h-5 text-yellow-500" /> },
    { label: "Agri GDP", value: "$450B", icon: <TrendingUp className="w-5 h-5 text-orange-500" /> },
  ],
  health: [
    { label: "Hospitals", value: "70,000+", icon: <BarChart3 className="w-5 h-5 text-purple-500" /> },
    { label: "Life Expectancy", value: "70.8 yrs", icon: <TrendingUp className="w-5 h-5 text-blue-500" /> },
    { label: "Doctors", value: "1.2M+", icon: <Users className="w-5 h-5 text-pink-500" /> },
  ],
  economy: [
    { label: "GDP (2023)", value: "$3.7T", icon: <TrendingUp className="w-5 h-5 text-orange-500" /> },
    { label: "Top State", value: "Maharashtra", icon: <MapPin className="w-5 h-5 text-green-500" /> },
    { label: "Unemployment", value: "7.8%", icon: <BarChart3 className="w-5 h-5 text-red-500" /> },
  ],
}

const topicParagraphs: Record<string, string> = {
  crime: `India's crime landscape is as diverse as its population. While metropolitan cities like Delhi and Mumbai often report higher crime rates, many rural areas remain relatively peaceful. The government and law enforcement agencies are constantly working to improve safety and reduce crime through technology, community policing, and awareness programs. Understanding crime statistics helps policymakers and citizens make informed decisions about safety and justice.`,
  education: `Education in India has seen remarkable progress over the decades. With the world's largest school system, India has made significant strides in increasing literacy rates and expanding access to higher education. However, challenges remain in terms of quality, infrastructure, and bridging the urban-rural divide. Ongoing reforms and digital initiatives are shaping the future of learning in India.`,
  tourism: `Tourism is a vital sector for India's economy, drawing millions of visitors to its historical monuments, natural wonders, and vibrant festivals. From the snow-capped Himalayas to the sun-kissed beaches of Goa, India's diversity is unmatched. The government promotes sustainable tourism to preserve cultural heritage and boost local economies.`,
  agriculture: `Agriculture is the backbone of India's economy, employing nearly half the population. India leads the world in the production of several crops, including rice, wheat, and pulses. Despite challenges like monsoon dependency and small landholdings, innovations in technology and policy are driving growth and sustainability in the sector.`,
  health: `India's healthcare system is a blend of public and private providers, serving a vast and diverse population. Major achievements include the eradication of polio and advances in medical research. However, disparities in access and quality persist, especially in rural areas. The government is investing in infrastructure and insurance schemes to improve health outcomes.`,
  economy: `India's economy is one of the fastest-growing in the world, driven by sectors like IT, manufacturing, and services. With a young workforce and a thriving startup ecosystem, India is poised for continued growth. Economic reforms, digitalization, and global trade partnerships are shaping the nation's financial future.`,
}

export default function TopicPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  
  // Fetch data from API
  const { topic: apiTopic, loading: topicLoading } = useTopic(id || "")
  const { funFact } = useRandomFunFact(id)
  const { statistics } = useStatistics({ topic_id: id, limit: 5 })
  
  // Use API topic or fallback to local topics
  const topic = apiTopic || topics.find((t) => t.id === id)

  if (!topic) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="text-6xl mb-4">❓</div>
        <div className="text-2xl font-bold mb-2">Topic Not Found</div>
        <Button onClick={() => navigate("/")} className="mt-4">Back to Home</Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-16 flex flex-col items-center relative">
      {/* Theme Toggle floating in top-right */}
      <div className="absolute right-6 top-6 z-10">
        <ThemeToggle />
      </div>
      <div className={`w-20 h-20 flex items-center justify-center text-5xl rounded-full shadow-lg mb-6 ${topic.color}`}>{topic.icon}</div>
      <h1 className="text-4xl font-extrabold mb-2 bg-gradient-to-r from-orange-600 to-green-600 bg-clip-text text-transparent tracking-tight">{topic.name}</h1>
      <Badge className="mb-4 px-4 py-2 text-base font-semibold">Explore {topic.name} in India</Badge>
      <p className="text-lg text-muted-foreground max-w-2xl text-center mb-8">{topic.desc}</p>

      {/* Fun Fact */}
      <div className="w-full max-w-lg bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900 dark:to-pink-900 rounded-xl shadow-lg p-6 flex flex-col items-center text-center mb-10 animate-fade-in">
        <Globe2 className="w-8 h-8 mb-3 text-green-600" />
        <div className="text-lg font-bold mb-1">Did You Know?</div>
        <div className="text-base text-muted-foreground font-medium">
          {funFact ? funFact.fact_text : funFacts[topic.id] || "Loading fun fact..."}
        </div>
        {funFact && (
          <div className="text-xs text-muted-foreground mt-2">
            Source: {funFact.source} ({funFact.year})
          </div>
        )}
      </div>

      {/* Detailed Paragraph */}
      <div className="w-full max-w-2xl mb-12">
        <p className="text-lg leading-relaxed text-foreground bg-white/80 dark:bg-gray-900/80 rounded-xl shadow p-6">
          {topicParagraphs[topic.id]}
        </p>
      </div>

      {/* Stats Section */}
      <div className="w-full max-w-2xl grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {statistics && statistics.length > 0 ? (
          statistics.slice(0, 3).map((stat: any, i) => (
            <div key={i} className="bg-white/90 dark:bg-gray-900/90 rounded-xl shadow-md p-6 flex flex-col items-center text-center hover:scale-105 hover:shadow-xl transition-all">
              <div className="mb-2">
                <BarChart3 className="w-5 h-5 text-blue-500" />
              </div>
              <div className="text-2xl font-bold mb-1">{stat.value || 0}</div>
              <div className="text-base text-muted-foreground font-medium">{stat.metric_name || `Metric ${i + 1}`}</div>
            </div>
          ))
        ) : (
          statExamples[topic.id].map((stat, i) => (
            <div key={i} className="bg-white/90 dark:bg-gray-900/90 rounded-xl shadow-md p-6 flex flex-col items-center text-center hover:scale-105 hover:shadow-xl transition-all">
              <div className="mb-2">{stat.icon}</div>
              <div className="text-2xl font-bold mb-1">{stat.value}</div>
              <div className="text-base text-muted-foreground font-medium">{stat.label}</div>
            </div>
          ))
        )}
      </div>

      {/* Call to Action */}
      <div className="flex flex-col items-center gap-4 mb-8">
        <Button size="lg" className="bg-gradient-to-r from-orange-500 to-green-500 hover:from-orange-600 hover:to-green-600 text-lg font-bold px-8 py-4 shadow-lg" onClick={() => navigate(`/statistics?topic=${topic.id}`)}>
          Explore {topic.name} Statistics
        </Button>
        <Button size="lg" className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-lg font-bold px-8 py-4 shadow-lg" onClick={() => navigate(`/comparison?topic=${topic.id}`)}>
          Compare {topic.name} Across States
        </Button>
        <Button variant="outline" onClick={() => navigate("/")}>Back to Home</Button>
      </div>

      {/* More Pages / Suggestions */}
      <div className="w-full max-w-2xl flex flex-wrap justify-center gap-4 mt-2">
        <Button variant="secondary" className="rounded-full px-6 py-2" onClick={() => navigate(`/reports?topic=${topic.id}`)}>
          {topic.name} Reports
        </Button>
        <Button variant="secondary" className="rounded-full px-6 py-2" onClick={() => navigate(`/trends?topic=${topic.id}`)}>
          {topic.name} Trends
        </Button>
        <Button variant="secondary" className="rounded-full px-6 py-2" onClick={() => navigate(`/insights?topic=${topic.id}`)}>
          {topic.name} Insights
        </Button>
      </div>
    </div>
  )
} 