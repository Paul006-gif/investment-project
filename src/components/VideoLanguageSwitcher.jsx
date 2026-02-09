import { useState } from 'react';

export default function VideoLanguageSwitcher() {
  const [language, setLanguage] = useState('english');

  const toggleLanguage = () => {
    setLanguage(language === 'english' ? 'polish' : 'english');
  };

  return (
    <section className="video-section">
      <div className="video-container">
        <div className="video-header">
          <h2>About Horizon Wealth</h2>
          <button onClick={toggleLanguage} className="language-btn">
            <span className="btn-text">
              {language === 'english' ? '🇵🇱 Polish' : '🇬🇧 English'}
            </span>
            <span className="chevron-icon">▼</span>
          </button>
        </div>
        
        <div className="video-wrapper">
          <video 
            key={language}
            width="100%" 
            controls 
            className="video-player"
          >
            <source 
              src={language === 'english' 
                ? '/videos/video-english.mp4' 
                : '/videos/video-polish.mp4'
              } 
              type="video/mp4" 
            />
            Your browser does not support the video tag.
          </video>
        </div>
      </div>

      <style>{`
        .video-section {
          padding: 80px 40px;
          background: linear-gradient(135deg, #f0f4ff 0%, #ffffff 100%);
          width: 100%;
        }

        .video-container {
          max-width: 1000px;
          margin: 0 auto;
        }

        .video-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
          flex-wrap: wrap;
          gap: 20px;
        }

        .video-header h2 {
          font-size: 2.5rem;
          font-weight: 700;
          color: #1e40af;
          margin: 0;
        }

        .language-btn {
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
        }

        .language-btn:hover {
          background: #1a3a9c;
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(30, 64, 175, 0.4);
          animation: none;
        }

        .language-btn:active {
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

        .language-btn:hover .chevron-icon {
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

        .video-player {
          width: 100%;
          height: 100%;
          display: block;
        }

        @media (max-width: 1024px) {
          .video-section {
            padding: 60px 30px;
          }

          .video-header h2 {
            font-size: 2rem;
          }
        }

        @media (max-width: 768px) {
          .video-section {
            padding: 50px 20px;
          }

          .video-header {
            flex-direction: column;
            align-items: stretch;
          }

          .video-header h2 {
            font-size: 1.75rem;
          }

          .language-btn {
            width: 100%;
            padding: 15px 20px;
          }
        }

        @media (max-width: 480px) {
          .video-section {
            padding: 30px 15px;
          }

          .video-header h2 {
            font-size: 1.4rem;
          }

          .language-btn {
            font-size: 0.9rem;
            padding: 12px 18px;
          }
        }
      `}</style>
    </section>
  );
}
