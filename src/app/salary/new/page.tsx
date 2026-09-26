import Link from "next/link";
import { SalaryStartForm } from "@/components/salary/start-form";

export default function NewSalaryPage() {
  return <main className="salary-page"><div className="dashboard-top"><Link className="brand" href="/"><span className="brand-mark">VI</span><span>Việt Interview Pro</span></Link><Link className="dashboard-user" href="/dashboard">Dashboard ↗</Link></div><section className="salary-start"><p className="eyebrow"><span className="eyebrow-dot" /> Salary engine</p><h1>Chuẩn bị cho<br /><em>cuộc nói chuyện lớn.</em></h1><p className="profile-intro">Nhập context của bạn để xây dựng target range và chiến lược đàm phán có cơ sở. Đây là công cụ hỗ trợ quyết định, không phải market fact.</p><SalaryStartForm /></section></main>;
}