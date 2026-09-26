import Link from "next/link";
import { StartInterviewForm } from "@/components/interview/start-form";

export default function NewInterviewPage() {
  return <main className="interview-page"><div className="dashboard-top"><Link className="brand" href="/"><span className="brand-mark">VI</span><span>Việt Interview Pro</span></Link><Link className="dashboard-user" href="/dashboard">Dashboard ↗</Link></div><section className="interview-start"><p className="eyebrow"><span className="eyebrow-dot" /> Interview engine</p><h1>Một cuộc trò chuyện<br /><em>đáng để luyện.</em></h1><p className="profile-intro">Thiết lập bối cảnh để AI đặt những câu hỏi phù hợp hơn với mục tiêu của bạn.</p><StartInterviewForm /></section></main>;
}