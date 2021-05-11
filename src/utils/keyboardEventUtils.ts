import React from 'react';

const keyMaps = {
  Enter: { key: 'Enter', code: 13 },
  Esc: { key: 'Escape', code: 27 },
  ArrowLeft: { key: 'ArrowLeft', code: 37 },
  ArrowRight: { key: 'ArrowRight', code: 39 },
};

type Event = React.KeyboardEvent | KeyboardEvent;

type Keys = keyof typeof keyMaps;

const isKey: { [K in `is${Keys}`]: (e: Event) => boolean } = Object.entries(keyMaps).reduce((p, [key, value]) => ({
  ...p,
  [`is${key}`]: (e: Event) => e.key === value.key || e.keyCode === value.code,
}), {}) as { [K in `is${Keys}`]: (e: Event) => boolean };

const keyboardEventUtils = { ...isKey };

export default keyboardEventUtils;
