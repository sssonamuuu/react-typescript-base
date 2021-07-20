
function getCookie (name: string) {
  const arr = document.cookie.match(new RegExp(`(^| )${name}=([^;]*)(;|$)`));
  return arr ? unescape(arr[2]) : null;
}

function setCookie (name: string, value: string) {
  const expires = new Date();
  expires.setTime(expires.getTime() + 30 * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${escape(value)};expires=${expires.toUTCString()};path=/;`;
}

function removeCookie (name: string) {
  const expires = new Date();
  expires.setTime(expires.getTime() - 1);
  const val = getCookie(name);
  if (val) {
    document.cookie = `${name}=${val};expires=${expires.toUTCString()};path=/;`;
  }
}

type MemoryType = 'cookie' | 'localStorage' | 'sessionStorage';

interface MemoryProps {
  key: string;
  /** 类型，默认 localStorage */
  type?: MemoryType;
}

export default class Memory<T> {
  #key: string;
  #type: MemoryType;

  constructor ({ key, type = 'localStorage' }: MemoryProps) {
    this.#key = key;
    this.#type = type;
  }

  get (): null | T;
  get (defaultValue: T): T;
  get (defaultValue: T | null = null): T | null {
    let value;
    switch (this.#type) {
      case 'cookie':
        value = getCookie(this.#key);
        break;
      case 'localStorage':
        value = localStorage.getItem(this.#key);
        break;
      default:
        value = sessionStorage.getItem(this.#key);
        break;
    }

    if (value === null) {
      return defaultValue;
    }

    try {
      return JSON.parse(value as string);
    } catch {
      return defaultValue;
    }
  }

  set (value: T): T {
    const strValue = JSON.stringify(value);
    switch (this.#type) {
      case 'cookie':
        setCookie(this.#key, strValue);
        break;
      case 'localStorage':
        localStorage.setItem(this.#key, strValue);
        break;
      default:
        sessionStorage.setItem(this.#key, strValue);
        break;
    }
    return value;
  }

  remove () {
    switch (this.#type) {
      case 'cookie':
        removeCookie(this.#key);
        break;
      case 'localStorage':
        localStorage.removeItem(this.#key);
        break;
      default:
        sessionStorage.removeItem(this.#key);
        break;
    }
  }
}
