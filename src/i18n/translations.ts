export type Language = 'ru' | 'uz';

export const KNOWN_FEATURE_CODES = [
  'online_booking',
  'client_app',
  'branding',
  'play_publish',
  'reviews',
  'chat',
  'loyalty',
  'gift_certificates',
  'packages',
  'waitlist',
  'content',
  'telegram',
  'rebook_reminders',
  'analytics',
] as const;

export type KnownFeatureCode = (typeof KNOWN_FEATURE_CODES)[number];

export function isKnownFeature(code: string): code is KnownFeatureCode {
  return (KNOWN_FEATURE_CODES as readonly string[]).includes(code);
}

export function formatMoney(
  amount: number,
  currency: 'UZS' | 'USD' = 'UZS',
  lang: Language = 'ru'
): string {
  const formattedNumber = Math.round(amount)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, '\u00a0');

  if (currency === 'USD') {
    return `$${formattedNumber}`;
  }
  return lang === 'uz' ? `${formattedNumber}\u00a0so'm` : `${formattedNumber}\u00a0сум`;
}

export const translations = {
  ru: {
    seo: {
      title: 'InsideFire Beauty — Онлайн-запись и приложение для вашего салона',
      description:
        'Платформа для салонов красоты, парикмахерских, барбершопов, ногтевых студий и ателье в Узбекистане: онлайн-запись 24/7, брендированное приложение для клиентов, расписание мастеров и оплата через Payme и Click.',
    },
    brandName: 'InsideFire Beauty',
    nav: {
      home: 'Главная',
      features: 'Возможности',
      plans: 'Тарифы',
      calculator: 'Калькулятор',
      forWhom: 'Для кого',
      faq: 'Вопросы',
      connectCta: 'Подключить салон',
      openMenu: 'Открыть меню',
      closeMenu: 'Закрыть меню',
    },
    hero: {
      badge: 'Для салонов красоты, парикмахерских, барбершопов и ателье',
      title: 'Онлайн-запись и приложение для вашего салона',
      titleLead: 'Онлайн-запись и приложение',
      titleAccent: 'для вашего салона',
      subtitle:
        'Клиенты записываются сами 24/7 в брендированном приложении салона, администратор ведёт расписание без путаницы в блокноте, а владелец видит выручку и итоги дня в Telegram.',
      primaryCta: 'Оставить заявку',
      secondaryCta: 'Смотреть тарифы',
      prevSlide: 'Предыдущий слайд',
      nextSlide: 'Следующий слайд',
      goToSlide: 'Перейти к слайду',
      phoneAlt: 'Приложение салона на телефоне: расписание недели, записи на сегодня и разделы',
    },
    trust: {
      eyebrow: 'Почему InsideFire',
      items: [
        {
          title: 'Запись 24/7',
          subtitle: 'Клиенты выбирают мастера и свободное окно даже ночью без звонков администратору',
        },
        {
          title: 'Подключение за 1 день',
          subtitle: 'Сами загрузим прайс, настроим мастеров и подготовим приложение вашего салона',
        },
        {
          title: '14 дней бесплатно',
          subtitle: 'Все возможности выбранного тарифа без привязки карты и предоплаты',
        },
        {
          title: 'Поддержка в Telegram',
          subtitle: 'Быстрые ответы живых специалистов на русском и узбекском языках',
        },
      ],
    },
    segments: {
      eyebrow: 'Для кого',
      title: 'Подходит любому салону, где клиенты записываются к мастеру',
      subtitle:
        'Услуги, длительность, цены и мастера настраиваются под ваш бизнес — от барбершопа на два кресла до сети салонов с филиалами.',
      items: [
        { title: 'Салоны красоты', description: 'Несколько направлений в одном месте: волосы, ногти, брови, косметология.' },
        { title: 'Женские парикмахерские', description: 'Стрижки, окрашивание, укладки — с разной длительностью и ценой у каждого мастера.' },
        { title: 'Мужские парикмахерские и барбершопы', description: 'Быстрая запись к своему барберу, напоминания и повторные визиты.' },
        { title: 'Ногтевые студии', description: 'Маникюр, педикюр, наращивание — плотное расписание без накладок.' },
        { title: 'Ателье мод', description: 'Примерки, замеры и выдача заказов по записи — без очереди и звонков.' },
        { title: 'И другие салоны', description: 'Брови и ресницы, косметология, массаж, SPA, тату — всё, где есть мастер и время записи.' },
      ],
    },
    whatSalonGets: {
      eyebrow: 'Возможности системы',
      title: 'Что получает ваш салон',
      subtitle:
        'Три удобных инструмента, которые работают синхронно — для гостей, администратора на ресепшене и владельца бизнеса.',
      cards: {
        client: {
          role: '01. Клиентам',
          title: 'Приложение и сайт салона',
          description:
            'Запись к любимому мастеру на свободное время за 30 секунд, автоматические пуш-напоминания о визите, честные отзывы, история посещений и бонусный счёт.',
          highlights: ['Ваш логотип и фирменные цвета', 'Выбор свободного времени без звонков', 'Бонусы, промокоды и сертификаты'],
        },
        admin: {
          role: '02. Администратору',
          title: 'Приложение для управления салоном',
          description:
            'Наглядная сетка расписания всех мастеров, быстрое добавление записей, карточки клиентов с историей процедур, управление услугами, ценами и аналитика.',
          highlights: ['Расписание мастеров на одном экране', 'База клиентов без потерь', 'Учёт услуг, цен и загрузки'],
        },
        owner: {
          role: '03. Владельцу',
          title: 'Умный Telegram-бот контроля',
          description:
            'Итоги дня каждый вечер: записи, выручка, новые клиенты. Напоминания о подписке и оплата через Payme или Click прямо из Telegram.',
          highlights: ['Итоги дня и выручка в Telegram', 'Напоминания об оплате заранее', 'Оплата через Payme и Click'],
        },
      },
    },
    howToConnect: {
      eyebrow: 'Быстрый старт',
      title: 'Как подключиться',
      subtitle: 'Никаких сложных интеграций и долгого обучения персонала — мы берём настройку на себя.',
      steps: [
        {
          step: 'Шаг 1',
          title: 'Оставляете заявку',
          description: 'Укажите название салона и телефон. Менеджер свяжется с вами в Telegram или по телефону.',
        },
        {
          step: 'Шаг 2',
          title: 'Мы настраиваем салон и приложение (1 день)',
          description: 'Переносим ваш прайс-лист, график мастеров, логотип и фирменные цвета в готовую систему.',
        },
        {
          step: 'Шаг 3',
          title: 'Пользуетесь 14 дней бесплатно, потом — по тарифу',
          description: 'Принимаете реальные записи клиентов и оцениваете удобство работы до первой оплаты.',
        },
      ],
    },
    plans: {
      eyebrow: 'Прозрачная стоимость',
      title: 'Тарифы для салонов любого масштаба',
      subtitle: 'Выберите подходящий план. Все тарифы включают 14 дней бесплатного тестового периода.',
      popularBadge: 'Популярный',
      perMonth: 'в месяц',
      setupFeePrefix: 'подключение —',
      mastersLimit: 'Мастеров:',
      unlimited: 'без ограничений',
      branchesLimit: 'Филиалов:',
      extraMasterPrefix: 'Доп. мастер:',
      extraBranchPrefix: 'Доп. филиал:',
      selectPlanButton: 'Выбрать',
      includedLabel: 'Что входит',
      includesPrev: 'Всё из «{plan}», плюс:',
      fallbackTitle: 'Цены уточняйте у менеджера',
      fallbackDescription:
        'Оставьте контакты вашего салона — мы подберём оптимальный тариф под количество ваших мастеров и филиалов и рассчитаем точную стоимость за 10 минут.',
      fallbackButton: 'Оставить заявку на расчёт',
    },
    featureNames: {
      online_booking: 'Онлайн-запись 24/7',
      client_app: 'Своё приложение для клиентов',
      branding: 'Ваш логотип и цвета',
      play_publish: 'Публикация в Google Play',
      reviews: 'Отзывы клиентов',
      chat: 'Чат с клиентами',
      loyalty: 'Промокоды и «приведи друга»',
      gift_certificates: 'Подарочные сертификаты',
      packages: 'Абонементы',
      waitlist: 'Лист ожидания',
      content: 'Новости и баннеры в приложении',
      telegram: 'Публикации работ в Telegram-канал',
      rebook_reminders: 'Напоминания «пора записаться»',
      analytics: 'Аналитика выручки и мастеров',
    } as Record<KnownFeatureCode, string>,
    calculator: {
      title: 'Калькулятор стоимости',
      subtitle: 'Рассчитайте подписку под размер вашей команды и число филиалов',
      selectPlanLabel: 'Тариф',
      mastersLabel: 'Мастеров',
      branchesLabel: 'Филиалов',
      monthlyTotalLabel: 'Итого в месяц',
      setupOncePrefix: '+ подключение',
      setupOnceSuffix: 'один раз',
      freeSetup: 'Бесплатное подключение (0 сум)',
      basePlanIncluded: 'Базовый тариф включает до',
      mastersWord: 'мастеров',
      branchesWord: 'филиалов',
      managerHint: 'Точную цену подтвердит менеджер',
      applyCalculationCta: 'Оставить заявку с этим расчётом',
      notFitMasters: 'Тариф «{plan}» рассчитан до {max} мастеров.',
      notFitBranches: 'Тариф «{plan}» рассчитан до {max} филиалов.',
      recommend: 'Под ваш размер подойдёт «{plan}».',
      switchCta: 'Пересчитать на «{plan}»',
      noPlanFits: 'Для салона такого размера подберём условия индивидуально — оставьте заявку.',
      individualCta: 'Оставить заявку',
    },
    faq: {
      eyebrow: 'Ответы на вопросы',
      title: 'Частые вопросы владельцев салонов',
      subtitle: 'Всё, что важно знать перед запуском онлайн-записи и мобильного приложения.',
      items: [
        {
          q: 'Нужен ли нам свой сайт для работы?',
          a: 'Нет, разрабатывать отдельный сайт не нужно. Вы сразу получаете готовую веб-страницу онлайн-записи для ссылки в Instagram и Telegram, а также брендированное мобильное приложение для ваших постоянных клиентов.',
        },
        {
          q: 'Как клиенты скачают приложение нашего салона?',
          a: 'После настройки вы получаете прямую ссылку и красивый QR-код для стойки администратора и соцсетей. Клиент наводит камеру, устанавливает приложение из Google Play или открывает веб-приложение на iPhone за пару секунд.',
        },
        {
          q: 'Что будет при неоплате подписки?',
          a: 'Ваша база и записи никогда не удаляются. При просрочке оплаты приложения временно переходят в режим просмотра — все данные клиентов, история визитов и расписание полностью сохраняются. После оплаты доступ мгновенно возобновляется.',
        },
        {
          q: 'Можно ли перенести нашу текущую базу клиентов?',
          a: 'Да! Если вы вели записи в Excel, другой CRM или телефонной книге, пришлите выгрузку нашему менеджеру при подключении — мы бесплатно импортируем имена, телефоны и историю клиентов.',
        },
        {
          q: 'Как оплачивать подписку в Узбекистане?',
          a: 'Оплачивать можно любым удобным способом: через Payme и Click прямо из Telegram-бота для владельца, корпоративной картой Uzcard/Humo или безналичным банковским переводом по счёту.',
        },
        {
          q: 'Работаете ли вы по официальному договору?',
          a: 'Да, мы работаем официально в Узбекистане, заключаем публичный договор-оферту или двусторонний договор через Didox и предоставляем закрывающие документы для бухгалтерии.',
        },
        {
          q: 'Сколько времени занимает подключение салона?',
          a: 'Настройка салона и запуск онлайн-записи занимают 1 рабочий день. Вы отправляете список услуг, цены, имена мастеров и логотип — остальное делает наша команда.',
        },
      ],
    },
    connect: {
      contactsTitle: 'Свяжитесь с нами',
      contactsText: 'Ответим на вопросы и покажем приложение с вашим логотипом.',
    },
    lead: {
      eyebrow: 'Подключение за 1 день',
      title: 'Оставьте заявку на подключение салона',
      subtitle:
        'Покажем, как будет выглядеть приложение с вашим логотипом, ответим на вопросы и откроем 14 дней бесплатного доступа.',
      salonNameLabel: 'Название салона',
      salonNamePlaceholder: 'Например, Barbershop Sardor',
      phoneLabel: 'Телефон',
      phonePlaceholder: '+998 __ ___-__-__',
      ownerNameLabel: 'Ваше имя',
      ownerNamePlaceholder: 'Как к вам обращаться',
      cityLabel: 'Город',
      cityPlaceholder: 'Ташкент, Самарканд, Бухара...',
      mastersLabel: 'Сколько мастеров',
      mastersPlaceholder: 'Например, 5',
      branchesLabel: 'Сколько филиалов',
      branchesPlaceholder: 'Например, 1',
      estimateLabel: 'Предварительный расчёт',
      estimatePerMonth: 'в месяц',
      estimateSetup: '+ подключение {sum} один раз',
      estimateNotFit: 'Тариф не рассчитан на такое число мастеров или филиалов — менеджер предложит подходящий.',
      planLabel: 'Тариф',
      planUnknownOption: 'Пока не знаю',
      messageLabel: 'Комментарий',
      messagePlaceholder: 'Расскажите о вашем салоне или задайте вопрос',
      submitButton: 'Отправить заявку',
      submittingButton: 'Отправляем...',
      privacyNotePrefix: 'Нажимая кнопку, вы соглашаетесь на ',
      privacyNoteLink: 'обработку персональных данных',
      privacyNoteSuffix: '',
      successTitle: 'Спасибо! Мы свяжемся с вами в течение рабочего дня',
      successSubtitle:
        'Ваша заявка принята. Если хотите ускорить запуск, напишите нам в Telegram прямо сейчас.',
      telegramCta: 'Написать в Telegram',
      sendAnother: 'Отправить ещё одну заявку',
      errors: {
        INVALID_NAME: 'Укажите название салона',
        INVALID_PHONE: 'Проверьте номер телефона',
        INVALID_MASTERS: 'Число мастеров — от 1 до 500',
        INVALID_BRANCHES: 'Число филиалов — от 1 до 100',
        TOO_MANY_REQUESTS: 'Попробуйте через несколько минут',
        DEFAULT: 'Не удалось отправить. Напишите нам в Telegram',
      },
    },
    footer: {
      tagline: 'Онлайн-запись и мобильное приложение для салонов красоты, парикмахерских, барбершопов и ателье в Узбекистане.',
      contactsTitle: 'Контакты',
      telegramLabel: 'Telegram:',
      phoneLabel: 'Телефон:',
      cityDisplay: 'г. Ташкент, Узбекистан',
      legalTitle: 'Документы',
      offerLink: 'Договор-оферта',
      privacyLink: 'Политика конфиденциальности',
      copyright: 'Все права защищены.',
    },
  },
  uz: {
    seo: {
      title: 'InsideFire Beauty — Saloningiz uchun onlayn yozuv va mobil ilova',
      description:
        "O'zbekistondagi go'zallik salonlari, sartaroshxonalar, barbershoplar, tirnoq studiyalari va atelyelar uchun platforma: 24/7 onlayn yozuv, mijozlar uchun shaxsiy ilova, ustalar jadvali hamda Payme va Click orqali to'lov.",
    },
    brandName: 'InsideFire Beauty',
    nav: {
      home: 'Bosh sahifa',
      features: 'Imkoniyatlar',
      plans: "Ta'riflar",
      calculator: 'Kalkulyator',
      forWhom: 'Kimlar uchun',
      faq: 'Savollar',
      connectCta: 'Salonni ulash',
      openMenu: 'Menyuni ochish',
      closeMenu: 'Menyuni yopish',
    },
    hero: {
      badge: "Go'zallik salonlari, sartaroshxonalar, barbershoplar va atelyelar uchun",
      title: 'Saloningiz uchun onlayn yozuv va mobil ilova',
      titleLead: 'Saloningiz uchun',
      titleAccent: 'onlayn yozuv va mobil ilova',
      subtitle:
        "Mijozlar 24/7 o'zlari bo'sh vaqtni tanlab yoziladi, administrator jadvalni tartibli yuritadi, salon egasi esa kunlik tushum va hisobotlarni Telegram'da kuzatadi.",
      primaryCta: 'Ariza qoldirish',
      secondaryCta: "Ta'riflarni ko'rish",
      prevSlide: 'Oldingi slayd',
      nextSlide: 'Keyingi slayd',
      goToSlide: "Slaydga o'tish",
      phoneAlt: 'Telefondagi salon ilovasi: haftalik jadval, bugungi yozuvlar va bo‘limlar',
    },
    trust: {
      eyebrow: 'Nega InsideFire',
      items: [
        {
          title: 'Yozuv 24/7',
          subtitle: "Mijozlar hatto tunda ham qo'ng'iroqlarsiz ustani va bo'sh vaqtni tanlaydi",
        },
        {
          title: '1 kunda ulanish',
          subtitle: "Xizmatlar narxini kiritamiz, ustalarni sozlaymiz va saloningiz ilovasini tayyorlab beramiz",
        },
        {
          title: '14 kun bepul',
          subtitle: "Oldindan to'lov va karta ulashsiz tanlangan ta'rifning barcha imkoniyatlari",
        },
        {
          title: "Telegram'da yordam",
          subtitle: "O'zbek va rus tillarida mutaxassislardan tezkor javob va ko'mak",
        },
      ],
    },
    segments: {
      eyebrow: 'Kimlar uchun',
      title: "Mijozlar ustaga yoziladigan har qanday salon uchun mos",
      subtitle:
        "Xizmatlar, davomiylik, narxlar va ustalar biznesingizga moslab sozlanadi — ikki kreslolik barbershopdan filiallari bor salonlar tarmog'igacha.",
      items: [
        { title: "Go'zallik salonlari", description: "Bir joyda bir nechta yo'nalish: soch, tirnoq, qosh, kosmetologiya." },
        { title: 'Ayollar sartaroshxonalari', description: "Soch olish, bo'yash, ukladka — har bir ustada o'z davomiyligi va narxi bilan." },
        { title: 'Erkaklar sartaroshxonalari va barbershoplar', description: "O'z barberingizga tez yozilish, eslatmalar va takroriy tashriflar." },
        { title: 'Tirnoq studiyalari', description: "Manikyur, pedikyur, uzaytirish — ustma-ust tushmaydigan zich jadval." },
        { title: 'Moda atelyelari', description: "Kiyib ko'rish, o'lcham olish va buyurtmani topshirish — navbatsiz va qo'ng'iroqsiz." },
        { title: 'Va boshqa salonlar', description: "Qosh va kipriklar, kosmetologiya, massaj, SPA, tatu — usta va yozilish vaqti bor hamma joy." },
      ],
    },
    whatSalonGets: {
      eyebrow: 'Tizim imkoniyatlari',
      title: 'Saloningiz nimalarga ega bo‘ladi',
      subtitle:
        "Mijozlar, administrator va biznes egasi uchun uyg'un ishlaydigan uchta qulay vosita.",
      cards: {
        client: {
          role: '01. Mijozlarga',
          title: 'Salon ilovasi va veb-sayti',
          description:
            "Sevimli ustaga bo'sh vaqtga 30 soniyada yozilish, avtomatik eslatmalar, haqqoniy sharhlar, tashriflar tarixi va bonuslar hisobi.",
          highlights: ['Sizning logotip va ranglaringiz', "Qo'ng'iroqsiz bo'sh vaqtni tanlash", 'Bonuslar, promokodlar va sertifikatlar'],
        },
        admin: {
          role: '02. Administratorga',
          title: 'Salon uchun boshqaruv ilovasi',
          description:
            "Barcha ustalarning qulay ish jadvali, yozuvlarni tez kiritish, mijozlar bazasi, xizmatlar va narxlarni boshqarish hamda tahlillar.",
          highlights: ['Ustalar jadvali bitta ekranda', "Mijozlar bazasi yo'qolmaydi", 'Xizmatlar, narxlar va bandlik hisobi'],
        },
        owner: {
          role: '03. Salon egasiga',
          title: 'Maxsus Telegram-bot',
          description:
            "To'lov haqida eslatmalar, kun yakunlari va tushum hisoboti, obunani Payme hamda Click orqali bir necha soniyada to'lash imkoniyati.",
          highlights: ["Kun yakunlari Telegram'da", "To'lov haqida o'z vaqtida eslatmalar", "Payme va Click orqali qulay to'lov"],
        },
      },
    },
    howToConnect: {
      eyebrow: 'Oson boshlash',
      title: 'Qanday ulanish mumkin',
      subtitle: "Murakkab sozlashlarsiz — barcha texnik ishlarni o'zimiz bajaramiz.",
      steps: [
        {
          step: '1-qadam',
          title: 'Ariza qoldirasiz',
          description: "Salon nomi va telefon raqamingizni qoldiring. Menejerimiz Telegram yoki telefon orqali bog'lanadi.",
        },
        {
          step: '2-qadam',
          title: 'Biz salon va ilovani sozlaymiz (1 kun)',
          description: "Narxlar ro'yxati, ustalar jadvali, logotip va firma ranglaringizni tizimga kiritib beramiz.",
        },
        {
          step: '3-qadam',
          title: "14 kun bepul foydalanasiz, so'ng — ta'rif bo'yicha",
          description: "Birinchi to'lovgacha mijozlarni qabul qilib, platforma qulayligini amalda sinab ko'rasiz.",
        },
      ],
    },
    plans: {
      eyebrow: 'Shaffof narxlar',
      title: "Har qanday salon uchun qulay ta'riflar",
      subtitle: "Mos rejani tanlang. Barcha ta'riflarda 14 kunlik bepul sinov muddati mavjud.",
      popularBadge: 'Ommabop',
      perMonth: 'oyiga',
      setupFeePrefix: 'ulanish —',
      mastersLimit: 'Ustalar:',
      unlimited: 'cheklovsiz',
      branchesLimit: 'Filiallar:',
      extraMasterPrefix: "Qo'shimcha usta:",
      extraBranchPrefix: "Qo'shimcha filial:",
      selectPlanButton: 'Tanlash',
      includedLabel: 'Nimalar kiradi',
      includesPrev: "«{plan}»dagi hamma narsa, qo'shimcha:",
      fallbackTitle: 'Narxlarni menejerdan aniqlashtiring',
      fallbackDescription:
        "Saloningiz ma'lumotlarini qoldiring — ustalar va filiallar soniga qarab eng qulay ta'rifni 10 daqiqada hisoblab beramiz.",
      fallbackButton: 'Hisob-kitob uchun ariza qoldirish',
    },
    featureNames: {
      online_booking: 'Onlayn yozuv 24/7',
      client_app: "Mijozlar uchun o'z ilovangiz",
      branding: 'Sizning logotip va ranglaringiz',
      play_publish: "Google Play'ga joylash",
      reviews: 'Mijozlar sharhlari',
      chat: 'Mijozlar bilan chat',
      loyalty: "Promokodlar va «do'stni taklif qil»",
      gift_certificates: "Sovg'a sertifikatlari",
      packages: 'Abonementlar',
      waitlist: "Kutish ro'yxati",
      content: 'Ilovada yangiliklar va bannerlar',
      telegram: 'Ishlarni Telegram-kanalga joylash',
      rebook_reminders: '«Yozilish vaqti keldi» eslatmalari',
      analytics: 'Tushum va ustalar tahlili',
    } as Record<KnownFeatureCode, string>,
    calculator: {
      title: 'Narx kalkulyatori',
      subtitle: 'Jamoangiz va filiallar soniga qarab oylik obuna narxini hisoblang',
      selectPlanLabel: "Ta'rif",
      mastersLabel: 'Ustalar',
      branchesLabel: 'Filiallar',
      monthlyTotalLabel: 'Oyiga jami',
      setupOncePrefix: '+ ulanish',
      setupOnceSuffix: 'bir marta',
      freeSetup: "Ulanish bepul (0 so'm)",
      basePlanIncluded: "Asosiy ta'rif ichida:",
      mastersWord: 'tagacha usta',
      branchesWord: 'tagacha filial',
      managerHint: 'Aniq narxni menejer tasdiqlaydi',
      applyCalculationCta: 'Shu hisob-kitob bilan ariza qoldirish',
      notFitMasters: "«{plan}» ta'rifi {max} tagacha usta uchun mo'ljallangan.",
      notFitBranches: "«{plan}» ta'rifi {max} tagacha filial uchun mo'ljallangan.",
      recommend: "Sizga «{plan}» ta'rifi mos keladi.",
      switchCta: "«{plan}» bo'yicha hisoblash",
      noPlanFits: "Bunday hajmdagi salon uchun shartlarni alohida tanlaymiz — ariza qoldiring.",
      individualCta: 'Ariza qoldirish',
    },
    faq: {
      eyebrow: 'Savol va javoblar',
      title: "Ko'p beriladigan savollar",
      subtitle: "Onlayn yozuv va mobil ilovani ishga tushirishdan oldin muhim ma'lumotlar.",
      items: [
        {
          q: "Ishlash uchun alohida shaxsiy sayt kerakmi?",
          a: "Yo'q, alohida sayt yaratish shart emas. Sizga Instagram va Telegram sahifangizga qo'yish uchun tayyor onlayn-yozuv veb-sahifasi hamda mijozlar uchun mobil ilova taqdim etiladi.",
        },
        {
          q: 'Mijozlar salonimiz ilovasini qanday yuklab oladi?',
          a: "Ulanishdan so'ng sizga to'g'ridan-to'g'ri havola va resepshn uchun chiroyli QR-kod beriladi. Mijoz telefon kamerasini yo'naltirib, Google Play'dan yoki iPhone'da veb-ilova sifatida bir necha soniyada o'rnatib oladi.",
        },
        {
          q: "Obuna vaqtida to'lanmasa nima bo'ladi?",
          a: "Ma'lumotlaringiz hech qachon o'chib ketmaydi. To'lov kechiksa, ilovalar vaqtincha ko'rish rejimiga o'tadi, barcha mijozlar bazasi va yozuvlar to'liq saqlanadi. To'lov qilingach, tizim darhol faollashadi.",
        },
        {
          q: "Mavjud mijozlar bazasini ko'chirib o'tsa bo'ladimi?",
          a: "Ha, albatta! Agar mijozlar ro'yxatini Excel, boshqa dastur yoki telefon kitobida yuritgan bo'lsangiz, ulanish vaqtida menejerimizga yuboring — biz ularni bepul tizimga yuklab beramiz.",
        },
        {
          q: "Obuna uchun to'lov qanday amalga oshiriladi?",
          a: "To'lovni Payme va Click orqali bevosita Telegram-bot ichida, Uzcard/Humo korporativ kartasi yoki hisob-faktura bo'yicha bank o'tkazmasi orqali amalga oshirishingiz mumkin.",
        },
        {
          q: 'Rasmiy shartnoma asosida ishlaysizlarmi?',
          a: "Ha, biz O'zbekistonda rasmiy faoliyat yuritamiz. Ommaviy oferta yoki Didox orqali ikki tomonlama shartnoma tuzamiz va buxgalteriya hujjatlarini taqdim etamiz.",
        },
        {
          q: 'Salonni ulash qancha vaqt oladi?',
          a: "Salonni sozlash va onlayn yozuvni ishga tushirish atigi 1 ish kunini oladi. Sizdan faqat xizmatlar ro'yxati, narxlar, ustalar ismi va logotip kerak bo'ladi.",
        },
      ],
    },
    connect: {
      contactsTitle: "Biz bilan bog'laning",
      contactsText: "Savollaringizga javob beramiz va ilovani logotipingiz bilan ko'rsatamiz.",
    },
    lead: {
      eyebrow: '1 kunda ishga tushirish',
      title: 'Salonni ulash uchun ariza qoldiring',
      subtitle:
        "Logotipingiz bilan ilova qanday ko'rinishini ko'rsatamiz, savollaringizga javob beramiz va 14 kunlik bepul sinov muddatini ochib beramiz.",
      salonNameLabel: 'Salon nomi',
      salonNamePlaceholder: 'Masalan, Barbershop Sardor',
      phoneLabel: 'Telefon',
      phonePlaceholder: '+998 __ ___-__-__',
      ownerNameLabel: 'Ismingiz',
      ownerNamePlaceholder: 'Ismingizni kiriting',
      cityLabel: 'Shahar',
      cityPlaceholder: 'Toshkent, Samarqand, Buxoro...',
      mastersLabel: 'Ustalar soni',
      mastersPlaceholder: 'Masalan, 5',
      branchesLabel: 'Nechta filial',
      branchesPlaceholder: 'Masalan, 1',
      estimateLabel: 'Taxminiy hisob',
      estimatePerMonth: 'oyiga',
      estimateSetup: '+ ulanish {sum} bir marta',
      estimateNotFit: "Ta'rif bunday usta yoki filiallar soniga mo'ljallanmagan — menejer mosini taklif qiladi.",
      planLabel: "Ta'rif",
      planUnknownOption: 'Hozircha bilmayman',
      messageLabel: 'Izoh',
      messagePlaceholder: 'Saloningiz haqida yozing yoki savol qoldiring',
      submitButton: 'Arizani yuborish',
      submittingButton: 'Yuborilmoqda...',
      privacyNotePrefix: 'Tugmani bosish orqali ',
      privacyNoteLink: "shaxsiy ma'lumotlarni qayta ishlashga",
      privacyNoteSuffix: ' rozilik bildirasiz',
      successTitle: "Rahmat! Ish kuni davomida siz bilan bog'lanamiz",
      successSubtitle:
        "Arizangiz qabul qilindi. Tezroq boshlashni istasangiz, hoziroq bizga Telegram'da yozing.",
      telegramCta: "Telegram'da yozish",
      sendAnother: 'Yana bitta ariza yuborish',
      errors: {
        INVALID_NAME: 'Salon nomini kiriting',
        INVALID_PHONE: 'Telefon raqamini tekshiring',
        INVALID_MASTERS: 'Ustalar soni — 1 dan 500 gacha',
        INVALID_BRANCHES: 'Filiallar soni — 1 dan 100 gacha',
        TOO_MANY_REQUESTS: "Bir necha daqiqadan so'ng qayta urinib ko'ring",
        DEFAULT: "Yuborib bo'lmadi. Bizga Telegram orqali yozing",
      },
    },
    footer: {
      tagline: "O'zbekistondagi go'zallik salonlari, sartaroshxonalar, barbershoplar va atelyelar uchun onlayn yozuv va mobil ilova.",
      contactsTitle: 'Aloqa',
      telegramLabel: 'Telegram:',
      phoneLabel: 'Telefon:',
      cityDisplay: "Toshkent sh., O'zbekiston",
      legalTitle: 'Hujjatlar',
      offerLink: 'Ommaviy oferta shartnomasi',
      privacyLink: 'Maxfiylik siyosati',
      copyright: 'Barcha huquqlar himoyalangan.',
    },
  },
};

/** Подставляет значения в шаблон вида «Тариф «{plan}» до {max} мастеров». */
export function fill(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => String(values[key] ?? ''));
}
