import React from 'react';
import * as Sentry from '@sentry/react';
import {
	createRoutesFromChildren,
	matchRoutes,
	useLocation,
	useNavigationType
} from 'react-router-dom';

/**
 * Get the app section from the URL for better error categorization
 */
function getSectionFromUrl(pathname: string): string {
	if (pathname === '/') return 'map';
	if (pathname.startsWith('/webcam/')) return 'webcam';
	if (pathname.startsWith('/country/')) return 'list-country';
	if (pathname.startsWith('/state/')) return 'list-state';
	if (pathname.startsWith('/county/')) return 'list-county';
	if (pathname.startsWith('/city/')) return 'list-city';
	if (pathname.startsWith('/webcams/')) return 'sitemap-webcams';
	if (pathname.startsWith('/places/')) return 'sitemap-places';
	if (pathname.startsWith('/maintenance/')) return 'maintenance';
	if (pathname === '/404') return '404';
	return 'unknown';
}

/**
 * Initialize Sentry for error tracking and performance monitoring.
 * Only initializes if VITE_SENTRY_DSN is provided (production environment).
 */
export function initializeSentry(): void {
	const sentryDsn = import.meta.env.VITE_SENTRY_DSN;
	const environment = import.meta.env.MODE;
	const isDevelopment = import.meta.env.DEV;

	// Only initialize Sentry if DSN is provided (production)
	if (!sentryDsn || isDevelopment) {
		// eslint-disable-next-line no-console
		console.log(
			'Sentry not initialized - running in development mode or DSN not provided'
		);
		return;
	}

	Sentry.init({
		dsn: sentryDsn,
		environment,

		// Performance Monitoring
		integrations: [
			// React Router integration for better transaction names
			Sentry.reactRouterV6BrowserTracingIntegration({
				useEffect: React.useEffect,
				useLocation,
				useNavigationType,
				createRoutesFromChildren,
				matchRoutes
			}),

			// Replay integration for session replay
			Sentry.replayIntegration({
				// Mask all text and block all media by default for privacy
				maskAllText: true,
				blockAllMedia: true
			}),

			// Browser profiling
			Sentry.browserProfilingIntegration(),

			// Feedback integration for user feedback
			Sentry.feedbackIntegration({
				colorScheme: 'system',
				autoInject: false // Manual injection for better control
			})
		],

		// Performance Monitoring sample rate
		tracesSampleRate: 1.0, // Capture 100% of transactions for performance monitoring

		// Session Replay sample rate
		replaysSessionSampleRate: 0.1, // 10% of sessions
		replaysOnErrorSampleRate: 1.0, // 100% of sessions with errors

		// Browser profiling sample rate
		profilesSampleRate: 1.0,

		// Send default PII (personally identifiable information)
		sendDefaultPii: false,

		// Set the release version
		release: import.meta.env.VITE_APP_VERSION || 'unknown',

		// Ignore common errors that aren't actionable
		ignoreErrors: [
			// Browser extensions
			'top.GLOBALS',
			'chrome-extension://',
			'moz-extension://',
			// Network errors
			'NetworkError',
			'Network request failed',
			// Random plugins/extensions
			'ResizeObserver loop limit exceeded',
			'ResizeObserver loop completed with undelivered notifications'
		],

		// Filter out breadcrumbs from console logs in production
		beforeBreadcrumb(breadcrumb) {
			if (breadcrumb.category === 'console' && breadcrumb.level === 'log') {
				return null;
			}
			return breadcrumb;
		},

		// Add custom context before sending events
		beforeSend(event) {
			// Add custom tags for better categorization
			const updatedEvent = {
				...event,
				tags: {
					...event.tags,
					'app.section': getSectionFromUrl(window.location.pathname)
				}
			};

			return updatedEvent;
		}
	});

	// Set custom user context if available
	const userId = localStorage.getItem('userId');
	if (userId) {
		Sentry.setUser({ id: userId });
	}

	// eslint-disable-next-line no-console
	console.log('Sentry initialized successfully');
}

/**
 * Manually capture an exception with Sentry
 */
export function captureException(
	error: Error,
	context?: Record<string, unknown>
): void {
	if (import.meta.env.VITE_SENTRY_DSN && !import.meta.env.DEV) {
		Sentry.captureException(error, {
			extra: context
		});
	} else {
		// eslint-disable-next-line no-console
		console.error('Error:', error, context);
	}
}

/**
 * Manually capture a message with Sentry
 */
export function captureMessage(
	message: string,
	level: Sentry.SeverityLevel = 'info'
): void {
	if (import.meta.env.VITE_SENTRY_DSN && !import.meta.env.DEV) {
		Sentry.captureMessage(message, level);
	} else {
		// eslint-disable-next-line no-console
		console.log(`[${level}] ${message}`);
	}
}

/**
 * Add breadcrumb for debugging
 */
export function addBreadcrumb(breadcrumb: Sentry.Breadcrumb): void {
	if (import.meta.env.VITE_SENTRY_DSN && !import.meta.env.DEV) {
		Sentry.addBreadcrumb(breadcrumb);
	}
}

/**
 * Set user context
 */
export function setUser(user: Sentry.User | null): void {
	if (import.meta.env.VITE_SENTRY_DSN && !import.meta.env.DEV) {
		Sentry.setUser(user);
	}
}

/**
 * Set custom context for errors
 */
export function setContext(
	name: string,
	context: Record<string, unknown>
): void {
	if (import.meta.env.VITE_SENTRY_DSN && !import.meta.env.DEV) {
		Sentry.setContext(name, context);
	}
}

/**
 * Add custom tags to errors
 */
export function setTag(key: string, value: string): void {
	if (import.meta.env.VITE_SENTRY_DSN && !import.meta.env.DEV) {
		Sentry.setTag(key, value);
	}
}

// Export Sentry for direct access if needed
export { Sentry };
