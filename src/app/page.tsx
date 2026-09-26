const featureCards = [
  ["01", "Phỏng vấn như thật", "Chọn vai trò, độ khó và persona để mô phỏng đúng áp lực của buổi phỏng vấn bạn sắp bước vào.", "coral"],
  ["02", "Feedback đi thẳng vào trọng tâm", "Nhìn rõ điểm mạnh, điểm yếu và cách cải thiện câu trả lời qua từng lượt luyện tập.", "mint"],
  ["03", "Tự tin đàm phán lương", "Luyện roleplay, chuẩn bị argument bank và xác định khoảng lương phù hợp với mục tiêu.", "amber"],
];

const steps = [
  ["01", "Chọn mục tiêu", "Vị trí, ngành, kinh nghiệm và bối cảnh bạn muốn luyện."],
  ["02", "Bắt đầu đối thoại", "Trả lời bằng text hoặc voice trong một session liền mạch."],
  ["03", "Tiến bộ có dữ liệu", "Theo dõi score, feedback và xu hướng tiến bộ qua thời gian."],
];

export default function Home() {
  return (
    <main>
      <nav className="site-nav page-shell" aria-label="Điều hướng chính">
        <a className="brand" href="#top" aria-label="Việt Interview Pro, về đầu trang"><span className="brand-mark">VI</span><span>Việt Interview Pro</span></a>
        <div className="nav-links"><a href="#features">Tính năng</a><a href="#how-it-works">Cách hoạt động</a><a href="#salary">Đàm phán lương</a></div>
        <a className="nav-login" href="/login">Bắt đầu <span aria-hidden="true">↗</span></a>
      </nav>

      <section className="hero page-shell" id="top">
        <div className="hero-copy reveal-up">
          <p className="eyebrow"><span className="eyebrow-dot" /> AI career practice studio</p>
          <h1>Luyện phỏng vấn <em>thông minh</em> với AI.</h1>
          <p className="hero-description">Biến mỗi lần luyện tập thành một bước tiến rõ ràng. Mô phỏng phỏng vấn, nhận feedback có cấu trúc và bước vào cuộc trò chuyện quan trọng với sự chuẩn bị tốt hơn.</p>
          <div className="hero-actions" id="start"><a className="button button-primary" href="/register">Bắt đầu luyện miễn phí <span aria-hidden="true">↗</span></a><a className="text-link" href="#features">Khám phá tính năng <span aria-hidden="true">↓</span></a></div>
          <div className="hero-proof" aria-label="Các điểm nổi bật"><span><strong>Text</strong> &amp; Voice</span><span className="proof-divider" /><span><strong>Feedback</strong> có cấu trúc</span><span className="proof-divider" /><span><strong>Tiếng Việt</strong> tự nhiên</span></div>
        </div>

        <div className="hero-visual reveal-card" aria-label="Bản xem trước session phỏng vấn">
          <div className="visual-glow" /><div className="interview-window"><div className="window-bar"><div className="window-dots"><span /><span /><span /></div><span className="window-label">INTERVIEW / PRODUCT DESIGNER</span><span className="window-status"><i /> LIVE</span></div><div className="window-content"><div className="session-meta"><span>SESSION 04</span><span>12:48</span></div><div className="question-block"><span className="question-label">AI INTERVIEWER · HIRING MANAGER</span><h2>Hãy kể về một quyết định thiết kế khó mà bạn đã đưa ra.</h2></div><div className="voice-lines" aria-hidden="true"><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /></div><div className="answer-row"><span className="mic-icon" aria-hidden="true">⌁</span><span>Đang lắng nghe câu trả lời của bạn...</span><span className="answer-time">00:34</span></div></div></div>
          <div className="score-float"><span className="score-label">LATEST SCORE</span><strong>8.4</strong><span className="score-up">+1.2</span><div className="score-bar"><span /></div></div><div className="floating-note"><span>✦</span> Feedback đã sẵn sàng</div>
        </div>
      </section>

      <section className="feature-section page-shell" id="features"><div className="section-heading"><p className="eyebrow">Một hệ thống, nhiều cách tiến bộ</p><h2>Mọi cuộc trò chuyện đều<br /><em>có ích hơn lần trước.</em></h2></div><div className="feature-grid">{featureCards.map(([number, title, description, tone]) => <article className={`feature-card ${tone}`} key={number}><span className="card-number">{number}</span><div><h3>{title}</h3><p>{description}</p></div><span className="card-arrow" aria-hidden="true">↗</span></article>)}</div></section>

      <section className="process-section" id="how-it-works"><div className="page-shell process-inner"><div className="section-heading process-heading"><p className="eyebrow">Cách hoạt động</p><h2>Từ bối rối đến<br /><em>sẵn sàng.</em></h2></div><div className="steps-list">{steps.map(([number, title, description]) => <div className="step" key={number}><span className="step-number">{number}</span><div><h3>{title}</h3><p>{description}</p></div><span className="step-line" /></div>)}</div></div></section>

      <section className="salary-section page-shell" id="salary"><div><p className="eyebrow">Salary roleplay</p><h2>Mức lương tốt hơn bắt đầu từ một cuộc nói chuyện được chuẩn bị kỹ.</h2></div><a className="button button-dark" href="#start">Khám phá salary coach <span aria-hidden="true">↗</span></a></section>
      <footer className="site-footer page-shell"><a className="brand" href="#top"><span className="brand-mark">VI</span><span>Việt Interview Pro</span></a><span>Chuẩn bị tốt hơn. Tự tin hơn.</span><span>© 2026 Việt Interview Pro</span></footer>
    </main>
  );
}