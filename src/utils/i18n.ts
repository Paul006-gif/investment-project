export interface Locale {
	lang: string;
	country: string;
	name: string;
	languageLabel: string;
	regionLabel: string;
}

export interface Translations {
	hero: {
		motto: string;
		subMotto: string;
		getStarted: string;
	};
	header: {
		home: string;
		aboutUs: string;
		services: string;
		investmentPlans: string;
		faqs: string;
		getSupport: string;
		signIn: string;
		signUp: string;
	};
	languageModal: {
		title: string;
		searchPlaceholder: string;
	};
}

export const locales: Locale[] = [
	{
		lang: 'en',
		country: 'US',
		name: 'English (United States)',
		languageLabel: 'English',
		regionLabel: 'United States'
	},
	{
		lang: 'en',
		country: 'GB',
		name: 'English (United Kingdom)',
		languageLabel: 'English',
		regionLabel: 'United Kingdom'
	},
	{
		lang: 'es',
		country: 'ES',
		name: 'Español (España)',
		languageLabel: 'Español',
		regionLabel: 'España'
	},
	{
		lang: 'es',
		country: 'MX',
		name: 'Español (México)',
		languageLabel: 'Español',
		regionLabel: 'México'
	},
	{
		lang: 'fr',
		country: 'FR',
		name: 'Français (France)',
		languageLabel: 'Français',
		regionLabel: 'France'
	},
	{
		lang: 'fr',
		country: 'CA',
		name: 'Français (Canada)',
		languageLabel: 'Français',
		regionLabel: 'Canada'
	},
	{
		lang: 'de',
		country: 'DE',
		name: 'Deutsch (Deutschland)',
		languageLabel: 'Deutsch',
		regionLabel: 'Deutschland'
	},
	{
		lang: 'it',
		country: 'IT',
		name: 'Italiano (Italia)',
		languageLabel: 'Italiano',
		regionLabel: 'Italia'
	},
	{
		lang: 'pt',
		country: 'BR',
		name: 'Português (Brasil)',
		languageLabel: 'Português',
		regionLabel: 'Brasil'
	},
	{
		lang: 'pt',
		country: 'PT',
		name: 'Português (Portugal)',
		languageLabel: 'Português',
		regionLabel: 'Portugal'
	}
];

const translationsByLang: Record<string, Translations> = {
	en: {
		hero: {
			motto: 'Building Wealth<br>Beyond Borders',
			subMotto:
				'The investment climate is changing, and investors need to create financial legacies that will stand the test of time. As the largest digital currency asset manager, horizon-wealth helps investors access the ever-evolving digital economy to build their future in the present.',
			getStarted: 'Get Started'
		},
		header: {
			home: 'Home',
			aboutUs: 'About Us',
			services: 'Services',
			investmentPlans: 'Investment Plans',
			faqs: 'FAQs',
			getSupport: 'Get Support',
			signIn: 'Sign In',
			signUp: 'Sign Up'
		},
		languageModal: {
			title: 'Language and region',
			searchPlaceholder: 'Search'
		}
	},
	es: {
		hero: {
			motto: 'Construyendo riqueza<br>sin fronteras',
			subMotto:
				'El clima de inversión está cambiando, y los inversionistas necesitan crear legados financieros que perduren. Como el mayor gestor de activos de moneda digital, horizon-wealth ayuda a los inversionistas a acceder a la economía digital en constante evolución para construir su futuro en el presente.',
			getStarted: 'Comenzar'
		},
		header: {
			home: 'Inicio',
			aboutUs: 'Sobre Nosotros',
			services: 'Servicios',
			investmentPlans: 'Planes de Inversión',
			faqs: 'Preguntas Frecuentes',
			getSupport: 'Soporte',
			signIn: 'Iniciar Sesión',
			signUp: 'Registrarse'
		},
		languageModal: {
			title: 'Idioma y región',
			searchPlaceholder: 'Buscar'
		}
	},
	fr: {
		hero: {
			motto: 'Construire une richesse<br>au-delà des frontières',
			subMotto:
				'Le climat d’investissement évolue, et les investisseurs doivent créer des héritages financiers durables. En tant que plus grand gestionnaire d’actifs numériques, horizon-wealth aide les investisseurs à accéder à l’économie numérique en constante évolution pour bâtir leur avenir dès aujourd’hui.',
			getStarted: 'Commencer'
		},
		header: {
			home: 'Accueil',
			aboutUs: 'À Propos',
			services: 'Services',
			investmentPlans: 'Plans d’Investissement',
			faqs: 'FAQ',
			getSupport: 'Support',
			signIn: 'Se Connecter',
			signUp: 'S’inscrire'
		},
		languageModal: {
			title: 'Langue et région',
			searchPlaceholder: 'Rechercher'
		}
	},
	de: {
		hero: {
			motto: 'Wohlstand über<br>Grenzen hinaus aufbauen',
			subMotto:
				'Das Anlageumfeld verändert sich, und Anleger müssen finanzielle Vermächtnisse schaffen, die Bestand haben. Als größter Vermögensverwalter für digitale Währungen hilft horizon-wealth Anlegern, Zugang zur sich ständig weiterentwickelnden digitalen Wirtschaft zu erhalten und ihre Zukunft in der Gegenwart aufzubauen.',
			getStarted: 'Loslegen'
		},
		header: {
			home: 'Startseite',
			aboutUs: 'Über Uns',
			services: 'Dienstleistungen',
			investmentPlans: 'Anlagepläne',
			faqs: 'FAQ',
			getSupport: 'Support',
			signIn: 'Anmelden',
			signUp: 'Registrieren'
		},
		languageModal: {
			title: 'Sprache und Region',
			searchPlaceholder: 'Suchen'
		}
	},
	it: {
		hero: {
			motto: 'Costruire ricchezza<br>oltre i confini',
			subMotto:
				'Il clima degli investimenti sta cambiando e gli investitori devono creare eredità finanziarie durature. In qualità di maggiore gestore di asset in valuta digitale, horizon-wealth aiuta gli investitori ad accedere all’economia digitale in continua evoluzione per costruire il loro futuro nel presente.',
			getStarted: 'Inizia Ora'
		},
		header: {
			home: 'Home',
			aboutUs: 'Chi Siamo',
			services: 'Servizi',
			investmentPlans: 'Piani di Investimento',
			faqs: 'FAQ',
			getSupport: 'Supporto',
			signIn: 'Accedi',
			signUp: 'Registrati'
		},
		languageModal: {
			title: 'Lingua e regione',
			searchPlaceholder: 'Cerca'
		}
	},
	pt: {
		hero: {
			motto: 'Construindo riqueza<br>além das fronteiras',
			subMotto:
				'O cenário de investimentos está mudando, e os investidores precisam criar legados financeiros duradouros. Como o maior gestor de ativos de moeda digital, horizon-wealth ajuda os investidores a acessar a economia digital em constante evolução para construir seu futuro no presente.',
			getStarted: 'Começar'
		},
		header: {
			home: 'Início',
			aboutUs: 'Sobre Nós',
			services: 'Serviços',
			investmentPlans: 'Planos de Investimento',
			faqs: 'Perguntas Frequentes',
			getSupport: 'Suporte',
			signIn: 'Entrar',
			signUp: 'Cadastrar-se'
		},
		languageModal: {
			title: 'Idioma e região',
			searchPlaceholder: 'Pesquisar'
		}
	}
};

export const defaultLocale: Locale = locales[0];

export function getLocaleKey(locale: Locale): string {
	return `${locale.lang}-${locale.country}`;
}

export function findLocale(localeKey?: string | null): Locale {
	if (!localeKey) {
		return defaultLocale;
	}
	const [lang, country] = localeKey.split('-');
	const match = locales.find((locale) => locale.lang === lang && locale.country === country);
	return match ?? defaultLocale;
}

export function getCurrentLocale(): Locale {
	if (typeof document !== 'undefined') {
		const cookieLocale = getCookieLocale();
		if (cookieLocale) {
			return cookieLocale;
		}
		const stored = localStorage.getItem('locale');
		if (stored) {
			const parsed = JSON.parse(stored);
			return findLocale(getLocaleKey(parsed));
		}
	}
	return defaultLocale;
}

function getCookieLocale(): Locale | null {
	if (typeof document === 'undefined') {
		return null;
	}
	const match = document.cookie.match(/(?:^|; )locale=([^;]*)/);
	if (!match) {
		return null;
	}
	return findLocale(decodeURIComponent(match[1]));
}

export function setLocale(locale: Locale): void {
	if (typeof document !== 'undefined') {
		const localeKey = getLocaleKey(locale);
		localStorage.setItem('locale', JSON.stringify(locale));
		document.cookie = `locale=${localeKey}; path=/; max-age=${60 * 60 * 24 * 365}`;
		window.location.reload();
	}
}

export function getTranslations(locale: Locale = defaultLocale): Translations {
	return translationsByLang[locale.lang] ?? translationsByLang[defaultLocale.lang];
}

