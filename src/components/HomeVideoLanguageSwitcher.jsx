import { useState } from 'react';

export default function HomeVideoLanguageSwitcher() {
  const [language, setLanguage] = useState('english');

  const languages = ['english', 'polish', 'portuguese'];
  
  const languageLabels = {
    english: '🇬🇧 English',
    polish: '🇵🇱 Polish',
    portuguese: '🇵🇹 Portuguese'
  };

  const toggleLanguage = () => {
    const currentIndex = languages.indexOf(language);
    const nextIndex = (currentIndex + 1) % languages.length;
    setLanguage(languages[nextIndex]);
  };

  return (
    <section className="video-showcase-section">
      <div className="video-showcase-container">
        <div className="video-header">
          <h2 className="video-showcase-heading">How Horizon Wealth Works</h2>
          <button onClick={toggleLanguage} className="language-toggle-btn">
            <span className="btn-text">
              {languageLabels[language === 'english' ? 'polish' : language === 'polish' ? 'portuguese' : 'english']}
            </span>
            <span className="chevron-icon">▼</span>
          </button>
        </div>

        <div className="video-wrapper">
          <video 
            key={language}
            width="100%" 
            controls 
            className="showcase-video"
          >
            <source 
              src={
                language === 'english' 
                  ? '/VIDEO-2026-02-09-10-50-03.mp4' 
                  : language === 'polish'
                  ? '/videos/video-polish.mp4'
                  : '/videos/video-portuguese.mp4'
              } 
              type="video/mp4" 
            />
            Your browser does not support the video tag.
          </video>
        </div>
      </div>

      <style>{`
        .video-showcase-section {
          padding: 80px 40px;
          background: linear-gradient(135deg, #f0f4ff 0%, #ffffff 100%);
          margin: 60px 0;
        }

        .video-showcase-container {
          max-width: 1200px;
          margin: 0 auto;
        }

        .video-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 40px;
          flex-wrap: wrap;
          gap: 20px;
        }

        .video-showcase-heading {
          font-size: 2.75rem;
          font-weight: 600;
          text-align: center;
          margin: 0;
          color: #000000;
          flex: 1;
          min-width: 300px;
        }

        .language-toggle-btn {
          padding: 12px 24px;
          background: #1e40af;
          color: white;
          border: none;
          border-radius: 25px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 12px rgba(30, 64, 175, 0.3);
          display: flex;
          align-items: center;
          gap: 8px;
          animation: pulse 2s infinite;
          white-space: nowrap;
        }

        .language-toggle-btn:hover {
          background: #1a3a9c;
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(30, 64, 175, 0.4);
          animation: none;
        }

        .language-toggle-btn:active {
          transform: translateY(0);
        }

        .btn-text {
          display: flex;
          align-items: center;
        }

        .chevron-icon {
          display: inline-block;
          font-size: 0.75rem;
          transition: transform 0.3s ease;
          animation: chevron-bounce 1.5s infinite;
        }

        .language-toggle-btn:hover .chevron-icon {
          animation: none;
          transform: translateY(3px);
        }

        @keyframes pulse {
          0%, 100% {
            box-shadow: 0 4px 12px rgba(30, 64, 175, 0.3);
          }
          50% {
            box-shadow: 0 4px 20px rgba(30, 64, 175, 0.5);
          }
        }

        @keyframes chevron-bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(4px);
          }
        }

        .video-wrapper {
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 10px 40px rgba(30, 64, 175, 0.2);
          background: #000;
          aspect-ratio: 16 / 9;
        }

        .showcase-video {
          width: 100%;
          height: 100%;
          display: block;
        }

        @media (max-width: 1024px) {
          .video-showcase-section {
            padding: 60px 30px;
          }

          .video-showcase-heading {
            font-size: 2.2rem;
          }

          .video-header {
            margin-bottom: 30px;
          }
        }

        @media (max-width: 768px) {
          .video-showcase-section {
            padding: 50px 20px;
            margin: 40px 0;
          }

          .video-showcase-heading {
            font-size: 1.75rem;
          }

          .video-header {
            flex-direction: column;
            align-items: stretch;
          }

          .language-toggle-btn {
            width: 100%;
            justify-content: center;
          }
        }

        @media (max-width: 480px) {
          .video-showcase-section {
            padding: 30px 15px;
          }

          .video-showcase-heading {
            font-size: 1.4rem;
          }

          .language-toggle-btn {
            font-size: 0.9rem;
            padding: 12px 18px;
          }
        }
      `}</style>
    </section>
  );
}
