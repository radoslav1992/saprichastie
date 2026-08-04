export type Lang = 'bg' | 'en';

export const languages: Record<Lang, string> = {
  bg: 'Български',
  en: 'English',
};

export const defaultLang: Lang = 'bg';

/** Returns the URL path prefix for a language ('' for bg, '/en' for en). */
export function langPrefix(lang: Lang): string {
  return lang === defaultLang ? '' : `/${lang}`;
}

/** Builds a localized URL for a page path like '/about'. */
export function localizeUrl(lang: Lang, path: string): string {
  const clean = path === '/' ? '' : path;
  return `${langPrefix(lang)}${clean}` || '/';
}

const bg = {
  siteName: 'Фондация „Съпричастие – Пазарджик“',
  siteNameShort: 'Съпричастие',
  tagline: 'Подкрепа за хора със зрителни увреждания',
  nav: {
    home: 'Начало',
    about: 'За нас',
    services: 'Услуги',
    activities: 'Дейности',
    gallery: 'Галерия',
    contact: 'Контакти',
    menu: 'Меню',
    openMenu: 'Отвори менюто',
    closeMenu: 'Затвори менюто',
    mainNav: 'Основна навигация',
    footerNav: 'Навигация в долната част',
    skipToContent: 'Към основното съдържание',
    switchLang: 'Switch to English',
    switchLangShort: 'EN',
  },
  a11y: {
    title: 'Достъпност',
    openSettings: 'Настройки за достъпност',
    contrast: 'Висок контраст',
    contrastOn: 'Включи висок контраст',
    contrastOff: 'Изключи висок контраст',
    fontSize: 'Размер на текста',
    fontNormal: 'Нормален',
    fontLarge: 'Голям',
    fontXL: 'Много голям',
    readAloud: 'Прочети страницата на глас',
    stopReading: 'Спри четенето',
    statement:
      'Този уебсайт е създаден да бъде достъпен за всички потребители, включително тези със зрителни увреждания.',
  },
  home: {
    heroTitle: 'Заедно виждаме повече',
    heroSubtitle:
      'Фондация „Съпричастие – Пазарджик“ подкрепя хората със зрителни увреждания за пълноценното им включване в обществото.',
    heroCtaServices: 'Нашите услуги',
    heroCtaContact: 'Свържете се с нас',
    welcome: 'Добре дошли на официалния сайт на Фондация „Съпричастие – Пазарджик“',
    mission:
      'Нашата мисия е да подкрепяме хората със зрителни увреждания за пълноценното им включване в обществото.',
    pillar1Title: 'Рехабилитация',
    pillar1Text:
      'Център за социална рехабилитация и интеграция с индивидуален подход към всеки потребител.',
    pillar2Title: 'Обучение',
    pillar2Text:
      'Компютърна грамотност, брайлово писмо, ориентиране и мобилност, умения за самостоятелен живот.',
    pillar3Title: 'Общност',
    pillar3Text:
      'Събития, спорт и дейности, които събират хората и премахват бариерите пред приобщаването.',
    aboutTeaserTitle: 'Кои сме ние',
    aboutTeaserText:
      'Основана през 2014 г., нашата фондация се превърна в ключов ресурс за общността на хората със зрителни увреждания в Пазарджик. Вярваме, че зрителното увреждане не трябва да бъде пречка за пълноценен живот.',
    aboutTeaserCta: 'Научете повече за нас',
    servicesTitle: 'Как помагаме',
    servicesSubtitle:
      'Предоставяме специализирани услуги, насочени към самостоятелност, увереност и пълноценно участие в обществения живот.',
    servicesCta: 'Всички услуги',
    galleryTitle: 'Моменти от нашата работа',
    gallerySubtitle: 'Разгледайте снимки от обученията, събитията и ежедневието на нашия център.',
    galleryCta: 'Към галерията',
    missionTitle: 'Нашата мисия',
    missionStatement:
      'Ние сме посветени на създаването на по-приобщаващо общество, където хората със зрителни увреждания могат да участват пълноценно и да допринасят. Чрез нашите услуги, застъпничество и обществена ангажираност, ние се стремим да премахваме бариерите и да насърчаваме разбирането.',
    contactCtaTitle: 'Нуждаете се от подкрепа?',
    contactCtaText:
      'Свържете се с нашия екип, за да научите как можем да подкрепим вас или ваш близък.',
    contactCtaButton: 'Свържете се с нас',
  },
  about: {
    title: 'За нас',
    intro:
      'Фондация „Съпричастие – Пазарджик“ е създадена с цел да подпомага хората със зрителни увреждания и да работи за тяхната по-добра интеграция в обществото.',
    historyTitle: 'История',
    historyText:
      'Основана през 2014 г., нашата фондация се превърна в ключов ресурс за общността на хората със зрителни увреждания в Пазарджик. Чрез отдаденост и подкрепа от общността, ние разширяваме нашите услуги и обхват година след година.',
    missionTitle: 'Мисия',
    missionText:
      'Нашата мисия е да осигурим равни възможности и достъпна среда за хората със зрителни увреждания, като им помагаме да постигнат независимост и пълноценно участие в обществения живот.',
    missionExtended:
      'Вярваме, че зрителното увреждане не трябва да бъде пречка за пълноценен живот. Нашият Център за социална рехабилитация и интеграция предоставя основни услуги, които дават възможност на хората да преодолеят предизвикателствата и да разгърнат пълния си потенциал.',
    teamTitle: 'Нашият екип',
    team: [
      {
        name: 'Лазар Додников',
        role: 'Директор',
        bio: 'С над 15 години опит в социалните услуги, Лазар ръководи нашата фондация с отдаденост и страст.',
      },
      {
        name: 'Валентина Жлегова',
        role: 'Главен асистент',
        bio: 'Валентина подпомага ежедневните дейности на нашия Център за социална рехабилитация и интеграция, осигурявайки висококачествени услуги за всички клиенти.',
      },
      {
        name: 'Стоян Маринков',
        role: 'Психолог',
        bio: 'Стоян предоставя важна психологическа подкрепа на нашите потребители, помагайки им да се справят с емоционалните предизвикателства, свързани със зрителните увреждания.',
      },
      {
        name: 'Зоя Гудова',
        role: 'Преподавател по информатика',
        bio: 'Зоя дава на нашите потребители възможността да се интегрират в дигиталния свят, предоставяйки обучение с технологии като JAWS.',
      },
    ],
  },
  services: {
    title: 'Услуги',
    intro:
      'Нашият център предлага специализирани услуги за хора със зрителни увреждания, насочени към социална рехабилитация и интеграция.',
    centerTitle: 'Център за социална рехабилитация и интеграция',
    centerText:
      'Нашият център предлага специализирани услуги за хора със зрителни увреждания, насочени към социална рехабилитация и интеграция.',
    centerOffers: 'Нашият център предлага:',
    centerItems: [
      'Оценка на индивидуалните нужди и способности',
      'Разработване на персонализирани рехабилитационни планове',
      'Обучение за ориентация и мобилност',
      'Обучение за всекидневни умения',
      'Развитие на социални умения',
      'Обучение за помощни технологии',
      'Обучение по брайлово писмо',
    ],
    supportTitle: 'Психологическа подкрепа',
    supportText:
      'Предоставяме индивидуални и групови сесии за психологическа подкрепа, насочени към преодоляване на предизвикателствата, свързани със зрителните увреждания.',
    supportOffers: 'Нашите психологически услуги включват:',
    supportItems: [
      'Индивидуални консултативни сесии',
      'Групова терапия и групи за подкрепа',
      'Семейно консултиране',
      'Стратегии за справяне с адаптацията към загуба на зрение',
      'Техники за управление на стреса',
      'Изграждане на самочувствие и положителна себепредстава',
    ],
    trainingTitle: 'Обучения и консултации',
    trainingText:
      'Организираме обучения за развиване на умения за самостоятелност и консултации по въпроси, свързани с интеграцията на хората със зрителни увреждания.',
    trainingOffers: 'Области на обучение и консултации:',
    trainingItems: [
      'Използване на адаптивни технологии (екранни четци, увеличители и др.)',
      'Комуникационни умения',
      'Образователна подкрепа и ресурси',
      'Подготовка за заетост и приспособления на работното място',
      'Законови права и застъпничество',
      'Достъп до финансова подкрепа и помощи',
    ],
    computerTitle: 'Компютърна грамотност',
    computerText:
      'Обучение по компютърни умения за хора със зрителни увреждания, включително използване на специализиран софтуер, екранни четци и други адаптивни технологии.',
    orientationTitle: 'Градско ориентиране',
    orientationText:
      'Подпомагане на хора със зрителни увреждания да се ориентират и придвижват самостоятелно в градска среда, използвайки специални техники и помощни средства.',
    sportsTitle: 'Спорт и спортна дейност',
    sportsText:
      'Организираме спортни дейности и занимания, адаптирани за хора със зрителни увреждания, които помагат за подобряване на физическото здраве и социалната интеграция.',
    legalTitle: 'Правна и административна помощ',
    legalText:
      'Съдействие при решаване на правни и административни въпроси, свързани с правата на хората със зрителни увреждания, достъп до социални услуги и помощи.',
    eligibilityTitle: 'Право на участие и достъп',
    eligibilityText:
      'Нашите услуги са достъпни за лица с нарушено зрение от всички възрасти в района на Пазарджик. За да получите достъп до нашите услуги, моля, свържете се с нас, за да насрочим първоначална оценка и консултация.',
    fundingText:
      'Много от нашите услуги се предоставят безплатно чрез правителствено и общинско финансиране, както и чрез щедрата подкрепа на дарители и партньори.',
    needHelpTitle: 'Нуждаете се от помощ?',
    needHelpText:
      'Свържете се с нашия екип за координация на услугите днес, за да научите повече как можем да подкрепим вас или ваш близък.',
    contactUs: 'Свържете се с нас',
  },
  activities: {
    title: 'Дейности',
    intro:
      'Организираме разнообразни дейности, които насърчават активния начин на живот, творчеството и социалното взаимодействие.',
    workshopsTitle: 'Работилници',
    workshopsText:
      'Организираме творчески работилници, които насърчават изразяването чрез изкуство и развиват фини моторни умения.',
    eventsTitle: 'Събития',
    eventsText:
      'Провеждаме различни събития, насочени към повишаване на обществената информираност за предизвикателствата пред хората със зрителни увреждания.',
    outdoorTitle: 'Дейности на открито',
    outdoorText:
      'Организираме дейности на открито, които насърчават активния начин на живот и социалното взаимодействие.',
    galleryCta: 'Вижте снимки от нашите дейности',
  },
  gallery: {
    title: 'Галерия',
    intro: 'Моменти от обученията, събитията и ежедневието на нашия център.',
    viewImage: 'Разгледай снимката',
    close: 'Затвори',
    prev: 'Предишна снимка',
    next: 'Следваща снимка',
    imageOf: 'от',
  },
  contact: {
    title: 'Контакти',
    intro:
      'Ние сме тук, за да отговорим на вашите въпроси и да предоставим информация за нашите услуги и дейности. Свържете се с нас по някой от методите по-долу.',
    infoTitle: 'Информация за контакт',
    address: 'Адрес',
    addressContent: 'ул. „Пейо Яворов“ 2, ет. 2, Пазарджик 4400, България',
    phone: 'Телефон',
    phoneNumber: '0876 773 573',
    email: 'Имейл',
    emailAddress: 'info@saprichastie.org',
    hours: 'Работно време',
    hoursWeekday: 'Понеделник – Петък: 9:00 – 17:00',
    hoursWeekend: 'Събота и Неделя: Затворено',
    formTitle: 'Изпратете ни съобщение',
    formName: 'Име',
    formEmail: 'Имейл',
    formSubject: 'Тема',
    formMessage: 'Съобщение',
    formSubmit: 'Изпрати съобщението',
    formSending: 'Изпращане…',
    formSuccess: 'Благодарим ви! Съобщението е изпратено успешно. Ще се свържем с вас възможно най-скоро.',
    formError:
      'Възникна грешка при изпращането. Моля, опитайте отново или ни пишете директно на имейл.',
    formRequired: 'Полетата, отбелязани със звездичка (*), са задължителни.',
    accessibilityTitle: 'Декларация за достъпност',
    accessibilityText1:
      'Нашата фондация е ангажирана да гарантира, че нашите физически помещения и услуги са достъпни за хора с нарушено зрение. Ако се нуждаете от специални условия, когато ни посещавате или участвате в нашите дейности, моля, уведомете ни предварително и ние ще направим всичко възможно, за да отговорим на вашите нужди.',
    accessibilityText2:
      'Също така се стремим да направим нашия уебсайт достъпен според указанията на WCAG, с функции като съвместимост с екранен четец, навигация с клавиатура и регулируеми размери на текста. Ако срещнете проблеми с достъпността на нашия уебсайт, моля свържете се с нас, за да ги отстраним.',
  },
  footer: {
    description:
      'Фондация, създадена да подпомага и работи с хора в неравностойно положение. Доставчик на услугата ЦСРИ за хора със зрителни увреждания.',
    rights: 'Всички права запазени',
  },
  notFound: {
    title: 'Страницата не е намерена',
    text: 'Страницата, която търсите, не съществува или е преместена.',
    backHome: 'Обратно към началото',
  },
};

const en: typeof bg = {
  siteName: 'Saprichastie – Pazardzhik Foundation',
  siteNameShort: 'Saprichastie',
  tagline: 'Support for People with Visual Impairments',
  nav: {
    home: 'Home',
    about: 'About Us',
    services: 'Services',
    activities: 'Activities',
    gallery: 'Gallery',
    contact: 'Contact',
    menu: 'Menu',
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
    mainNav: 'Main navigation',
    footerNav: 'Footer navigation',
    skipToContent: 'Skip to main content',
    switchLang: 'Превключи на български',
    switchLangShort: 'БГ',
  },
  a11y: {
    title: 'Accessibility',
    openSettings: 'Accessibility settings',
    contrast: 'High contrast',
    contrastOn: 'Enable high contrast',
    contrastOff: 'Disable high contrast',
    fontSize: 'Text size',
    fontNormal: 'Normal',
    fontLarge: 'Large',
    fontXL: 'Extra large',
    readAloud: 'Read this page aloud',
    stopReading: 'Stop reading',
    statement:
      'This website is designed to be accessible for all users, including those with visual impairments.',
  },
  home: {
    heroTitle: 'Together we see more',
    heroSubtitle:
      'The Saprichastie – Pazardzhik Foundation supports people with visual impairments for their full inclusion in society.',
    heroCtaServices: 'Our services',
    heroCtaContact: 'Get in touch',
    welcome: 'Welcome to the official website of the Saprichastie – Pazardzhik Foundation',
    mission:
      'Our mission is to support people with visual impairments for their full inclusion in society.',
    pillar1Title: 'Rehabilitation',
    pillar1Text:
      'A Center for Social Rehabilitation and Integration with an individual approach to every client.',
    pillar2Title: 'Training',
    pillar2Text:
      'Computer literacy, Braille, orientation and mobility, and independent living skills.',
    pillar3Title: 'Community',
    pillar3Text:
      'Events, sports and activities that bring people together and remove barriers to inclusion.',
    aboutTeaserTitle: 'Who we are',
    aboutTeaserText:
      'Founded in 2014, our foundation has grown into a key resource for the visually impaired community in Pazardzhik. We believe that visual impairment should not be a barrier to a fulfilling life.',
    aboutTeaserCta: 'Learn more about us',
    servicesTitle: 'How we help',
    servicesSubtitle:
      'We provide specialized services focused on independence, confidence and full participation in social life.',
    servicesCta: 'All services',
    galleryTitle: 'Moments from our work',
    gallerySubtitle: 'Browse photos from the trainings, events and everyday life of our center.',
    galleryCta: 'View the gallery',
    missionTitle: 'Our mission',
    missionStatement:
      'We are committed to creating a more inclusive society where people with visual impairments can fully participate and contribute. Through our services, advocacy, and community engagement, we strive to break down barriers and promote understanding.',
    contactCtaTitle: 'Need support?',
    contactCtaText:
      'Contact our team to learn how we can support you or your loved one.',
    contactCtaButton: 'Contact us',
  },
  about: {
    title: 'About Us',
    intro:
      'The Saprichastie – Pazardzhik Foundation was established to support people with visual impairments and to work for their better integration into society.',
    historyTitle: 'History',
    historyText:
      "Founded in 2014, our foundation has grown to become a key resource for the visually impaired community in Pazardzhik. Through dedication and community support, we've expanded our services and reach year after year.",
    missionTitle: 'Mission',
    missionText:
      'Our mission is to provide equal opportunities and an accessible environment for people with visual impairments, helping them achieve independence and full participation in social life.',
    missionExtended:
      'We believe that visual impairment should not be a barrier to leading a fulfilling life. Our Center for Social Rehabilitation and Integration provides essential services that empower individuals to overcome challenges and achieve their full potential.',
    teamTitle: 'Our Team',
    team: [
      {
        name: 'Lazar Dodnikov',
        role: 'Director',
        bio: 'With over 15 years of experience in social services, Lazar leads our foundation with dedication and passion.',
      },
      {
        name: 'Valentina Zhlegova',
        role: 'Lead Assistant',
        bio: 'Valentina supports the daily activities of our Center for Social Rehabilitation and Integration, ensuring high-quality services for all clients.',
      },
      {
        name: 'Stoyan Marinkov',
        role: 'Psychologist',
        bio: 'Stoyan provides important psychological support to our users, helping them cope with the emotional challenges associated with visual impairments.',
      },
      {
        name: 'Zoya Gudova',
        role: 'IT Teacher',
        bio: 'Zoya gives our users the opportunity to integrate into the digital world by offering training with technologies such as JAWS.',
      },
    ],
  },
  services: {
    title: 'Services',
    intro:
      'Our center offers specialized services for people with visual impairments, focused on social rehabilitation and integration.',
    centerTitle: 'Center for Social Rehabilitation and Integration',
    centerText:
      'Our center offers specialized services for people with visual impairments, focused on social rehabilitation and integration.',
    centerOffers: 'Our center offers:',
    centerItems: [
      'Assessment of individual needs and capabilities',
      'Development of personalized rehabilitation plans',
      'Training in orientation and mobility',
      'Training in daily living skills',
      'Social skills development',
      'Assistive technology training',
      'Braille instruction',
    ],
    supportTitle: 'Psychological Support',
    supportText:
      'We provide individual and group sessions for psychological support, aimed at overcoming challenges related to visual impairments.',
    supportOffers: 'Our psychological support services include:',
    supportItems: [
      'Individual counseling sessions',
      'Group therapy and support groups',
      'Family counseling',
      'Coping strategies for adapting to vision loss',
      'Stress management techniques',
      'Building self-confidence and positive self-image',
    ],
    trainingTitle: 'Training and Consultations',
    trainingText:
      'We organize training sessions for developing independence skills and consultations on issues related to the integration of people with visual impairments.',
    trainingOffers: 'Training and consultation areas:',
    trainingItems: [
      'Adaptive technology use (screen readers, magnifiers, etc.)',
      'Communication skills',
      'Educational support and resources',
      'Employment preparation and workplace accommodations',
      'Legal rights and advocacy',
      'Access to financial support and benefits',
    ],
    computerTitle: 'Computer Literacy',
    computerText:
      'Computer skills training for people with visual impairments, including the use of specialized software, screen readers, and other adaptive technologies.',
    orientationTitle: 'City Orientation',
    orientationText:
      'Helping people with visual impairments to navigate and move independently in urban environments using special techniques and aids.',
    sportsTitle: 'Sports and Sports Activities',
    sportsText:
      'We organize sports activities and exercises adapted for people with visual impairments, which help improve physical health and social integration.',
    legalTitle: 'Legal and Administrative Support',
    legalText:
      'Assistance in resolving legal and administrative issues related to the rights of people with visual impairments, access to social services and benefits.',
    eligibilityTitle: 'Eligibility and Access',
    eligibilityText:
      'Our services are available to individuals with visual impairments of all ages in the Pazardzhik region. To access our services, please contact us to schedule an initial assessment and consultation.',
    fundingText:
      'Many of our services are provided free of charge through government and municipal funding, as well as through the generous support of donors and partners.',
    needHelpTitle: 'Need Assistance?',
    needHelpText:
      'Contact our service coordination team today to learn more about how we can support you or your loved one.',
    contactUs: 'Contact us',
  },
  activities: {
    title: 'Activities',
    intro:
      'We organize a variety of activities that promote an active lifestyle, creativity and social interaction.',
    workshopsTitle: 'Workshops',
    workshopsText:
      'We organize creative workshops that encourage expression through art and develop fine motor skills.',
    eventsTitle: 'Events',
    eventsText:
      'We conduct various events aimed at raising public awareness about the challenges faced by people with visual impairments.',
    outdoorTitle: 'Outdoor Activities',
    outdoorText:
      'We organize outdoor activities that promote an active lifestyle and social interaction.',
    galleryCta: 'See photos from our activities',
  },
  gallery: {
    title: 'Gallery',
    intro: 'Moments from the trainings, events and everyday life of our center.',
    viewImage: 'View image',
    close: 'Close',
    prev: 'Previous image',
    next: 'Next image',
    imageOf: 'of',
  },
  contact: {
    title: 'Contact',
    intro:
      "We're here to answer your questions and provide information about our services and activities. Feel free to reach out to us using any of the methods below.",
    infoTitle: 'Contact Information',
    address: 'Address',
    addressContent: '2 Peyo Yavorov St., fl. 2, Pazardzhik 4400, Bulgaria',
    phone: 'Phone',
    phoneNumber: '+359 876 773 573',
    email: 'Email',
    emailAddress: 'info@saprichastie.org',
    hours: 'Working Hours',
    hoursWeekday: 'Monday – Friday: 9:00 AM – 5:00 PM',
    hoursWeekend: 'Saturday and Sunday: Closed',
    formTitle: 'Send Us a Message',
    formName: 'Name',
    formEmail: 'Email',
    formSubject: 'Subject',
    formMessage: 'Message',
    formSubmit: 'Send message',
    formSending: 'Sending…',
    formSuccess: 'Thank you! Your message has been sent successfully. We will get back to you as soon as possible.',
    formError:
      'Something went wrong while sending your message. Please try again or email us directly.',
    formRequired: 'Fields marked with an asterisk (*) are required.',
    accessibilityTitle: 'Accessibility Statement',
    accessibilityText1:
      'Our foundation is committed to ensuring that our physical premises and services are accessible to people with visual impairments. If you require any specific accommodations when visiting us or participating in our activities, please let us know in advance, and we will do our best to meet your needs.',
    accessibilityText2:
      'We also strive to make our website accessible according to WCAG guidelines, with features such as screen reader compatibility, keyboard navigation, and adjustable text sizes. If you encounter any accessibility issues on our website, please contact us so we can address them.',
  },
  footer: {
    description:
      'A foundation established to support and work with people with disabilities. Provider of the Center for Social Rehabilitation and Integration for people with visual impairments.',
    rights: 'All rights reserved',
  },
  notFound: {
    title: 'Page Not Found',
    text: 'The page you are looking for does not exist or has been moved.',
    backHome: 'Back to home',
  },
};

export const translations = { bg, en };

export function useTranslations(lang: Lang) {
  return translations[lang];
}
