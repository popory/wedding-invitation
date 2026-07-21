import { NaverMap } from "./NaverMap";
import { Guestbook } from "./Guestbook";

const calendarDays = Array.from({ length: 30 }, (_, index) => index + 1);

export default function Home() {
  return (
    <main>
      <section className="hero section">
        <div className="eyebrow">WEDDING INVITATION</div>
        <div className="botanical botanicalTop" aria-hidden="true">❦</div>
        <h1>
          이세린 <span>&amp;</span> 이혜린
        </h1>
        <p className="heroDate">2026. 11. 01 · SUN · 1:00 PM</p>
        <div className="heroArt" aria-hidden="true">
          <div className="arch">
            <span>OUR<br />WEDDING DAY</span>
          </div>
        </div>
        <p className="venue">더채플앳 청담 · 6층 채플홀</p>
      </section>

      <section className="section greeting">
        <p className="sectionLabel">INVITATION</p>
        <h2>소중한 분들을 초대합니다</h2>
        <div className="divider"><span>✦</span></div>
        <p>
          서로의 하루를 아끼고 사랑하며<br />
          함께 걷기로 약속했습니다.<br /><br />
          저희 두 사람의 새로운 시작에<br />
          따뜻한 축복으로 함께해 주세요.
        </p>
        <div className="names">
          <div><small>신랑</small><strong>이세린</strong></div>
          <span className="dot">·</span>
          <div><small>신부</small><strong>이혜린</strong></div>
        </div>
      </section>

      <section className="section calendarSection">
        <p className="sectionLabel">WEDDING DAY</p>
        <h2>2026년 11월 1일</h2>
        <p className="subtext">일요일 오후 1시</p>
        <div className="calendar" aria-label="2026년 11월 달력">
          {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map(day => <b key={day}>{day}</b>)}
          {calendarDays.map(day => (
            <span key={day} className={day === 1 ? 'weddingDay' : ''}>{day}</span>
          ))}
        </div>
        <p className="countdown">우리의 가장 빛나는 날</p>
      </section>

      <section className="section location">
        <p className="sectionLabel">LOCATION</p>
        <h2>오시는 길</h2>
        <p className="place"><strong>더채플앳 청담</strong><br />서울특별시 강남구 선릉로 757</p>
        <div className="venueInfo" aria-label="예식 장소 상세 안내">
          <div><span>예식</span><strong>2026년 11월 1일 일요일<br />오후 1시</strong></div>
          <div><span>예식장</span><strong>6층 채플홀</strong></div>
          <div><span>피로연장</span><strong>5층 피로연장</strong></div>
        </div>
        <NaverMap />
        <div className="navigationButtons" aria-label="내비게이션 앱 선택">
          <a className="navButton naver" href="https://naver.me/5ne4oSX1" target="_blank" rel="noreferrer">네이버 지도</a>
          <a className="navButton kakao" href="https://map.kakao.com/link/search/%EB%8D%94%EC%B1%84%ED%94%8C%EC%95%B3%EC%B2%AD%EB%8B%B4" target="_blank" rel="noreferrer">카카오내비</a>
          <a className="navButton tmap" href="tmap://search?name=%EB%8D%94%EC%B1%84%ED%94%8C%EC%95%B3%EC%B2%AD%EB%8B%B4">티맵</a>
        </div>
        <div className="transport">
          <div><b>지하철</b><p>7호선·수인분당선 강남구청역 3-1번 출구에서 도보 약 7분</p></div>
          <div><b>셔틀버스</b><p>예식 당일 강남구청역 3번 출구에서 약 10~15분 간격 운행</p></div>
          <div><b>버스</b><p>301, 351, 472, 3011, 4412번 이용<br />영동고교 앞 하차 후 학동사거리 방향 약 100m</p></div>
          <div><b>주차</b><p>내부 200대·외부 300대, 총 500대 주차 가능<br />1시간 30분 무료 · 만차 시 현장 주차요원의 안내를 따라주세요.</p></div>
        </div>
      </section>

      <section className="section account">
        <p className="sectionLabel">THANK YOU</p>
        <h2>마음 전하실 곳</h2>
        <p className="subtext">참석이 어려우신 분들을 위해<br />계좌번호를 안내드립니다.</p>
        <details><summary>신랑측 계좌번호</summary><p>계좌 정보를 입력해 주세요.</p></details>
        <details><summary>신부측 계좌번호</summary><p>계좌 정보를 입력해 주세요.</p></details>
      </section>

      <Guestbook />

      <footer>
        <div className="botanical" aria-hidden="true">❦</div>
        <p>세린 그리고 혜린</p>
        <small>2026. 11. 01</small>
      </footer>
    </main>
  );
}
