import { canUseDOM } from './dom';

export const IPHONE_SAFARI_BOTTOM_BAR = 45;
export const IPHONE_X_SAFARI_BOTTOM_BAR = 85;

export const IPHONE_KEYBOARD_REJECT_OFFSET = 180;

// 44 iPhone, 55 iPad, iPad Pro 69
export const IOS_NO_KEYBOARD_ALLOWED_OFFSET = 70;

export function detectIOS(ua?: string) {
  if (!ua) {
    ua = canUseDOM ? navigator.userAgent.toLowerCase() : '';
  }

  const isIPadOS = checkIPadOS(ua);
  const isIPad = isIPadOS || ua.indexOf('ipad') !== -1;
  const isIPhone = !isIPad && ua.search(/iphone|ipod/) !== -1;
  const isIOS = isIPhone || isIPad;

  let iosVersion: string[] | typeof isIOS | ReturnType<typeof String.prototype.match> =
    isIOS && ua.match(/OS ([\d_]+) like Mac OS X/i);
  let iosMajor = 0;
  let iosMinor = 0;

  if (isIPadOS) {
    iosMajor = 13;
    iosMinor = 0;
  } else if (iosVersion) {
    iosVersion = iosVersion[1].split('_');
    iosMajor = +iosVersion[0];
    iosMinor = +iosVersion[1];
  }

  iosVersion = null;

  const isScrollBasedViewport = iosMajor < 13 && !(iosMajor === 11 && iosMinor < 3);
  const isWKWebView = isIOS && checkWKWebView(ua);

  let isIPhoneX = false;

  if (canUseDOM) {
    isIPhoneX =
      isIOS && screen.width === 375 && screen.height === 812 && window.devicePixelRatio === 3;
  }

  const isIOSChrome = ua.search(/crios/i) !== -1;

  return {
    isIPad,
    isIPhone,
    isIOS,
    isIPadOS,
    iosMajor,
    iosMinor,
    isWKWebView,
    isScrollBasedViewport,
    isIPhoneX,
    isIOSChrome,
  };
}

const detect = /*#__PURE__*/ detectIOS();

export const isIPad = /*#__PURE__*/ (() => detect.isIPad)();
export const isIPhone = /*#__PURE__*/ (() => detect.isIPhone)();
export const isIOS = /*#__PURE__*/ (() => detect.isIOS)();
export const isIPadOS = /*#__PURE__*/ (() => detect.isIPadOS)();
export const iosMajor = /*#__PURE__*/ (() => detect.iosMajor)();
export const iosMinor = /*#__PURE__*/ (() => detect.iosMinor)();
export const isWKWebView = /*#__PURE__*/ (() => detect.isWKWebView)();
export const isScrollBasedViewport = /*#__PURE__*/ (() => detect.isScrollBasedViewport)();
export const isIPhoneX = /*#__PURE__*/ (() => detect.isIPhoneX)();
export const isIOSChrome = /*#__PURE__*/ (() => detect.isIOSChrome)();

export function isLandscapePhone() {
  return Math.abs(window.orientation) === 90 && !isIPad;
}

// Reference:
// https://stackoverflow.com/questions/28795476/detect-if-page-is-loaded-inside-wkwebview-in-javascript/30495399#30495399
function checkWKWebView(ua: string) {
  if (!canUseDOM) {
    return false;
  }

  const webkit = (window as any).webkit;

  if (webkit && webkit.messageHandlers) {
    return true;
  }

  const lte9 = /constructor/i.test(String(window.HTMLElement));
  const idb = !!window.indexedDB;

  if (
    ua.indexOf('safari') !== -1 &&
    ua.indexOf('version') !== -1 &&
    !(navigator as any).standalone
  ) {
    // Safari (WKWebView/Nitro since 6+)
  } else if ((!idb && lte9) || !(window.statusbar && window.statusbar.visible)) {
    // UIWebView
  } else if (!lte9 || idb) {
    // WKWebView
    return true;
  }

  return false;
}

export function checkIPadOS(ua: string) {
  if (!canUseDOM) {
    return false;
  }

  const notIOS = !/ipad|iphone|ipod/.test(ua);
  const macOS = /mac os/.test(ua);

  if (macOS && notIOS && typeof (navigator as any).standalone === 'boolean') {
    return true;
  }

  return false;
}
