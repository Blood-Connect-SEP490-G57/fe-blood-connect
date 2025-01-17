import React from "react"
import HeroSection from "@/components/home/hero-section"
import FeaturesSection from "@/components/home/features-section"
import EventsSection from "@/components/home/events-section"

const Home: React.FC = () => {
  const features = [
    {
      title: "Hiến máu cứu người",
      description: "Một giọt máu cho đi, một cuộc đời ở lại",
      icon: "🩸"
    },
    {
      title: "Tình nguyện viên",
      description: "Tham gia cộng đồng người hiến máu tình nguyện",
      icon: "❤️"
    },
    {
      title: "Thông tin cập nhật",
      description: "Cập nhật thông tin về các đợt hiến máu gần nhất",
      icon: "📅"
    }
  ]

  const upcomingEvents = [
    {
      date: "29/07",
      title: "Hiến máu tại Đại học Y Hà Nội",
      description: "Chương trình hiến máu tình nguyện dành cho sinh viên và người dân"
    },
    {
      date: "01/08", 
      title: "Ngày hội hiến máu tình nguyện",
      description: "Tổ chức tại Viện Huyết học - Truyền máu Trung ương"
    },
    {
      date: "15/08",
      title: "Hiến máu cứu người - Một nghĩa cử cao đẹp",
      description: "Chương trình hiến máu tại các bệnh viện trên địa bàn thành phố"
    }
  ]

  return (
    <div className="min-h-screen">
      <HeroSection />
      <FeaturesSection features={features} />
      <EventsSection events={upcomingEvents} />
    </div>
  )
}

export default Home
