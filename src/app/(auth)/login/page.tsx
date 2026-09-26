import Link from "next/link";
import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
  return (
    <main className="auth-page">
      <div className="auth-aside"><Link className="brand" href="/"><span className="brand-mark">VI</span><span>Việt Interview Pro</span></Link><div><p className="eyebrow"><span className="eyebrow-dot" /> Your next conversation</p><h1>Sự tự tin được xây dựng từ những lần <em>luyện tập tốt hơn.</em></h1></div><span className="auth-aside-footer">Chuẩn bị tốt hơn. Tự tin hơn.</span></div>
      <section className="auth-panel"><div className="auth-panel-inner"><Link className="mobile-brand brand" href="/"><span className="brand-mark">VI</span><span>Việt Interview Pro</span></Link><p className="eyebrow">Chào mừng trở lại</p><h2>Đăng nhập vào không gian luyện tập.</h2><p className="auth-intro">Tiếp tục nơi bạn đã dừng lại và biến mục tiêu nghề nghiệp thành bước tiến cụ thể.</p><LoginForm /><p className="auth-switch">Chưa có tài khoản? <a href="/register">Đăng ký miễn phí</a></p></div></section>
    </main>
  );
}