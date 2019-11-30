import React, { useEffect, useState } from 'react';
import { useHistory, useLocation, useParams, Link } from 'react-router-dom';
import locales from 'locales';
import { refs, scrollTo } from 'utils';
import { Image } from 'components';

function Header() {
  const { lang } = useParams();
  const { pathname } = useLocation();
  const history = useHistory();

  const [isMobile, setDevice] = useState(false);

  const scrollTop = () => {
    scrollTo();
  };

  const scrollDown = () => {
    scrollTo(refs.col3);
  };

  useEffect(() => {
    if (lang === 'en' || lang === 'ja' || lang === 'zh') return;

    const preferred = /en|ja|zh/.exec(navigator.language);
    const newLang = preferred ? preferred[0] : 'en';

    const path = lang
      ? pathname.replace(lang, newLang)
      : `${pathname}/${newLang}`;

    history.replace(path);
  }, [lang, history, pathname]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    const handleDevice = () => {
      setDevice(window.innerWidth <= 524);
    };

    handleDevice();

    window.addEventListener('resize', handleDevice);

    return () => {
      window.removeEventListener('resize', handleDevice);
    };
  }, []);

  return (
    <header>
      <div>
        <Image image="icon/stats" />
        <Link to={`/stats/${lang}`} title={locales('stats', lang)}>
          <span className="cover" />
        </Link>
      </div>

      <div>
        <Image image="icon/home" />
        <Link to={`/facility/${lang}`} title={locales('facility', lang)}>
          <span className="cover" />
        </Link>
      </div>

      {isMobile && (
        <>
          <div role="button" tabIndex="0" onKeyDown={null} onClick={scrollTop}>
            <span className="arrow up" />
          </div>
          <div role="button" tabIndex="0" onKeyDown={null} onClick={scrollDown}>
            <span className="arrow down" />
          </div>
        </>
      )}
    </header>
  );
}

export default Header;
